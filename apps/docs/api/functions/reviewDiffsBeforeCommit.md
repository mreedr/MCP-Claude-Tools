[@repo/sdk](../index.md) / reviewDiffsBeforeCommit

# Function: reviewDiffsBeforeCommit()

> **reviewDiffsBeforeCommit**(`cwd?`): `string`

Defined in: [tools/review.ts:36](https://github.com/mreedr/MCP-Claude-Tools/blob/c8e9fca90d3f6cc13cef15ae7e08b9ab638d567c/packages/sdk/src/tools/review.ts#L36)

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
