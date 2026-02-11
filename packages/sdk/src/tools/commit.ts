/// <reference types="node" />
import { execSync, spawnSync } from "child_process";

const MAX_BUFFER = 10 * 1024 * 1024;

/** Prompt for generating a short but detailed commit message from a diff. */
const COMMIT_MESSAGE_PROMPT =
  "Based on the following git diff, write a single commit message that is short but detailed. " +
  "Use a conventional style if it fits (e.g. type(scope): summary). " +
  "First line should be a concise summary (about 50–72 chars); you may add a brief body if needed. " +
  "Output only the commit message, no quotes or explanation.";

/**
 * Gets the current git diff (staged + unstaged), asks Claude to generate a short
 * but detailed commit message, then runs `git add` and `git commit` with that message.
 *
 * Requires the Claude Code CLI to be installed and on PATH. When used from the MCP server,
 * use console.error() for any debug logs—stdout is reserved for JSON-RPC.
 *
 * @param cwd - Working directory for git and Claude (defaults to process.cwd())
 * @returns The commit message used and confirmation, or a message if nothing to commit
 */
export function addAndCommitWithClaudeMessage(
  cwd: string = process.cwd()
): string {
  let diff: string;
  try {
    diff = execSync("git diff HEAD", {
      encoding: "utf-8",
      cwd,
      maxBuffer: MAX_BUFFER,
    }).trim();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to get git diff in ${cwd}: ${message}`);
  }

  if (!diff) {
    return "No changes to commit.";
  }

  const result = spawnSync("claude", ["--model", "haiku", "-p", COMMIT_MESSAGE_PROMPT], {
    input: diff,
    cwd,
    encoding: "utf-8",
    maxBuffer: MAX_BUFFER,
  });

  if (result.error) {
    throw new Error(
      `Claude CLI failed (is it installed and on PATH?): ${result.error.message}`
    );
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.trim() ?? "";
    throw new Error(
      `Claude CLI exited with code ${result.status}${stderr ? `: ${stderr}` : ""}`
    );
  }

  const rawMessage = (result.stdout ?? "").trim();
  // Use first line only for the -m to avoid multi-line issues; strip any surrounding quotes
  const firstLine = rawMessage.split(/\n/)[0]?.trim() ?? rawMessage;
  const message = firstLine.replace(/^["']|["']$/g, "");

  if (!message) {
    throw new Error("Claude did not return a valid commit message.");
  }

  try {
    execSync("git add -A", { encoding: "utf-8", cwd, maxBuffer: MAX_BUFFER });
    execSync("git", ["commit", "-m", message], {
      encoding: "utf-8",
      cwd,
      maxBuffer: MAX_BUFFER,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Git add/commit failed: ${msg}`);
  }

  return `Committed with message:\n${message}`;
}
