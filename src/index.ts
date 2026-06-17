import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";

enum Tools {
  add_two_numbers = "add_two_numbers",
  subtract_two_numbers = "subtract_two_numbers",
  multiply_two_numbers = "multiply_two_numbers",
  divide_two_numbers = "divide_two_numbers",
}

const serverInfo = {
  name: "Calculation Server",
  version: "1.0.0",
};

const numberPairInput = {
  a: z.number().describe("The first number"),
  b: z.number().describe("The second number"),
};

const numberResultOutput = {
  result: z.number().describe("The result of the operation"),
};

function createMcpServer() {
  const server = new McpServer(serverInfo);

  server.registerTool(
    Tools.add_two_numbers,
    {
      title: "Add Two Numbers",
      description: "Add two numbers",
      inputSchema: numberPairInput,
      outputSchema: numberResultOutput,
    },
    async ({ a, b }) => {
      const output = a + b;
      return {
        content: [
          { type: "text", text: `The sum of ${a} and ${b} is ${output}` },
        ],
        structuredContent: { result: output },
      };
    },
  );

  server.registerTool(
    Tools.subtract_two_numbers,
    {
      title: "Subtract Two Numbers",
      description: "Subtract the second number from the first",
      inputSchema: numberPairInput,
      outputSchema: numberResultOutput,
    },
    async ({ a, b }) => {
      const output = a - b;
      return {
        content: [{ type: "text", text: `${a} minus ${b} is ${output}` }],
        structuredContent: { result: output },
      };
    },
  );

  server.registerTool(
    Tools.multiply_two_numbers,
    {
      title: "Multiply Two Numbers",
      description: "Multiply two numbers",
      inputSchema: numberPairInput,
      outputSchema: numberResultOutput,
    },
    async ({ a, b }) => {
      const output = a * b;
      return {
        content: [{ type: "text", text: `${a} times ${b} is ${output}` }],
        structuredContent: { result: output },
      };
    },
  );

  server.registerTool(
    Tools.divide_two_numbers,
    {
      title: "Divide Two Numbers",
      description: "Divide the first number by the second",
      inputSchema: numberPairInput,
      outputSchema: numberResultOutput,
    },
    async ({ a, b }) => {
      if (b === 0) {
        return {
          content: [{ type: "text", text: "Cannot divide by zero." }],
          isError: true,
        };
      }
      const output = a / b;
      return {
        content: [{ type: "text", text: `${a} divided by ${b} is ${output}` }],
        structuredContent: { result: output },
      };
    },
  );

  return server;
}

const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT) || 3000;

const handleMcpRequest = async (
  req: express.Request,
  res: express.Response,
) => {
  // Stateless: a fresh server + transport per request.
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

// Stateless JSON mode only supports POST. Reject other methods cleanly.
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
