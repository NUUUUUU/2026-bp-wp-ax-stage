// 시상 매핑·리빌 시퀀스 — 순서(WP→BP→AX, 우수상→최우수상)와 화면 수 단언
const test = require("node:test");
const assert = require("node:assert");
const CONFIG = require("../config.js");
const SCORING = require("../logic.js");

// 결정적 더미: 출품작(entry)별 점수가 config 순서대로 명확히 갈리게(중앙값 = 그대로)
function demoDATA() {
  const subs = [];
  for (let i = 0; i < 3; i++) {
    const scores = { BP: {}, WP: {}, AX: {} };
    CONFIG.entries.forEach((e, idx) => { scores[e.cat][e.id] = 90 - idx * 2; });
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
  // config 순서상 첫 AX 출품작(태국 · AI Safety CCTV)이 최고점
  const firstAX = CONFIG.entries.filter((e) => e.cat === "AX")[0];
  assert.equal(w[0].team, firstAX.team);
  assert.equal(w[0].entry, firstAX.title);
  assert.equal(w[0].prize, "상금 100만원");
});

test("winners: onePerTeam — 같은 법인 중복 수상 없음", () => {
  const DATA = demoDATA();
  ["BP", "WP", "AX"].forEach((cat) => {
    const teams = SCORING.winners(CONFIG, DATA, cat).map((x) => x.team);
    assert.equal(new Set(teams).size, teams.length, cat + " 부문 중복 법인 수상");
  });
  // AX 상위 2건이 같은 팀이어도(예: 한국 KR-AX1/KR-AX2) 두 번째 건은 건너뛰는지 직접 확인
  const rows = SCORING.ranking(CONFIG, DATA, "AX");
  const cand = SCORING.awardRows(CONFIG, rows);
  const seen = new Set();
  cand.forEach((r) => { assert.ok(!seen.has(r.t)); seen.add(r.t); });
});

test("buildScreens: 15화면, WP cat 먼저, 각 분야 수상은 우수상→최우수상", () => {
  const DATA = demoDATA();
  const s = SCORING.buildScreens(CONFIG, DATA);
  // WP(1수상): cat+2 = 3 / BP(2수상): cat+4 = 5 / AX(3수상): cat+6 = 7  => 15
  assert.equal(s.length, 15);
  assert.equal(s[0].type, "cat");
  assert.equal(s[0].cat, "WP");
  // BP 블록: 첫 reveal은 rank 2(우수상), 마지막 reveal은 rank 1(최우수상)
  const bp = s.filter((x) => x.cat === "BP" && x.type === "reveal");
  assert.deepEqual(bp.map((x) => x.rank), [2, 1]);
  assert.equal(bp[bp.length - 1].isGrand, true);
});
