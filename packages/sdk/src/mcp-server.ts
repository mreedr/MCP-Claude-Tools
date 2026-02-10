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
import { printWorkingDirectory } from "./tools/review.js";

const server = new McpServer(
  {
    name: "@repo/sdk",
    version: SDK_VERSION,
  },
  {},
);


server.registerTool(
  "printWorkingDirectory",
  {
    description: "Return current working directory.",
    inputSchema: {
      directory: z.string().describe("Directory to print working directory of.")
    }
  },
  async ({ directory }) => ({
    content: [{ type: "text", text: printWorkingDirectory(directory) }],
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
