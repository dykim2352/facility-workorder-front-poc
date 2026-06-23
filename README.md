# 시설물 자산 및 작업지시 관리자 화면 PoC

HTML, CSS, JavaScript, jQuery로 구현한 시설물 자산 및 작업지시 관리자 화면입니다.

## Demo

- GitHub Pages: https://dykim2352.github.io/facility-workorder-front-poc/
- 로그인: `demo` / `demo1234`
- 데이터: 실제 운영 데이터가 아닌 데모용 샘플 데이터

## 프로젝트 개요

- 시설물 자산과 작업지시를 관리하는 업무 화면 구성
- GitHub Pages에서 확인 가능한 프론트엔드 중심 데모 구성
- 검색, 필터, 정렬, 페이징, 모달, 폼 검증, CSV import 구현
- 로그인, 대시보드, 자산 관리, 자산 상세, 작업지시 관리, CSV import 화면 구성

## 구현 방향

- HTML 화면 단위로 구성하고, 화면별 JavaScript 파일에서 이벤트와 렌더링 처리
- 공통 기능은 `app.js`, `api.js`, `storage.js`, `validation.js`, `modal.js`, `table.js`로 분리
- GitHub Pages에서 바로 확인할 수 있도록 JSON/localStorage 기반으로 데모 데이터 구성
- 로그인, 자산, 작업지시, 이력 데이터 접근은 `api.js`로 모아 화면 로직과 저장 로직 분리
- 로그인 상태 저장/조회/삭제는 `app.js`의 공통 함수로 처리
- 저장 함수는 비동기 흐름으로 맞춰 추후 백엔드 API 연동 시 변경 범위를 줄이도록 구성
- 테이블 검색/필터/정렬/페이징은 서버 요청 없이 클라이언트에서 처리
- Bootstrap, jQuery UI, Chart 라이브러리 없이 CSS와 jQuery로 UI 동작 구현

## 기술 스택 및 사용 범위

| 기술 | 사용 범위 |
| --- | --- |
| HTML5 | 화면 구조, 폼, 테이블, 시맨틱 레이아웃 |
| CSS3 | flex/grid 레이아웃, 반응형 처리, 모달, 상태 배지, CSS 막대 그래프 |
| JavaScript ES6 | 데이터 필터링/정렬, 날짜 처리, URL query string 처리, CSV 파싱 |
| jQuery 3.x | AJAX, DOM 조작, 이벤트 바인딩/위임, 폼 데이터 처리 |
| JSON | 초기 샘플 데이터, 데모 계정 데이터, AJAX 로딩 흐름 |
| localStorage | 로그인 상태/만료, 변경 데이터, 작업지시 이력 저장 및 초기화 |

## 주요 화면

- `login.html`: JSON 기반 데모 계정 로그인, 필수값 검증, 로그인 만료 처리, 대시보드 이동
- `dashboard.html`: 자산/작업지시 요약, 최근 작업지시, CSS 막대 그래프, 상태별 자산 목록 이동
- `assets.html`: 자산 검색/필터/정렬/페이징, 등록/수정 모달, 삭제 확인
- `asset-detail.html`: URL의 자산 ID 기반 상세 조회, 위치정보, 관련 작업지시, 상태 변경
- `work-orders.html`: 작업지시 검색/필터/페이징, 등록 모달, 상태 변경/취소, 이력 모달, 긴급 작업 강조
- `import.html`: CSV 붙여넣기, 샘플 CSV, 헤더/값 검증, 미리보기, 자산 데이터 추가

## 구현 기능 목록

- header/sidebar/content 기반 관리자 레이아웃
- 모바일 화면 sidebar 접기/펼치기
- `api.js` 기반 데이터 로딩/저장 흐름 분리
- `$.getJSON` 기반 JSON 샘플 데이터 및 데모 계정 로딩
- localStorage 기반 자산/작업지시 변경 데이터 유지
- Promise 기반 저장 완료 후 화면 갱신 처리
- 자산 등록/조회/수정/삭제
- 작업지시 등록, 상태 변경, 취소 처리, 이력 모달
- 자산 목록 검색, 필터, 정렬, 페이징
- 작업지시 목록 검색, 필터, 페이징
- 자산 등록/수정, 작업지시 등록, 이력 조회 모달
- 폼 필수값 검증 및 오류 메시지 표시
- CSV 파싱, 필수 헤더 검증, 상태 코드 검증, 날짜 형식 검증
- 로그인 만료 처리 및 관리 화면 접근 제어
- 테스트 데이터 및 로그인 정보 초기화

## 로컬 실행 방법

프로젝트 루트 폴더에서 아래 3가지 방법 중 하나로 실행할 수 있습니다.

```bash
cd facility-workorder-front-poc
```

### 1. VSCode Live Server로 실행

1. VSCode에서 프로젝트 폴더를 엽니다.
2. VSCode 왼쪽 Extensions 메뉴에서 `Live Server`를 검색해 설치합니다.
3. `index.html`에서 `Open with Live Server`를 실행하고, 열리는 로컬 주소로 접속합니다.

### 2. server.js로 실행

```bash
node server.js
```

브라우저에서 `http://127.0.0.1:8080`으로 접속합니다.

### 3. npx http-server로 실행

```bash
npx http-server . -p 8080
```

브라우저에서 `http://localhost:8080`으로 접속합니다.

### 참고

- JSON 파일을 AJAX로 로딩하므로 HTML 파일을 직접 더블클릭하지 말고 로컬 웹 서버로 실행합니다.
- jQuery 파일은 프로젝트에 포함되어 있어 별도 CDN 연결 없이 실행할 수 있습니다.
- `node server.js`와 `npx http-server`는 Node.js가 설치되어 있어야 사용할 수 있습니다. ([Node.js 다운로드](https://nodejs.org/))

## 문서

- 주요 이슈와 처리 내역: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- 구현 중 선택한 구조와 제외 범위: [docs/DESIGN_DECISIONS.md](docs/DESIGN_DECISIONS.md)

## 향후 개선 방향

- header/sidebar 공통 레이아웃 분리
- 저장/삭제/오류 처리를 위한 toast 형태의 공통 알림 UI 적용
- 목록 검색 조건과 페이징 상태 유지
- 인증/인가 및 세션 관리 확장 (추후 백엔드 연동 시)
