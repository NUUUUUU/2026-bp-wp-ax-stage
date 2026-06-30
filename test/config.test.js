// config.js 형태 스모크 — 필수 키·팀 수·시상 계약
const test = require("node:test");
const assert = require("node:assert");
const CONFIG = require("../config.js");

test("config: 팀 6개·pmax 5", () => {
  assert.equal(CONFIG.teams.length, 6);
  assert.equal(CONFIG.pmax, 5);
});
test("config: revealOrder == WP,BP,AX", () => {
  assert.deepEqual(CONFIG.revealOrder, ["WP", "BP", "AX"]);
});
test("config: awards.default 존재 + WP/AX override", () => {
  assert.ok(CONFIG.awards.default.length >= 1);
  assert.equal(CONFIG.awards.WP[0].rank, 1);
  assert.equal(CONFIG.awards.AX.length, 3);
});
