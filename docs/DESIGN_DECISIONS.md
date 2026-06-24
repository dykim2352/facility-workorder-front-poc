# Design Decisions

프로젝트 구현 중 주요 구조 결정.

## 1. GitHub Pages 배포를 고려한 정적 구조

### 결정

- Spring Boot, DB, Docker 없이 HTML/CSS/JavaScript/jQuery 기반 정적 프로젝트로 구성함
- GitHub Pages에서 바로 확인 가능한 형태로 배포함

### 이유

- 프론트엔드 화면 구현, DOM 조작, 이벤트 처리, jQuery AJAX 흐름을 보여주는 것이 목적임
- 백엔드 실행 환경 없이 URL만으로 결과물을 확인할 수 있음

## 2. JSON/localStorage 기반 데모 데이터 흐름

### 결정

- 초기 데이터는 `data/*.json`에서 로딩함
- 변경된 데이터는 localStorage에 저장함

### 이유

- 서버와 DB 없이도 목록, 상세, 등록, 수정, 삭제 흐름을 재현할 수 있음
- 새로고침 후에도 변경 데이터를 유지할 수 있음

## 3. jQuery 로컬 파일 포함

### 결정

- jQuery CDN 대신 `vendor/jquery-3.7.1.min.js`를 프로젝트에 포함함
- 모든 HTML에서 로컬 jQuery 파일을 참조함

### 이유

- 외부 네트워크 상태와 CDN 접근 가능 여부에 영향을 받지 않음
- GitHub Pages와 로컬 실행 환경에서 동일한 jQuery 파일을 사용함

현재 참조:

```html
<script src="vendor/jquery-3.7.1.min.js"></script>
```

## 4. 데이터 접근 지점 api.js 분리

### 결정

- 로그인, 자산, 작업지시, 이력 데이터 접근을 `api.js`로 모음
- 화면 JS는 `Api.login()`, `Api.loadAssets()`, `Api.saveWorkOrders()` 같은 함수만 호출함

### 이유

- 화면 렌더링 로직과 저장/조회 로직을 분리함
- 추후 백엔드 API 연동 시 화면 JS 변경 범위를 줄임

현재 구조:

```text
화면 JS → Api 함수 호출 → JSON/localStorage 처리
```

백엔드 연동 시 변경 지점:

```text
api.js의 $.getJSON / localStorage 처리 → HTTP API 호출
```

## 5. 저장 함수의 비동기 흐름 통일

### 결정

- localStorage 저장 함수도 Promise 형태를 반환하도록 맞춤
- 화면 갱신은 `.done()` 안에서 처리함

### 이유

- localStorage 저장은 즉시 완료되지만, 백엔드 API 저장은 비동기로 동작함
- 저장 완료 후 화면 갱신하는 흐름으로 미리 맞춰두면 API 연동 시 변경 범위가 작아짐

예시:

```js
Api.saveAssets(assets).done(function () {
  render();
});
```

## 6. 로그인은 데모 JSON 기반으로 구현

### 결정

- `data/users.json`에서 데모 계정을 로딩함
- 로그인 성공 후 localStorage에 로그인 사용자 정보를 저장함
- 로그인 성공 후 항상 `dashboard.html`로 이동함

### 이유

- GitHub Pages 환경에서는 서버 인증을 사용할 수 없음
- 로그인 폼 검증, AJAX 흐름, 로그인 상태 유지, 로그아웃 처리를 보여주는 데 집중함
- `redirect` 복귀 흐름은 정적 페이지와 뒤로가기 캐시 처리에서 복잡도가 커져 제거함

## 7. localStorage.clear() 미사용

### 결정

- `localStorage.clear()` 대신 프로젝트에서 사용하는 key만 삭제함

### 이유

- `localStorage.clear()`는 현재 도메인의 모든 localStorage 값을 삭제함
- 같은 도메인에서 다른 테스트 값을 사용하는 경우까지 삭제되는 위험이 있음

적용 코드:

```js
clearAll: function () {
  remove(keys.assets);
  remove(keys.workOrders);
  remove(keys.spaces);
  remove(keys.histories);
  remove(keys.loginUser);
}
```

## 8. header/sidebar 중복 유지

### 결정

- 각 HTML 파일에 header/sidebar 마크업을 유지함

### 이유

- 순수 정적 HTML 환경에서는 서버 템플릿 include를 사용할 수 없음
- partial 로딩을 추가하면 비동기 로딩 타이밍, 메뉴 active 처리, 초기 렌더링 순서를 별도로 관리해야 함
- 현재 프로젝트 규모에서는 중복 제거보다 실행 단순성을 우선함
