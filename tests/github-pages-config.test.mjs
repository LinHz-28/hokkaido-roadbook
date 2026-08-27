import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  loadNextConfig,
  resolveNextConfig,
} from "../node_modules/vinext/dist/config/next-config.js";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

test("keeps GitHub Pages assets prefixed without routing through a Next basePath", async () => {
  process.env.GITHUB_PAGES = "true";
  process.env.GITHUB_PAGES_BASE_PATH = "/hokkaido-roadbook";
  process.env.GITHUB_PAGES_ASSET_PREFIX =
    "https://linhz-28.github.io/hokkaido-roadbook";

  const rawConfig = await loadNextConfig(projectRoot);
  const config = await resolveNextConfig(rawConfig, projectRoot);

  assert.equal(config.output, "export");
  assert.equal(config.basePath, "");
  assert.equal(
    config.assetPrefix,
    "https://linhz-28.github.io/hokkaido-roadbook",
  );
  assert.equal(config.env.NEXT_PUBLIC_BASE_PATH, "/hokkaido-roadbook");
  assert.equal(config.trailingSlash, true);
});
