/// <reference types="node" />
import { execSync, spawnSync } from "child_process";
const REVIEW_PROMPT =
  "Review the following git diff for this project. Focus on code quality, potential bugs, security, and concrete improvements. Keep the review concise and actionable.";

/**
 * Runs the Claude CLI to review the current git diff (staged + unstaged) in the project.
 * Requires the Claude CLI to be installed and available on PATH.
 *
 * @param cwd - Working directory for git and Claude (defaults to current process cwd)
 * @returns The spawn result; check result.status for exit code
 */

export function printWorkingDirectory(cwd: string = process.cwd()): string {
  return execSync("pwd", {
    encoding: "utf-8",
    cwd,
    maxBuffer: 10 * 1024 * 1024,
  }).trim();
}

