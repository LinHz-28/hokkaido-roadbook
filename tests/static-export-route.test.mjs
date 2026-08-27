import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { classifyAppRoute } from "../node_modules/vinext/dist/build/report.js";

test("classifies the home page as statically exportable", () => {
  const pagePath = fileURLToPath(new URL("../app/page.tsx", import.meta.url));

  assert.deepEqual(classifyAppRoute(pagePath, null, false), { type: "static" });
});
