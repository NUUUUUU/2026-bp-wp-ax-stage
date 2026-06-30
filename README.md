# 2026 BP·WP·AX 경진대회 무대 슬라이드

무대 송출용 인터랙티브 HTML 2종.

- `guidance.html` — 심사위원 안내(평가 시간 송출): QR·접속주소·입력 4스텝·BGM.
- `awards.html` — 시상 발표(사회자 송출): WP→BP→AX, 우수상→대상, 라이브 집계 + 극적 리빌.

## 실행
- 가장 안정적: 폴더에서 `npx serve .` 후 크롬으로 `http://localhost:3000/guidance.html`, `…/awards.html` 접속.
- 또는 파일을 크롬으로 직접 열기(`file://`). 시상 라이브 집계는 인터넷 필요.
- 무대에선 `F`로 전체화면.

## 제어키
→ / Space 다음 · ← 이전 · F 전체화면 · B 블랙아웃 · (시상) R 결과 새로고침.

## 행사 전 설정(`config.js`)
- `judgeUrl` — 심사 평가 페이지 공개 배포 주소(안내 QR이 가리킴). GitHub Pages 등.
- `apiUrl` — Apps Script `/exec` 주소(시상 라이브 집계 fetch). 스킬 setup-guide 참고.
- 두 값을 넣고 저장하면 QR·집계가 실제로 동작한다.

## 시상 리허설
- API 없이 점검: `awards.html?demo=1` (합성 데이터로 전체 리빌 확인).
- 실제 행사: 심사 종료 후 `awards.html`을 열면 라이브 집계로 승자가 채워진다. 네트워크가 불안하면 무대 직전 한 번 열어 스냅샷을 잡고 그대로 진행한다(끊겨도 리빌은 메모리로 동작). 갱신은 `R`.

## BGM
`assets/bgm/bgm.m4a`를 재생한다. 파일이 없으면 차분한 음원을 그 경로에 두면 된다(저작권은 내부 사용 기준으로 운영자가 판단). 유튜브 직접 재생이 필요하면 `config.js`의 `bgm.mode`를 `"youtube"`로 두는 옵션이 있으나 인터넷·광고 리스크로 비상용. 다운로드된 `assets/bgm/bgm.m4a`는 약 261MB의 긴 트랙이므로 로드 부하를 줄이려면 운영자가 짧은 잔잔한 루프 음원으로 교체하는 것을 권장한다.

## 집계 정합성
시상 집계는 관리자(admin)와 **동일한 중앙값 알고리즘**이다. `npm test`의 parity 테스트가 admin 스냅샷과 동일 결과임을 보증한다. 스킬의 집계가 바뀌면 `test/fixtures/admin.template.html`을 다시 복사하고 `npm test`로 재확인한다.
