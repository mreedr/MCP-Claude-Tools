# Introducing Claude Tools MCP Server

The claude-cli-mcp can be run as an [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server to expose Claude-oriented workflows defined in `packages/sdk/src/mcp-server.ts`.

## Installation (from source)

To use the MCP server with Cursor by building from the repository:

### 1. Download the project

Clone the repository from GitHub:

```bash
git clone https://github.com/mreedr/claude-cli-MCP.git
cd claude-cli-MCP
```

### 2. Build the project

Install dependencies and build all packages:

```bash
pnpm install
pnpm run build
```

This produces the built MCP server at `packages/sdk/dist/mcp-server.js`.

### 3. Install into Cursor

Add the MCP server to your Cursor config. Edit your MCP config file (`~/.cursor/mcp.json` on macOS/Linux, or `%USERPROFILE%\.cursor\mcp.json` on Windows) and add:

```json
{
  "mcpServers": {
    "@repo/sdk": {
      "command": "node",
      "args": ["/path/to/claude-cli-MCP/packages/sdk/dist/mcp-server.js"]
    }
  }
}
```

Replace `/path/to/claude-cli-MCP` with the absolute path to your cloned repository (e.g. `/Users/yourname/Development/claude-cli-MCP`).

Restart Cursor to load the new MCP server.

---

## Tools exposed

When run as an MCP server, the SDK exposes these tools:

| Tool                            | Description                                                                                              | Input                                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `printWorkingDirectory`         | Return current working directory.                                                                        | `directory` (string, required): Directory to print working directory of.                               |
| `reviewDiffsBeforeCommit`       | Review the current git diff (staged + unstaged) via Claude Code CLI before commit.                      | `directory` (string, optional): Working directory (defaults to current process cwd).                   |
| `addAndCommitWithClaudeMessage` | Stage all changes, ask Claude to generate a short but detailed commit message from the diff, then commit. | `directory` (string, optional): Working directory (defaults to current process cwd).                   |

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

The `@repo/sdk/mcp-server` export is the built script that starts the server when run with Node. For custom behavior, depend on `@repo/sdk` and `@modelcontextprotocol/sdk` and build your own MCP server that registers tools that call `printWorkingDirectory`, `reviewDiffsBeforeCommit`, `addAndCommitWithClaudeMessage`, or other SDK functions.


