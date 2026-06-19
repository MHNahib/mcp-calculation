import express from "express";
import { handleMcpRequest } from "./mcp/tools/index.js";

const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT) || 3000;

app.post("/mcp", handleMcpRequest);

app.all("/mcp", (_req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/mcp`);
});
