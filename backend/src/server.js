const express = require("express");
const cors = require("cors");
const db = require("./db");
const { initializeSystemBusListener } = require("./services/systemBusSync");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint for Cloud Run
app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({ status: "healthy", database: "connected", timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error: error.message });
  }
});

// Import Core Module Routes
const governanceRoutes = require("./routes/governanceRoutes");
const credentialRoutes = require("./routes/credentialRoutes");
const tradeRoutes = require("./routes/tradeRoutes");

// Register API Routes
app.use("/api/governance", governanceRoutes);
app.use("/api/credentials", credentialRoutes);
app.use("/api/trade", tradeRoutes);

// Start Server and System Bus Listener
app.listen(PORT, async () => {
  console.log(`[BEAST Core Server] Running on port ${PORT}`);

  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
  const systemBusAddress = process.env.SYSTEM_BUS_CONTRACT_ADDRESS;

  if (systemBusAddress) {
    try {
      await initializeSystemBusListener(rpcUrl, systemBusAddress);
    } catch (err) {
      console.error("[BEAST Core Server] Failed to initialize System Bus Listener:", err.message);
    }
  } else {
    console.warn("[BEAST Core Server] SYSTEM_BUS_CONTRACT_ADDRESS not configured. Event listener skipped.");
  }
});
