/**
 * 부치기 바치기 수요 조사 — 응답을 이 스프레드시트에 한 줄씩 기록합니다.
 *
 * 설치: 구글 시트 › 확장 프로그램 › Apps Script 에 이 코드를 붙여넣고
 *       배포 › 새 배포 › 유형 "웹 앱", 실행 계정 "나", 액세스 권한 "모든 사용자" 로 배포.
 *       나온 웹 앱 URL(…/exec)을 src/lib/survey.ts 의 SURVEY_ENDPOINT 에 넣으면 됩니다.
 */

const SHEET_NAME = '응답';

function doPost(e) {
  const answer = String((e && e.parameter && e.parameter.answer) || '');
  if (answer !== 'yes' && answer !== 'no') {
    return ContentService.createTextOutput('invalid');
  }
  // Short anonymous id from the visitor's browser; trimmed so the sheet can't be stuffed with long text.
  const visitor = String(e.parameter.visitor || '').slice(0, 64);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet_();
    sheet.appendRow([new Date(), answer === 'yes' ? '네' : '아니요', visitor]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['시간', '응답', '방문자 ID']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
