// 무대 시상 라이브 집계 — admin.template.html과 동일한 중앙값 집계(이식) · 출품작(entry) 단위
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SCORING = factory();
})(typeof self !== "undefined" ? self : this, function () {
  function median(a) {
    a = a.filter(function (x) { return x != null; }).sort(function (x, y) { return x - y; });
    var m = Math.floor(a.length / 2);
    return a.length ? (a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2) : 0;
  }
  function mean(a) {
    a = a.filter(function (x) { return x != null; });
    return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : 0;
  }
  // 부문별 출품작 목록 — 모든 집계·순위의 기준 축
  function entriesByCat(config) {
    var E = { BP: [], WP: [], AX: [] };
    (config.entries || []).forEach(function (e) { if (E[e.cat]) E[e.cat].push(e); });
    return E;
  }
  function buildDATA(config, subs) {
    var ECAT = entriesByCat(config), D = { BP: [], WP: [], AX: [] };
    (subs || []).forEach(function (sub) {
      ["BP", "WP", "AX"].forEach(function (cat) {
        var sc = (sub.scores && sub.scores[cat]) || {};
        var s = ECAT[cat].map(function (e) { return (sc[e.id] == null ? null : +sc[e.id]); });
        D[cat].push({ n: sub.name || "(무명)", d: sub.dept || "", s: s });
      });
    });
    return D;
  }
  function wscore(config, DATA, cat, ei) {
    var num = 0, den = 0, TR = config.tieRule;
    DATA[cat].forEach(function (j) {
      var v = j.s[ei]; if (v == null) return;
      var w = (j.d === TR.byDept || j.d === TR.byDeptAlias) ? TR.multiplier : 1;
      num += v * w; den += w;
    });
    return den ? num / den : 0;
  }
  function ranking(config, DATA, cat) {
    var rows = entriesByCat(config)[cat].map(function (e, i) {
      var col = DATA[cat].map(function (j) { return j.s[i]; });
      return { e: e, t: e.team, i: i, med: median(col), mean: mean(col), w: wscore(config, DATA, cat, i) };
    });
    rows.sort(function (a, b) { return b.med - a.med || b.w - a.w; });
    return rows;
  }
  // 시상 후보: onePerTeam이면 법인당 최고 출품작 1건만 순서대로
  function awardRows(config, rows) {
    if (!(config.awards && config.awards.onePerTeam)) return rows;
    var seen = {}, out = [];
    rows.forEach(function (r) { if (seen[r.t]) return; seen[r.t] = 1; out.push(r); });
    return out;
  }
  function revealCats(config) {
    return (config.revealOrder && config.revealOrder.length) ? config.revealOrder.slice() : ["WP", "BP", "AX"];
  }
  function medalFor(rank) { return rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🏅"; }
  function winners(config, DATA, cat) {
    var spec = (config.awards[cat] || config.awards.default || []);
    var rows = awardRows(config, ranking(config, DATA, cat));
    return spec.map(function (a) {
      var r = rows[a.rank - 1];
      if (!r) return null;
      return { rank: a.rank, title: a.ttl || (a.rank + "등"), prize: a.prize, medal: medalFor(a.rank), team: r.t, med: r.med, entry: r.e.title, sub: r.e.sub || "" };
    }).filter(function (x) { return x; });
  }
  function buildScreens(config, DATA) {
    var stepByKey = {};
    config.steps.forEach(function (s) { stepByKey[s.key] = s; });
    var screens = [];
    revealCats(config).forEach(function (cat) {
      var st = stepByKey[cat] || { label: cat, sub: cat };
      screens.push({ type: "cat", cat: cat, label: st.label, name: st.sub || st.label });
      var ws = winners(config, DATA, cat).slice().sort(function (a, b) { return b.rank - a.rank; }); // 우수상 먼저
      ws.forEach(function (w) {
        var base = { cat: cat, label: st.label, name: st.sub || st.label, rank: w.rank, title: w.title, prize: w.prize, medal: w.medal, team: w.team, med: w.med, entry: w.entry, sub: w.sub, isGrand: w.rank === 1 };
        screens.push(Object.assign({ type: "suspense" }, base));
        screens.push(Object.assign({ type: "reveal" }, base));
      });
    });
    return screens;
  }
  return { median: median, mean: mean, entriesByCat: entriesByCat, buildDATA: buildDATA, wscore: wscore, ranking: ranking, awardRows: awardRows, revealCats: revealCats, winners: winners, buildScreens: buildScreens };
});
