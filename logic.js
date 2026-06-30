// 무대 시상 라이브 집계 — admin.template.html과 동일한 중앙값 집계(이식)
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
  function buildDATA(config, subs) {
    var TEAMS = config.teams, D = { BP: [], WP: [], AX: [] };
    (subs || []).forEach(function (sub) {
      ["BP", "WP", "AX"].forEach(function (cat) {
        var sc = (sub.scores && sub.scores[cat]) || {};
        var s = TEAMS.map(function (t) { return (sc[t] == null ? null : +sc[t]); });
        D[cat].push({ n: sub.name || "(무명)", d: sub.dept || "", s: s });
      });
    });
    return D;
  }
  function wscore(config, DATA, cat, ti) {
    var num = 0, den = 0, TR = config.tieRule;
    DATA[cat].forEach(function (j) {
      var v = j.s[ti]; if (v == null) return;
      var w = (j.d === TR.byDept || j.d === TR.byDeptAlias) ? TR.multiplier : 1;
      num += v * w; den += w;
    });
    return den ? num / den : 0;
  }
  function ranking(config, DATA, cat) {
    var TEAMS = config.teams;
    var rows = TEAMS.map(function (t, i) {
      var col = DATA[cat].map(function (j) { return j.s[i]; });
      return { t: t, i: i, med: median(col), mean: mean(col), w: wscore(config, DATA, cat, i) };
    });
    rows.sort(function (a, b) { return b.med - a.med || b.w - a.w; });
    return rows;
  }
  function revealCats(config) {
    return (config.revealOrder && config.revealOrder.length) ? config.revealOrder.slice() : ["WP", "BP", "AX"];
  }
  function medalFor(rank) { return rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🏅"; }
  function winners(config, DATA, cat) {
    var spec = (config.awards[cat] || config.awards.default || []);
    var rows = ranking(config, DATA, cat);
    return spec.map(function (a) {
      var r = rows[a.rank - 1];
      if (!r) return null;
      return { rank: a.rank, title: a.ttl || (a.rank + "등"), prize: a.prize, medal: medalFor(a.rank), team: r.t, med: r.med };
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
        var base = { cat: cat, label: st.label, name: st.sub || st.label, rank: w.rank, title: w.title, prize: w.prize, medal: w.medal, team: w.team, med: w.med, isGrand: w.rank === 1 };
        screens.push(Object.assign({ type: "suspense" }, base));
        screens.push(Object.assign({ type: "reveal" }, base));
      });
    });
    return screens;
  }
  return { median: median, mean: mean, buildDATA: buildDATA, wscore: wscore, ranking: ranking, revealCats: revealCats, winners: winners, buildScreens: buildScreens };
});
