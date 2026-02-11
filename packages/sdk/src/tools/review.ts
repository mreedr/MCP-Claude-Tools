/// <reference types="node" />
import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const MAX_BUFFER = 10 * 1024 * 1024;

/** Prompt used for pre-commit diff review. */
const REVIEW_PROMPT =
  "Review the following git diff for this project. Focus on code quality, potential bugs, security, and concrete improvements. Keep the review concise and actionable.";

/** Prompt for the \"review before commit\" flow (user-facing wording). */
const REVIEW_BEFORE_COMMIT_PROMPT =
  "Review my code before I commit. Do you see anything blatant? " + REVIEW_PROMPT;

/**
 * Return current working directory. When used from the MCP server, use
 * console.error() for debug logs—stdout is reserved for JSON-RPC.
 */
export function printWorkingDirectory(cwd: string = process.cwd()): string {
  return execSync("pwd", {
    encoding: "utf-8",
    cwd,
    maxBuffer: MAX_BUFFER,
  }).trim();
}

/**
 * Gets the current git diff (staged + unstaged) and asks the Claude Code CLI to review it,
 * then returns Claude's review text. Use for pre-commit review.
 *
 * Requires the Claude Code CLI to be installed and on PATH. When used from the MCP server,
 * use console.error() for any debug logs—stdout is reserved for JSON-RPC.
 *
 * @param cwd - Working directory for git and Claude (defaults to process.cwd())
 * @returns Claude's review text, or "No changes to review." if there is no diff, or throws on git/CLI errors
 */
export function reviewDiffsBeforeCommit(cwd: string = process.cwd()): string {
  let diff: string;
  try {
    diff = execSync("git diff HEAD", {
      encoding: "utf-8",
      cwd,
      maxBuffer: MAX_BUFFER,
    }).trim();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to get git diff in ${cwd}: ${message}`);
  }

  if (!diff) {
    return "No changes to review.";
  }

  const skillPath = path.join(cwd, ".claude", "skills", "review-code", "SKILL.md");

  // haiku model is a good compromise between speed and quality
  const args = ["--model", "haiku", "-p", REVIEW_BEFORE_COMMIT_PROMPT];
  if (fs.existsSync(skillPath)) {
    args.push("--append-system-prompt-file", skillPath);
  } else {
    console.error(`Warning: Skill file not found at ${skillPath}; reviewing without it.`);
  }
  const result = spawnSync("claude", args, {
    input: diff,
    cwd,
    encoding: "utf-8",
    maxBuffer: MAX_BUFFER,
  });

  if (result.error) {
    throw new Error(
      `Claude CLI failed (is it installed and on PATH?): ${result.error.message}`,
    );
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.trim() ?? "";
    throw new Error(
      `Claude CLI exited with code ${result.status}${stderr ? `: ${stderr}` : ""}`,
    );
  }

  return (result.stdout ?? "").trim();
}

