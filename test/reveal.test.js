// 시상 매핑·리빌 시퀀스 — 순서(WP→BP→AX, 우수상→대상)와 화면 수 단언
const test = require("node:test");
const assert = require("node:assert");
const CONFIG = require("../config.js");
const SCORING = require("../logic.js");

// 결정적 더미: 팀별 총점이 명확히 갈리게(중앙값 = 그대로)
function demoDATA() {
  const subs = [];
  for (let i = 0; i < 3; i++) {
    const scores = { BP: {}, WP: {}, AX: {} };
    CONFIG.teams.forEach((t, idx) => ["BP", "WP", "AX"].forEach((c) => { scores[c][t] = 90 - idx * 5; }));
    subs.push({ name: "위원" + i, dept: "심사", scores });
  }
  return SCORING.buildDATA(CONFIG, subs);
}

test("revealCats == WP,BP,AX", () => {
  assert.deepEqual(SCORING.revealCats(CONFIG), ["WP", "BP", "AX"]);
});

test("winners: AX는 rank 1·2·3, 메달 매핑", () => {
  const DATA = demoDATA();
  const w = SCORING.winners(CONFIG, DATA, "AX");
  assert.deepEqual(w.map((x) => x.rank), [1, 2, 3]);
  assert.equal(w[0].medal, "🥇");
  assert.equal(w[1].medal, "🥈");
  assert.equal(w[2].medal, "🏅");
  assert.equal(w[0].team, CONFIG.teams[0]); // 총점 1위
  assert.equal(w[0].prize, "상금 100만원");
});

test("buildScreens: 15화면, WP cat 먼저, 각 분야 수상은 우수상→대상", () => {
  const DATA = demoDATA();
  const s = SCORING.buildScreens(CONFIG, DATA);
  // WP(1수상): cat+2 = 3 / BP(2수상): cat+4 = 5 / AX(3수상): cat+6 = 7  => 15
  assert.equal(s.length, 15);
  assert.equal(s[0].type, "cat");
  assert.equal(s[0].cat, "WP");
  // BP 블록: 첫 reveal은 rank 2(우수상), 마지막 reveal은 rank 1(대상)
  const bp = s.filter((x) => x.cat === "BP" && x.type === "reveal");
  assert.deepEqual(bp.map((x) => x.rank), [2, 1]);
  assert.equal(bp[bp.length - 1].isGrand, true);
});
