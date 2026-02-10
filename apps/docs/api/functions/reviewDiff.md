[@repo/sdk](../index.md) / reviewDiff

# Function: reviewDiff()

> **reviewDiff**(`cwd?`): `SpawnSyncReturns`\<`string` \| `NonSharedBuffer`\>

Defined in: tools/review.ts:24

Runs the Claude CLI to review the current git diff (staged + unstaged) in the project.
Requires the Claude CLI to be installed and available on PATH.

## Parameters

### cwd?

`string` = `...`

Working directory for git and Claude (defaults to current process cwd)

## Returns

`SpawnSyncReturns`\<`string` \| `NonSharedBuffer`\>

The spawn result; check result.status for exit code
