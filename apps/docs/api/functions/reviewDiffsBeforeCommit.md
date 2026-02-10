[@repo/sdk](../index.md) / reviewDiffsBeforeCommit

# Function: reviewDiffsBeforeCommit()

> **reviewDiffsBeforeCommit**(`cwd?`): `string`

Defined in: [tools/review.ts:36](https://github.com/mreedr/MCP-Claude-Tools/blob/eee4dfb4349b49d597964cf463d7e5492700d547/packages/sdk/src/tools/review.ts#L36)

Gets the current git diff (staged + unstaged) and asks the Claude Code CLI to review it,
then returns Claude's review text. Use for pre-commit review.

Requires the Claude Code CLI to be installed and on PATH. When used from the MCP server,
use console.error() for any debug logs—stdout is reserved for JSON-RPC.

## Parameters

### cwd?

`string` = `...`

Working directory for git and Claude (defaults to process.cwd())

## Returns

`string`

Claude's review text, or "No changes to review." if there is no diff, or throws on git/CLI errors
