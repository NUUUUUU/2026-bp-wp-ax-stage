// 무대 슬라이드 공유 설정 — 스킬 config.template.json 스냅샷 + 덱 전용 키
var CONFIG = {
  event: {
    title: "2026 BP · WP · AX 경진대회",
    subtitle: "경영기획팀 · 각 항목 1~5점 (가중치 자동 환산)"
  },
  // 발표 순서 = teams 순서 (중국 → 태국 → 이집트 → 한국 → AX추진실 → HQ)
  teams: ["중국법인", "태국법인", "이집트법인", "한국사업부", "AX추진실", "HQ"],
  teamShort: { "중국법인": "중국", "태국법인": "태국", "이집트법인": "이집트", "한국사업부": "한국", "AX추진실": "AX실", "HQ": "HQ" },
  // 출품작 목록 — 채점·집계·시상의 기준 축 (심사페이지/config.json entries와 동일하게 유지)
  entries: [
    { id: "CN-BP1", team: "중국법인", cat: "BP", sub: "", title: "AI Vision Camera를 활용한 Press AX 1.5단계" },
    { id: "CN-BP2", team: "중국법인", cat: "BP", sub: "", title: "지게차 사고 예방 시스템" },
    { id: "CN-WP1", team: "중국법인", cat: "WP", sub: "", title: "C2자동화 병목공정 개선 실패 및 제거 개선 사례" },
    { id: "TH-BP1", team: "태국법인", cat: "BP", sub: "", title: "Air Blower와 Oil 도포기의 One Control System 도입" },
    { id: "TH-WP1", team: "태국법인", cat: "WP", sub: "", title: "태양광 최소 사용량(MCC) 미달에 따른 위약금(Penalty) 발생" },
    { id: "TH-AX1", team: "태국법인", cat: "AX", sub: "", title: "AI Safety CCTV System 구축" },
    { id: "EG-BP1", team: "이집트법인", cat: "BP", sub: "", title: "WM Cabinet Cover 자동세척 (자체개발)" },
    { id: "EG-WP1", team: "이집트법인", cat: "WP", sub: "", title: "TV 개발모델 NU C.B 사전준비 실패" },
    { id: "EG-AX1", team: "이집트법인", cat: "AX", sub: "", title: "위험신호 확인 시스템 개발 (자체개발)" },
    { id: "KR-BP1", team: "한국사업부", cat: "BP", sub: "생산1팀", title: "차세대 AI 교육 System OASIS 구축" },
    { id: "KR-WP1", team: "한국사업부", cat: "WP", sub: "생산1/품질1/혁신팀/생기팀", title: "Door Liner 3 Line (구. 공정 유휴 설비) 반전기 자체 개조" },
    { id: "KR-AX1", team: "한국사업부", cat: "AX", sub: "품질1팀", title: "품질 산점도 시스템 Ver.2 개선활동" },
    { id: "KR-BP2", team: "한국사업부", cat: "BP", sub: "생산2팀", title: "생산 공수 관리 체계 구축 및 Manifold QR 리딩 자동화" },
    { id: "KR-WP2", team: "한국사업부", cat: "WP", sub: "자재팀/개발팀", title: "BOM 사전 검증체계 구축을 통한 견적·정산 오류 예방" },
    { id: "KR-AX2", team: "한국사업부", cat: "AX", sub: "생산2팀", title: "AX정보화" },
    { id: "AXD-BP1", team: "AX추진실", cat: "BP", sub: "", title: "개선제안 페이지 구축" },
    { id: "AXD-AX1", team: "AX추진실", cat: "AX", sub: "", title: "GSMS (서버운영모니터링)" },
    { id: "HQ-AX1", team: "HQ", cat: "AX", sub: "기획팀", title: "경영관리 시스템 구축" }
  ],
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
      {"n": "확산 가능성 및 범용성", "w": 15}
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
    onePerTeam: true,
    default: [
      { rank: 1, prize: "상금 200만원", ttl: "대상" },
      { rank: 2, prize: "상금 100만원", ttl: "우수상" }
    ],
    WP: [ { rank: 1, prize: "상금 100만원", ttl: "대상" } ],
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
