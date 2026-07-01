// 무대 슬라이드 공유 설정 — 스킬 config.template.json 스냅샷 + 덱 전용 키
var CONFIG = {
  event: {
    title: "2026 BP · WP · AX 경진대회",
    subtitle: "경영기획팀 · 각 항목 1~5점 (가중치 자동 환산)"
  },
  teams: ["중국법인", "태국법인", "HQ", "한국사업부", "이집트법인", "기술연구소"],
  pmax: 5,
  categories: {
    BP: [
      {"n": "위기 인식 및 대응 전략의 적절성", "w": 20},
      {"n": "성과 및 비용 효과성 (정량 성과)", "w": 20},
      {"n": "ERP 기반 데이터 검증", "w": 5},
      {"n": "실행력 및 추진력", "w": 20},
      {"n": "지속가능성 및 확산 가능성", "w": 15},
      {"n": "창의성 및 돌파력", "w": 20}
    ],
    AX: [
      {"n": "생성형 AI 업무적용", "w": 25},
      {"n": "지능형 프로세스 자동화", "w": 30},
      {"n": "데이터 기반 의사결정", "w": 30},
      {"n": "기타 안전분야", "w": 15}
    ]
  },
  categoryReuse: { WP: "BP" },
  steps: [
    { key: "BP", label: "BP", sub: "우수사례" },
    { key: "WP", label: "WP", sub: "개선·반면교사" },
    { key: "AX", label: "AX", sub: "디지털 전환" }
  ],
  tieRule: { byDept: "대표이사", byDeptAlias: "ceo", multiplier: 1.2 },
  awards: {
    default: [
      { rank: 1, prize: "상금 200만원", ttl: "대상" },
      { rank: 2, prize: "상금 100만원", ttl: "우수상" }
    ],
    WP: [ { rank: 1, prize: "상금 200만원", ttl: "대상" } ],
    AX: [
      { rank: 1, prize: "상금 100만원", ttl: "대상" },
      { rank: 2, prize: "상금 50만원", ttl: "우수상" },
      { rank: 3, prize: "상금 50만원", ttl: "우수상" }
    ]
  },
  apiUrl: "https://script.google.com/macros/s/AKfycbys-XrSmFQu9nY0z5KLZWPSY0Jxq8M-4aOx0t31Ax9LNokE_jtZo2q6rjdTrU7rO1XC/exec",
  judgeUrl: "https://nuuuuuu.github.io/bp-wp-simsa/judge.html",
  revealOrder: ["WP", "BP", "AX"],
  bgm: { mode: "file", file: "assets/bgm/bgm.m4a", youtubeId: "U34kLXjdw90", volume: 0.5 }
};
if (typeof module !== "undefined" && module.exports) module.exports = CONFIG;
