"use client";

import { useState, useEffect } from "react";

export default function UnifiedGovernanceDashboard() {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [stats, setStats] = useState({
    activeProposals: 0,
    totalModules: 7,
    busConnected: true,
  });

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      } fontFinally: {
        setLoading(false);
      }
    } else {
      alert("MetaMask or a Web3 compatible wallet is required.");
    }
  };

  useEffect(() => {
    // Fetch active governance proposals from backend Cloud Run API
    fetch("/api/governance/proposals?status=Active")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProposals(data.proposals || []);
          setStats((prev) => ({ ...prev, activeProposals: data.count || 0 }));
        }
      })
      .catch((err) => console.error("Error fetching proposals:", err));
  }, []);

  return (
    <main className="space-y-8">
      {/* Top Hero / Status Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            BEAST Private Government Gateway
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            Sovereign administrative framework operating decentralized governance, property, 
            dispute resolution, mutual aid, identity, and peer-to-peer commerce.
          </p>
        </div>

        <div>
          {account ? (
            <div className="bg-slate-950 border border-emerald-500/30 px-5 py-3 rounded-xl text-right">
              <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">
                Connected Delegate
              </span>
              <span className="font-mono text-emerald-400 font-medium">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-950"
            >
              {loading ? "Connecting Wallet..." : "Connect Sovereign Wallet"}
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Active Sovereign Pillars
          </p>
          <p className="text-3xl font-bold text-slate-100 mt-2">{stats.totalModules}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Active Governance Proposals
          </p>
          <p className="text-3xl font-bold text-sky-400 mt-2">{stats.activeProposals}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            System Bus Interoperability
          </p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">
            {stats.busConnected ? "Operational" : "Degraded"}
          </p>
        </div>
      </div>

      {/* Governance & Proposals Overview */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">
          Recent Governance Proposals (`LucricityGovernor`)
        </h2>
        {proposals.length === 0 ? (
          <p className="text-slate-400 text-sm py-8 text-center border border-dashed border-slate-800 rounded-xl">
            No active proposals currently open for voting.
          </p>
        ) : (
          <div className="space-y-4">
            {proposals.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-sm font-medium text-slate-200">{item.description}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    Proposal ID: {item.proposal_id} | Proposer: {item.proposer_wallet}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
