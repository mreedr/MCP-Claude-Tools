# Running as MCP Server

The SDK can be run as an [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server so that other agents (e.g. Cursor, Claude Desktop) can call SDK functions as MCP tools over stdio.

## Tools exposed

When run as an MCP server, the SDK exposes these tools:

| Tool | Description |
|------|-------------|
| `greet` | Return a greeting for the given name. |
| `add` | Add two numbers together. |
| `get_sdk_version` | Return the current SDK version. |

## Running the server

### From the repo (after build)

From the monorepo root, build the SDK then run the server:

```bash
pnpm --filter @repo/sdk build
node packages/sdk/dist/mcp-server.js
```

The process will stay running and communicate over stdin/stdout (stdio). Do not use it interactively; MCP hosts spawn it as a subprocess.

### When installed as a dependency

If your project depends on `@repo/sdk`, you can run the server via the package binary:

```bash
npx repo-sdk-mcp
```

Or with Node explicitly:

```bash
node node_modules/@repo/sdk/dist/mcp-server.js
```

## Configuring an MCP host

Add the SDK as an MCP server in your host’s config so it spawns the process and talks JSON-RPC over stdio.

### Cursor

In Cursor MCP settings (or your MCP config file), add a server entry. Example using the built binary:

```json
{
  "mcpServers": {
    "@repo/sdk": {
      "command": "node",
      "args": ["/absolute/path/to/node_modules/@repo/sdk/dist/mcp-server.js"]
    }
  }
}
```

Or with `npx` (if the project is the one that has `@repo/sdk` installed):

```json
{
  "mcpServers": {
    "@repo/sdk": {
      "command": "npx",
      "args": ["repo-sdk-mcp"]
    }
  }
}
```

Use the absolute path to `dist/mcp-server.js` when using `node` so the host can find it reliably.

### Claude Desktop

Edit your Claude Desktop config (e.g. `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS) and add the server under `mcpServers` with the same shape as above: `command` (e.g. `"node"`) and `args` (e.g. the path to `mcp-server.js`).

## Programmatic use

The `@repo/sdk/mcp-server` export is the built script that starts the server when run with Node. For custom behavior, depend on `@repo/sdk` and `@modelcontextprotocol/sdk` and build your own MCP server that registers tools calling `greet`, `add`, and the rest of the SDK API.
