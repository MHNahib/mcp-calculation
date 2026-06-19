import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { mcpRegistry } from "./registry.js";
import express from "express";
const serverInfo = {
  name: "Calculation Server",
  version: "1.0.0",
};
export const createMcpServer = () => {
  const server = new McpServer(serverInfo);

  for (const [_, { name, config, cb }] of mcpRegistry) {
    server.registerTool(name, config, cb);
  }

  return server;
};

export const handleMcpRequest = async (
  req: express.Request,
  res: express.Response,
) => {
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on("close", () => {
    transport.close();
    server.close();
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("Error handling MCP request:", err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
};
