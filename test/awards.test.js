// awards.html이 logic·config 로드, 라이브 fetch, 데모 모드, 컨페티를 포함하는지 정적 점검
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const html = fs.readFileSync(path.join(__dirname, "..", "awards.html"), "utf8");

test("awards: 핵심 배선 포함", () => {
  assert.ok(html.includes('src="config.js"'));
  assert.ok(html.includes('src="logic.js"'));
  assert.ok(html.includes("SCORING.buildScreens"));
  assert.ok(html.includes("action=get"));        // 라이브 fetch
  assert.ok(html.includes('has("demo")'));         // 데모 모드
  assert.ok(html.includes('id="confetti"'));
});
