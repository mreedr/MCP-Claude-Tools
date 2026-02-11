# ts-package

A pnpm monorepo that builds and documents **@repo/sdk**, a TypeScript SDK you can use as a library or expose to AI agents via the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP).

## What it does

- **@repo/sdk** – TypeScript package that provides:
  - **`printWorkingDirectory(directory)`** – Returns the current working directory for a given path (useful when agents need to resolve paths).
  - **`reviewDiffsBeforeCommit(cwd?)`** – Runs `git diff HEAD` in the given directory, sends the diff to the Claude Code CLI for review, and returns the review text. Optional `.claude/skills/review-code/SKILL.md` is used when present.

- **MCP server** – The same SDK is exposed as an MCP server over stdio so tools like Cursor, Claude Desktop, or other MCP hosts can call these functions as tools (e.g. “review my diffs before commit”, “print working directory”).

- **Docs** – A VitePress site in `apps/docs` that documents the SDK and is kept in sync via TypeDoc.

## Repo structure

| Path            | Description                                      |
|-----------------|--------------------------------------------------|
| `packages/sdk`  | @repo/sdk – main library + MCP server entrypoint |
| `packages/tsconfig` | Shared TypeScript configs                    |
| `packages/eslint-config` | Shared ESLint config                      |
| `apps/docs`     | VitePress documentation site                    |

Build and orchestration: **pnpm** workspaces + **Turbo**.

## Requirements

- **Node.js** ≥ 18  
- **pnpm** (see `packageManager` in root `package.json`)  
- For `reviewDiffsBeforeCommit`: **Claude Code CLI** installed and on `PATH`

## Commands (from repo root)

```bash
pnpm install          # Install dependencies
pnpm run build        # Build all packages (no docs)
pnpm run build:all    # Generate docs + build all
pnpm run dev          # Run dev tasks (e.g. docs dev server)
pnpm run lint         # Lint all packages
pnpm run format       # Format with Prettier
pnpm run format:check # Check formatting
```

## Using the SDK

**As a library:**

```bash
pnpm add @repo/sdk
```

```ts
import { printWorkingDirectory, reviewDiffsBeforeCommit, SDK_VERSION } from "@repo/sdk";

console.log(printWorkingDirectory("/some/path"));
console.log(reviewDiffsBeforeCommit()); // uses process.cwd()
```

**As an MCP server:**

The package ships a binary `repo-sdk-mcp`. Point your MCP client at it (stdio transport). Example Cursor config:

```json
{
  "mcpServers": {
    "@repo/sdk": {
      "command": "npx",
      "args": ["-y", "@repo/sdk", "mcp"]
    }
  }
}
```

Or run the built server directly: `node node_modules/@repo/sdk/dist/mcp-server.js` (after `pnpm install` in a project that depends on `@repo/sdk`).

## Documentation

From repo root:

```bash
pnpm run docs:generate   # Generate API docs into apps/docs
pnpm --filter docs dev   # Serve docs (if the docs app has a "dev" script)
```

The docs app lives in `apps/docs` and consumes the generated API reference.
