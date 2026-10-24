const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * @route GET /api/governance/proposals
 * @desc Retrieve all recorded governance proposals with optional status filtering
 */
router.get("/proposals", async (req, res) => {
    try {
        const { status } = req.query;
        let query = `SELECT * FROM governance_proposals ORDER BY created_at DESC;`;
        let values = [];

        if (status) {
            query = `SELECT * FROM governance_proposals WHERE status = $1 ORDER BY created_at DESC;`;
            values = [status];
        }

        const result = await db.query(query, values);
        res.status(200).json({ success: true, count: result.rows.length, proposals: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route POST /api/governance/proposals/create
 * @desc Record a new governance proposal submitted to LucricityGovernor
 */
router.post("/proposals/create", async (req, res) => {
    try {
        const {
            proposalId,
            proposerWallet,
            targets,
            values,
            signatures,
            calldatas,
            startBlock,
            endBlock,
            description
        } = req.body;

        if (!proposalId || !proposerWallet || !description) {
            return res.status(400).json({ success: false, error: "Missing mandatory proposal details" });
        }

        const query = `
            INSERT INTO governance_proposals 
            (proposal_id, proposer_wallet, targets, values, signatures, calldatas, start_block, end_block, description, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pending')
            RETURNING *;
        `;
        const queryParams = [
            proposalId,
            proposerWallet,
            targets || [],
            values || [],
            signatures || [],
            calldatas || [],
            startBlock || 0,
            endBlock || 0,
            description
        ];

        const result = await db.query(query, queryParams);
        res.status(201).json({ success: true, proposal: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route PATCH /api/governance/proposals/status
 * @desc Update the execution or lifecycle status of a proposal
 */
router.patch("/proposals/status", async (req, res) => {
    try {
        const { proposalId, status } = req.body;

        if (!proposalId || !status) {
            return res.status(400).json({ success: false, error: "Proposal ID and new status are required" });
        }

        const query = `
            UPDATE governance_proposals
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE proposal_id = $2
            RETURNING *;
        `;
        const result = await db.query(query, [status, proposalId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Proposal not found" });
        }

        res.status(200).json({ success: true, proposal: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
