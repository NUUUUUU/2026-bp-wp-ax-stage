// 시상 집계(logic.js)가 admin 스냅샷의 집계와 동일함을 단언 — 무대 오답 방지
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const CONFIG = require("../config.js");
const SCORING = require("../logic.js");

// admin 스냅샷의 <script>를 CONFIG 주입해 vm으로 실행 → 실제 ranking 확보
function loadAdmin(config) {
  const adminConfig = Object.assign({}, config, {
    admin: { password: "x", resetKey: "x", adminTitle: "" },
    anomaly: { gapHi: 8, extLow: 35, extHigh: 90, sdFlag: 20, extRatioFlag: 50 }
  });
  const html = fs.readFileSync(path.join(__dirname, "fixtures", "admin.template.html"), "utf8");
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  const code = m[1].replace('"__CONFIG__"', JSON.stringify(adminConfig));
  const noop = () => {};
  const makeNode = () => ({
    style: {}, dataset: {}, value: "", _html: "",
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    addEventListener: noop, appendChild: noop, removeChild: noop, setAttribute: noop,
    getAttribute: () => "", querySelector: () => makeNode(), querySelectorAll: () => [],
    get innerHTML() { return this._html; }, set innerHTML(v) { this._html = v; }
  });
  const document = {
    getElementById: () => makeNode(), querySelector: () => makeNode(),
    querySelectorAll: () => [], createElement: () => makeNode(), body: makeNode(), addEventListener: noop
  };
  const ctx = { document, window: {}, Date, Math, JSON, console, setTimeout: () => 0, clearTimeout: noop, alert: noop, confirm: () => false };
  vm.createContext(ctx);
  vm.runInContext(code + "\n;", ctx);
  return ctx;
}

// 담합 픽스처: 정상 5명(T0=90,T1=70,그외 50) + 담합 3명(T0=10,T1=100,그외 50)
function collusion(config) {
  const T = config.teams, skill = T[0], coll = T[1];
  const mk = (name, dept, f) => {
    const scores = { BP: {}, WP: {}, AX: {} };
    T.forEach((t) => ["BP", "WP", "AX"].forEach((c) => { scores[c][t] = f(t); }));
    return { name, dept, scores };
  };
  const subs = [];
  for (let i = 0; i < 5; i++) subs.push(mk("정상" + i, T[2], (t) => t === skill ? 90 : t === coll ? 70 : 50));
  for (let i = 0; i < 3; i++) subs.push(mk("담합" + i, T[3], (t) => t === skill ? 10 : t === coll ? 100 : 50));
  return subs;
}

test("parity: ranking 팀 순서·중앙값이 admin과 동일(BP/WP/AX)", () => {
  const subs = collusion(CONFIG);
  const admin = loadAdmin(CONFIG);
  const mineDATA = SCORING.buildDATA(CONFIG, subs);
  for (const cat of ["BP", "WP", "AX"]) {
    admin.DATA = admin.buildDATA(subs);
    const a = admin.ranking(cat);
    assert.equal(a[0].t, CONFIG.teams[0], cat + " admin 집계가 퇴화(빈 DATA)되지 않았는지 확인");
    const b = SCORING.ranking(CONFIG, mineDATA, cat);
    assert.deepEqual(b.map((r) => r.t), a.map((r) => r.t), cat + " 팀 순서 불일치");
    a.forEach((r, i) => assert.ok(Math.abs(r.med - b[i].med) < 1e-9, cat + " 중앙값 불일치 " + r.t));
  }
});

test("parity: 중앙값 1위=실력팀(담합 차단), 평균 1위=담합팀", () => {
  const subs = collusion(CONFIG);
  const DATA = SCORING.buildDATA(CONFIG, subs);
  const rows = SCORING.ranking(CONFIG, DATA, "BP");
  const byMean = [...rows].sort((x, y) => y.mean - x.mean);
  assert.equal(rows[0].t, CONFIG.teams[0]);
  assert.equal(byMean[0].t, CONFIG.teams[1]);
});

test("median: 홀짝·null 제외", () => {
  assert.equal(SCORING.median([5, 1, 3]), 3);
  assert.equal(SCORING.median([1, 2, 3, 4]), 2.5);
  assert.equal(SCORING.median([null, 4, null, 2]), 3);
});
