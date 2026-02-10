/**
 * MCP server entrypoint: exposes @repo/sdk as an MCP server over stdio
 * so agents (Cursor, Claude Desktop, etc.) can call SDK functions as tools.
 *
 * Logging uses stderr only; stdout is reserved for JSON-RPC.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { SDK_VERSION, add, greet } from "./index.js";

const server = new McpServer(
  {
    name: "@repo/sdk",
    version: SDK_VERSION,
  },
  {},
);

server.registerTool(
  "greet",
  {
    description: "Return a greeting for the given name.",
    inputSchema: {
      name: z.string().describe("Name to greet"),
    },
  },
  async ({ name }) => ({
    content: [{ type: "text", text: greet(name) }],
  }),
);

server.registerTool(
  "add",
  {
    description: "Add two numbers together.",
    inputSchema: {
      a: z.number().describe("First number"),
      b: z.number().describe("Second number"),
    },
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(add(a, b)) }],
  }),
);

server.registerTool(
  "get_sdk_version",
  {
    description: "Return the current SDK version.",
    inputSchema: {},
  },
  async () => ({
    content: [{ type: "text", text: SDK_VERSION }],
  }),
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("@repo/sdk MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in MCP server:", error);
  process.exit(1);
});
