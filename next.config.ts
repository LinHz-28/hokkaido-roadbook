import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath =
  process.env.GITHUB_PAGES_BASE_PATH ?? "";
const githubPagesAssetPrefix =
  process.env.GITHUB_PAGES_ASSET_PREFIX ?? githubPagesBasePath;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPagesBuild ? githubPagesBasePath : "",
  },
  ...(isGitHubPagesBuild
    ? {
        output: "export",
        basePath: githubPagesBasePath,
        assetPrefix: githubPagesAssetPrefix,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
