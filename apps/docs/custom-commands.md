# Custom Commands

This page shows how to add a **new MCP command** (tool) to this repo's server.

The MCP server entrypoint is `packages/sdk/src/mcp-server.ts`, and each tool is
registered with `server.registerTool(...)`.

## 1) Add the command implementation

Create or update a function in `packages/sdk/src/tools/`.

Example (`packages/sdk/src/tools/system.ts`):

```ts
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}
```

## 2) Register the command in `mcp-server.ts`

Import the function, then register a tool with:

- A unique tool name
- A clear description
- A `zod` input schema
- A handler that returns MCP `content`

Example:

```ts
import { z } from "zod";
import { getCurrentTimestamp } from "./tools/system.js";

server.registerTool(
  "getCurrentTimestamp",
  {
    description: "Return current UTC timestamp in ISO-8601 format.",
    inputSchema: {},
  },
  async () => ({
    content: [{ type: "text", text: getCurrentTimestamp() }],
  })
);
```

For commands that need input, define fields in `inputSchema`:

```ts
inputSchema: {
  directory: z.string().optional().describe("Working directory to inspect."),
}
```

## 3) Build the SDK package

From the repo root:

```bash
pnpm --filter @repo/sdk build
```

This updates `packages/sdk/dist/mcp-server.js` with your new command.

## 4) Reload your MCP host and test

If you run from source in Cursor, make sure your MCP config points to:

```json
{
  "mcpServers": {
    "@repo/sdk": {
      "command": "node",
      "args": ["/absolute/path/to/claude-cli-MCP/packages/sdk/dist/mcp-server.js"]
    }
  }
}
```

Then restart Cursor (or reload MCP servers), and call your new tool by name.

## Tips

- Keep tool names action-oriented (for example, `reviewDiffsBeforeCommit`).
- Put complex logic in `packages/sdk/src/tools/*`, and keep `mcp-server.ts`
  focused on registration and transport wiring.
- Log only to `stderr` in server code. `stdout` is reserved for MCP JSON-RPC.
