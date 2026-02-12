import { defineConfig } from "vitepress";
import type { DefaultTheme } from "vitepress";
import { VitePluginWatchWorkspace } from "@prosopo/vite-plugin-watch-workspace";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, "../");
const workspaceRoot = path.resolve(docsRoot, "../..");

function fixSidebarLinks(
  items: { link?: string; items?: unknown[] }[]
): unknown[] {
  return items.map((item) => {
    const next = { ...item };
    if (next.link) next.link = next.link.replace(/\.md$/, "");
    if (Array.isArray(next.items))
      next.items = fixSidebarLinks(
        next.items as { link?: string; items?: unknown[] }[]
      );
    return next;
  });
}

function getApiSidebar() {
  const sidebarPath = path.join(docsRoot, "api", "typedoc-sidebar.json");
  if (!existsSync(sidebarPath)) return [];
  try {
    const sidebar = JSON.parse(readFileSync(sidebarPath, "utf-8"));
    return fixSidebarLinks(sidebar);
  } catch {
    return [];
  }
}

export default defineConfig({
  title: "SDK Docs",
  description: "Documentation for @repo/sdk",
  base: "/",
  themeConfig: {
    sidebar: [
      { text: "Install MCP", link: "/" },
      { text: "Custom Commands", link: "/custom-commands" },
      { text: "API", collapsed: false, items: getApiSidebar() },
    ] as DefaultTheme.SidebarItem[],
  },
  vite: {
    plugins: [
      VitePluginWatchWorkspace({
        workspaceRoot,
        currentPackage: docsRoot,
        format: "esm",
        fileTypes: ["ts", "tsx", "js", "jsx"],
        ignorePaths: ["node_modules", "dist", "**/dist/**"],
      }),
    ],
  },
});
