/*************************************************************
 *  BP·WP·AX 경진대회 심사 — 구글 시트 백엔드 (Apps Script)
 *  사용법은 "설정가이드"를 참고하세요.
 *  - 심사위원 제출(submit), 관리자 조회(get), 초기화(reset) 처리
 *  - 모든 통신은 JSONP(GET) 방식이라 CORS 문제 없이 작동합니다.
 *************************************************************/

var SHEET_NAME = 'submissions';      // 데이터가 쌓이는 시트 탭 이름 (자동 생성)
var RESET_KEY  = 'shinshinsa2026';   // ★ 초기화 보호키 (admin.html의 키와 반드시 동일하게)

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['제출시각', '성명', '소속', '점수데이터(JSON)']);
  }
  return sh;
}

// 모든 요청은 GET(JSONP)으로 들어옵니다.
function doGet(e) {
  var p = e.parameter || {};
  var cb = p.callback;
  var out;
  try {
    if (p.action === 'submit') {
      var data = JSON.parse(p.data || '{}');
      getSheet().appendRow([new Date(), data.name || '', data.dept || '', JSON.stringify(data.scores || {})]);
      out = { ok: true };
    } else if (p.action === 'reset') {
      if (p.key !== RESET_KEY) {
        out = { ok: false, error: '초기화 키가 올바르지 않습니다.' };
      } else {
        var sh = getSheet();
        var last = sh.getLastRow();
        if (last > 1) sh.deleteRows(2, last - 1); // 헤더(1행)만 남기고 삭제
        out = { ok: true, reset: true };
      }
    } else { // 기본: 전체 조회
      var sheet = getSheet();
      var rows = sheet.getDataRange().getValues();
      rows.shift(); // 헤더 제거
      var list = rows.map(function (r) {
        var scores = {};
        try { scores = JSON.parse(r[3] || '{}'); } catch (x) {}
        return { timestamp: r[0], name: r[1], dept: r[2], scores: scores };
      });
      out = { ok: true, submissions: list };
    }
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  var json = JSON.stringify(out);
  if (cb) return ContentService.createTextOutput(cb + '(' + json + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
