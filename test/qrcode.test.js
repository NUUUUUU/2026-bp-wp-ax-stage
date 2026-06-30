// 벤더 QR 라이브러리가 인코딩되는지 스모크
const test = require("node:test");
const assert = require("node:assert");
const qrcode = require("../vendor/qrcode.js");

test("qrcode: URL 인코딩 → SVG 태그 생성", () => {
  const qr = qrcode(0, "M");
  qr.addData("https://example.invalid/judge.html");
  qr.make();
  const svg = qr.createSvgTag(6, 0);
  assert.ok(qr.getModuleCount() > 0);
  assert.ok(/<svg/.test(svg));
});
