시상 효과음/음악 파일을 여기에 둡니다. (awards.html이 자동으로 읽음)

파일명(mp3/m4a/wav/ogg 아무 확장자나 됨):
  opening.mp3   ← 커버(시작) 화면 배경 음악. 시상 시작하면 페이드 정지.
  teaser.mp3    ← 각 상 시작("○○ 부문 △△ 수상자! 누구일까요?") 효과음. 발표로 넘어가면 정지.
  reveal.mp3    ← 수상자 공개 순간 음악. 현수막(포토타임)까지 이어지고 다음 장면서 정지.
  drumroll.mp3  ← (예비) teaser.mp3 없을 때 쓰는 드럼롤.

볼륨: BGM은 잔잔하게 코드에서 낮춰둠(오프닝 0.30·리빌 0.5·티저 0.55). 조정은 awards.html 참고.

동작·주의:
- 파일이 있으면 그 소리로, 없으면 코드 합성음으로 폴백.
- 반드시 서버로 열어야 로드됨 → 폴더의 _서버시작.bat 더블클릭(또는 npx serve .) 후
  http://localhost:3000/awards.html 로 여세요. 파일 더블클릭(file://)은 오디오가 막힙니다.
- 무료·저작권프리 음원: mixkit.co/free-sound-effects, pixabay.com/sound-effects.
