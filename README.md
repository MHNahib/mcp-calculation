# MCP — Calculation Server

A stateless [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes arithmetic tools over HTTP. MCP clients (Claude Desktop, VS Code Copilot, Cursor, etc.) can connect to it and invoke the tools conversationally.

## Architecture

```
MCP Client (Claude, VS Code, etc.)
        │
        │  HTTP POST /mcp  (JSON-RPC 2.0)
        ▼
  Express.js server  :3000
        │
        │  per-request lifecycle
        ▼
  McpServer  ──  StreamableHTTPServerTransport
        │
  4 calculation tools
```

Each incoming request gets a fresh `McpServer` instance that is torn down when the response closes (stateless mode).

---

## Tools

| Tool                   | Description                               | Inputs                   | Output           |
| ---------------------- | ----------------------------------------- | ------------------------ | ---------------- |
| `add_two_numbers`      | Add two numbers                           | `a: number`, `b: number` | `result: number` |
| `subtract_two_numbers` | Subtract the second number from the first | `a: number`, `b: number` | `result: number` |
| `multiply_two_numbers` | Multiply two numbers                      | `a: number`, `b: number` | `result: number` |
| `divide_two_numbers`   | Divide the first number by the second     | `a: number`, `b: number` | `result: number` |

> `divide_two_numbers` returns an error response when `b` is `0` rather than throwing.

---

## Prerequisites

- Node.js 18+
- npm

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development mode (hot reload)

```bash
npm run dev
```

The server starts at `http://localhost:3000/mcp`.

### 3. Build for production

> **Note:** `tsconfig.json` compiles to `./build/`, but `package.json`'s `start` script points to `dist/index.js`. Fix one of them before running production mode.

```bash
# Option A — update start script to match tsconfig outDir
npm run build
node build/index.js

# Option B — update tsconfig outDir to "dist" and then run
npm run build
npm start
```

### 4. Run with Docker

```bash
docker build -t mcp-calculation .
docker run -p 3000:3000 mcp-calculation
```

Custom port:

```bash
docker run -p 8080:8080 -e PORT=8080 mcp-calculation
```

---

## Connecting an MCP Client

### VS Code (Copilot / Claude extension)

A `.vscode/mcp.json` is already included:

```json
{
  "servers": {
    "my-mcp-server-de2625e8": {
      "url": "http://localhost:3000/mcp",
      "type": "http"
    }
  }
}
```

Start the server (`npm run dev`), then open the MCP panel in VS Code — the **Calculation Server** will appear automatically.

### Claude Desktop

Add the following to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "calculation-server": {
      "url": "http://localhost:3000/mcp",
      "type": "http"
    }
  }
}
```

### Any HTTP MCP client

| Setting   | Value                       |
| --------- | --------------------------- |
| URL       | `http://localhost:3000/mcp` |
| Transport | HTTP (Streamable HTTP)      |
| Method    | `POST`                      |
| Protocol  | JSON-RPC 2.0                |

---

## Using the Tools

Once connected, ask your MCP client naturally:

```
What is 42 plus 58?
What is 100 divided by 4?
Multiply 7 by 8.
Subtract 15 from 100.
```

### Direct HTTP example (curl)

```bash
# List available tools
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

```bash
# Call add_two_numbers
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "add_two_numbers",
      "arguments": { "a": 12, "b": 30 }
    }
  }'
```

Expected response:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [{ "type": "text", "text": "The sum of 12 and 30 is 42" }],
    "structuredContent": { "result": 42 }
  }
}
```

```bash
# Division by zero — returns an error response (not an HTTP error)
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "divide_two_numbers",
      "arguments": { "a": 10, "b": 0 }
    }
  }'
```

---

## Environment Variables

| Variable | Default | Description                     |
| -------- | ------- | ------------------------------- |
| `PORT`   | `3000`  | Port the HTTP server listens on |

---

## Project Structure

```
mcp-calculation/
├── src/
│   └── index.ts        # Server entry point — tools + Express setup
├── .vscode/
│   └── mcp.json        # VS Code MCP client config
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## Tech Stack

| Package                     | Purpose                           |
| --------------------------- | --------------------------------- |
| `@modelcontextprotocol/sdk` | MCP server + transport primitives |
| `express`                   | HTTP server (v5)                  |
| `zod`                       | Input/output schema validation    |
| `tsx`                       | TypeScript execution for dev mode |
| `typescript`                | Type checking + build             |
