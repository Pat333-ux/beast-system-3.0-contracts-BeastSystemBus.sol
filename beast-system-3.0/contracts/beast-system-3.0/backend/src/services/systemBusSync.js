const { ethers } = require("ethers");
const db = require("../db");

const SYSTEM_BUS_ABI = [
  "event ModuleAddressesUpdated(address indexed credentialRegistry, address indexed arbitration)"
];
const CREDENTIAL_ABI = [
  "event CredentialIssued(uint256 indexed credentialId, address indexed holder, address indexed issuer, string credentialType)",
  "event CredentialRevoked(uint256 indexed credentialId)"
];

async function initializeSystemBusListener(providerUrl, busAddress) {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const busContract = new ethers.Contract(busAddress, SYSTEM_BUS_ABI, provider);

  console.log(`[BEAST System Bus] Monitoring active bus contract at ${busAddress}`);

  busContract.on("ModuleAddressesUpdated", async (credRegistry, arbitration, event) => {
    console.log(`[BEAST System Bus] Module Registry Updated: Credential -> ${credRegistry}, Arbitration -> ${arbitration}`);
    
    await db.query(
      `INSERT INTO system_config (key, value, updated_at) 
       VALUES ('CREDENTIAL_REGISTRY_ADDR', $1, NOW()), ('ARBITRATION_ADDR', $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();`,
      [credRegistry, arbitration]
    );
  });
}

module.exports = { initializeSystemBusListener };
