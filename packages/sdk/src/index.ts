import { z } from "zod";

/**
 * @repo/sdk - TypeScript SDK
 */

export const SDK_VERSION = "0.0.1";

/**
 * Example SDK function. Something new now
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

/**
 * Add two numbers together.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The sum of the two numbers.
 */
export function add(a: number, b: number): number {
  return a + b;
}
