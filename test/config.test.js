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
test("config: entries 18건 — id 유일·팀 유효·부문별 건수(BP7/WP5/AX6)", () => {
  const E = CONFIG.entries;
  assert.equal(E.length, 18);
  assert.equal(new Set(E.map((e) => e.id)).size, E.length, "id 중복");
  E.forEach((e) => {
    assert.ok(CONFIG.teams.includes(e.team), "미등록 팀: " + e.team);
    assert.ok(["BP", "WP", "AX"].includes(e.cat), "부문 오류: " + e.cat);
    assert.ok(e.title && e.title.length > 0, "제목 누락: " + e.id);
  });
  const cnt = { BP: 0, WP: 0, AX: 0 };
  E.forEach((e) => cnt[e.cat]++);
  assert.deepEqual(cnt, { BP: 7, WP: 5, AX: 6 });
});
test("config: 심사페이지 config.json과 entries·teams 일치", () => {
  const J = require("../심사페이지/config.json");
  assert.deepEqual(CONFIG.teams, J.teams);
  assert.deepEqual(
    CONFIG.entries.map(({ id, team, cat, sub, title }) => ({ id, team, cat, sub, title })),
    J.entries.map(({ id, team, cat, sub, title }) => ({ id, team, cat, sub, title }))
  );
});
