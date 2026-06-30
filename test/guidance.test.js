// guidance.html이 필수 요소·스크립트를 포함하는지 정적 점검
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const html = fs.readFileSync(path.join(__dirname, "..", "guidance.html"), "utf8");

test("guidance: config·qrcode 로드 + 핵심 요소", () => {
  assert.ok(html.includes('src="config.js"'));
  assert.ok(html.includes('src="vendor/qrcode.js"'));
  assert.ok(html.includes('id="qr"'));
  assert.ok(html.includes('id="bgm"'));
  assert.ok(html.includes('id="steps"'));
});
