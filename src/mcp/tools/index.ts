import { mcpRegistry } from "./registry";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

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
