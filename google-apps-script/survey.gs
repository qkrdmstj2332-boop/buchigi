/**
 * 부치기 바치기 수요 조사 — 응답을 이 스프레드시트에 한 줄씩 기록합니다.
 *   "응답" 탭: 네/아니요 투표
 *   "상세 응답" 탭: "네"를 고른 사람의 추가 질문 3개(본인 나이대, 부모님 나이대, 독립 여부)
 *
 * 설치: 구글 시트 › 확장 프로그램 › Apps Script 에 이 코드를 붙여넣고
 *       배포 › 새 배포 › 유형 "웹 앱", 실행 계정 "나", 액세스 권한 "모든 사용자" 로 배포.
 *       나온 웹 앱 URL(…/exec)을 src/lib/survey.ts 의 SURVEY_ENDPOINT 에 넣으면 됩니다.
 * 코드를 고친 뒤에는 배포 › 배포 관리 › 수정 › 버전 "새 버전" 으로 다시 배포해야 같은 URL이 유지됩니다.
 */

function doPost(e) {
  const p = (e && e.parameter) || {};
  // Short anonymous id from the visitor's browser; trimmed so the sheet can't be stuffed with long text.
  const visitor = String(p.visitor || '').slice(0, 64);

  let row, sheetName, header;
  if (p.type === 'detail') {
    sheetName = '상세 응답';
    header = ['시간', '방문자 ID', '본인 나이대', '부모님 나이대', '독립 여부'];
    row = [new Date(), visitor, clip_(p.age), clip_(p.parentAge), clip_(p.living)];
  } else {
    const answer = String(p.answer || '');
    if (answer !== 'yes' && answer !== 'no') {
      return ContentService.createTextOutput('invalid');
    }
    sheetName = '응답';
    header = ['시간', '응답', '방문자 ID'];
    row = [new Date(), answer === 'yes' ? '네' : '아니요', visitor];
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_(sheetName, header).appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}

function clip_(v) {
  return String(v || '').slice(0, 30);
}

function getSheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(header);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
