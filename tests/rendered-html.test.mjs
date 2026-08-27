import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;
const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Hokkaido travel book", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.match(html, /<html[^>]+lang="zh-Hant"/i);
  assert.match(html, /<title>極境孤寂 \| 北海道 10 天 9 夜<\/title>/i);
  assert.match(html, /極境孤寂/);
  assert.match(html, /照片授權/);
  assert.match(html, /前往第 10 天/);
});

test("removes the disposable starter preview", async () => {
  const [page, layout, travelBook, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/TravelBook.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(page, /<TravelBook \/>/);
  assert.match(layout, /title:\s*"極境孤寂 \| 北海道 10 天 9 夜"/);
  assert.match(travelBook, /Nozo Hotel/);
  assert.match(travelBook, /Amanek Hotel Asahikawa/);
  assert.match(travelBook, /Dormy Inn Wakkanai/);
  assert.match(travelBook, /Unwind Hotel & Bar Otaru/);
  assert.match(travelBook, /Hotel Sosei Sapporo - MGallery Collection/);
  assert.doesNotMatch(layout, /codex-preview|_sites-preview|themeColor|\bViewport\b/);

  await assert.rejects(
    access(new URL("app/_sites-preview", templateRoot)),
  );
});
