# Troubleshooting

프로젝트 구현 및 테스트 중 확인한 주요 이슈와 처리 내역.

## 1. HTML 파일 직접 실행 시 JSON 로딩 실패

### 증상

- `login.html`을 더블클릭해 `file://` 경로로 실행한 뒤 로그인 시도
- `로그인 데이터를 불러오지 못했습니다.` 메시지 표시됨
- 로그인 전 구조에서는 `dashboard.html` 직접 실행 시 자산/작업지시 데이터가 비어 보였음

### 원인

- 로그인, 자산, 작업지시 데이터는 `$.getJSON("data/*.json")`으로 AJAX 로딩함
- `file://` 환경에서는 브라우저 보안 정책 때문에 로컬 JSON AJAX 요청이 차단됨

### 처리

- HTML 파일 직접 실행 대신 HTTP 환경에서 실행하도록 정리함
- 실행 방법을 README에 명시함

```bash
node server.js
```

```bash
npx http-server . -p 8080
```

## 2. 로그아웃 후 뒤로가기 시 이전 화면 노출

### 증상

- 로그인 후 대시보드 또는 관리 화면으로 이동
- 로그아웃 클릭
- 브라우저 뒤로가기 실행
- 로그아웃 상태인데 이전 관리 화면이 다시 보임

### 원인

- 브라우저가 이전 페이지를 새로 로딩하지 않고 뒤로가기 캐시에서 복원함
- 최초 로딩 시점의 로그인 체크만으로는 캐시 복원 상황을 막지 못함
- `location.href`는 브라우저 히스토리에 이동 전 화면을 남기므로 뒤로가기 시 이전 관리 화면이 다시 노출됨

### 처리

- 인증 실패, 로그아웃, 초기화 후 로그인 페이지 이동 시 `location.replace()` 사용
- `location.replace()`는 현재 히스토리 항목을 로그인 페이지로 교체해 뒤로가기 복귀 가능성을 줄임
- `pageshow` 이벤트에서 로그인 상태 재검사
- `pageshow`는 일반 로딩뿐 아니라 브라우저 뒤로가기 캐시에서 페이지가 복원될 때도 실행됨
- 관리 화면에서 로그인 체크 실패 시 이후 렌더링 중단

```js
if (!App.requireLogin()) return;
```

```js
window.addEventListener("pageshow", function () {
  requireLogin();
});
```

```js
location.replace("login.html");
```

## 3. JavaScript 캐시로 수정사항 미반영

### 증상

- GitHub Pages에 수정 코드를 올린 뒤에도 이전 로그인/인증 동작이 계속 보임

### 원인

- 브라우저가 기존 `js/app.js`, `js/api.js`, `js/login.js` 캐시를 사용함
- 파일 경로가 동일하면 수정된 파일을 바로 다시 받지 않음

### 처리

- 변경 영향이 큰 JavaScript 파일 참조에 버전 쿼리 추가함

```html
<script src="js/api.js?v=20260623"></script>
<script src="js/app.js?v=20260623"></script>
<script src="js/login.js?v=20260623"></script>
```

## 4. 완료된 긴급 작업지시 강조 유지

### 증상

- 우선순위가 `URGENT`인 작업지시를 `DONE` 상태로 변경
- 완료 후에도 row 배경과 우선순위 badge가 빨간색으로 유지됨

### 원인

- 긴급 강조 기준이 `priority === "URGENT"`에만 의존함
- 작업지시가 완료/취소 상태인지 고려하지 않음

### 처리

- `DONE`, `CANCELED` 상태는 긴급 강조에서 제외함
- 완료/취소된 긴급 작업지시는 `badge-muted`로 표시함

```js
function isActiveUrgent(item) {
  return item.priority === "URGENT" && item.status !== "DONE" && item.status !== "CANCELED";
}
```

```html
<span class="badge badge-muted">긴급</span>
```

## 5. CSV Import 날짜 검증 오류

### 증상

- 샘플 CSV의 `installedAt` 날짜가 `YYYY-MM-DD` 형식인데도 오류로 처리됨

### 원인

- `new Date("YYYY-MM-DD")` 문자열 파싱은 UTC 기준으로 해석됨
- UTC 기준 날짜를 로컬 시간으로 읽으면 시간대에 따라 `getDate()` 결과가 하루 밀림
- JavaScript `Date`는 존재하지 않는 날짜를 자동 보정함

### 처리

- 정규식으로 `YYYY-MM-DD` 형식을 먼저 확인함
- `new Date(year, month - 1, day)`로 생성한 뒤 연/월/일이 원본과 같은지 비교함
- `2025-02-30`처럼 존재하지 않는 날짜를 오류로 처리함

```js
function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  var parts = value.split("-").map(Number);
  var date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.getFullYear() === parts[0]
    && date.getMonth() === parts[1] - 1
    && date.getDate() === parts[2];
}
```
