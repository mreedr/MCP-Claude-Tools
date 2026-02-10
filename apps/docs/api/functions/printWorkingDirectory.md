[@repo/sdk](../index.md) / printWorkingDirectory

# Function: printWorkingDirectory()

> **printWorkingDirectory**(`cwd?`): `string`

Defined in: [tools/review.ts:14](https://github.com/mreedr/MCP-Claude-Tools/blob/80539fe393b5d36e08f7a9caca464284c6a19418/packages/sdk/src/tools/review.ts#L14)

Runs the Claude CLI to review the current git diff (staged + unstaged) in the project.
Requires the Claude CLI to be installed and available on PATH.

## Parameters

### cwd?

`string` = `...`

Working directory for git and Claude (defaults to current process cwd)

## Returns

`string`

The spawn result; check result.status for exit code
