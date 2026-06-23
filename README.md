# 시설물 자산/작업지시 관리 관리자 화면 POC

HTML, CSS, JavaScript, jQuery로 구현한 시설물 자산/작업지시 관리용 정적 관리자 화면입니다.

## Demo

- GitHub Pages: 배포 후 추가 예정
- Login: `demo` / `demo1234`

## 프로젝트 개요

- 시설물 자산/작업지시 관리용 정적 관리자 화면 POC
- 서버/DB 없이 JSON 파일과 localStorage 기반 데이터 흐름 구성
- 검색, 필터, 정렬, 페이지네이션, 모달, 폼 검증, CSV import 구현
- 로그인, 대시보드, 자산 관리, 자산 상세, 작업지시 관리, CSV import 화면 구성

## 구현 방향

- 정적 HTML 화면 단위로 구성하고, 화면별 JavaScript 파일에서 이벤트와 렌더링 처리
- 공통 기능은 `app.js`, `api.js`, `storage.js`, `validation.js`, `modal.js`, `table.js`로 분리
- 초기 데이터는 `$.getJSON`으로 JSON 파일을 로딩하고, 이후 변경 데이터는 localStorage 우선 사용
- 테이블 검색/필터/정렬/페이지네이션은 서버 요청 없이 클라이언트에서 처리
- Bootstrap, jQuery UI, Chart 라이브러리 없이 CSS와 jQuery로 UI 동작 구현

## 기술 스택 및 사용 범위

| 기술 | 사용 범위 |
| --- | --- |
| HTML5 | 화면 구조, form, table, 시맨틱 레이아웃 |
| CSS3 | flex/grid 레이아웃, 반응형 처리, 모달, badge, CSS 막대 그래프 |
| JavaScript ES6 | 데이터 필터링/정렬, 날짜 처리, query string 처리, CSV parsing |
| jQuery 3.x | AJAX, DOM 조작, 이벤트 바인딩/위임, 폼 데이터 처리 |
| JSON | 초기 샘플 데이터 |
| localStorage | 로그인 상태, 변경 데이터, 작업지시 이력 저장 |

## 주요 화면

- `login.html`: 로그인 폼, 필수값 검증, demo 계정 로그인 처리
- `dashboard.html`: 자산/작업지시 요약, 최근 작업지시, CSS 기반 막대 그래프
- `assets.html`: 자산 검색, 정렬, 페이지네이션, 등록/수정 모달, 삭제 confirm
- `asset-detail.html`: query string 기반 자산 상세, 위치정보, 관련 작업지시, 상태 변경
- `work-orders.html`: 작업지시 검색, 등록, 상태 흐름 변경, 취소 처리, 이력 모달, 긴급 작업 강조
- `import.html`: CSV 붙여넣기, 샘플 CSV, 헤더/값 검증, 미리보기, localStorage import

## 구현 기능 목록

- 공통 header/sidebar/content 관리자 레이아웃
- 반응형 sidebar collapse
- JSON 샘플 데이터 로딩
- localStorage 데이터 유지
- 자산 CRUD
- 작업지시 등록 및 상태 변경
- 작업지시 취소 처리 및 상태 변경 이력 모달
- 검색/필터/정렬/페이지네이션
- 모달 UI
- 폼 필수값 validation
- CSV parsing, 필수 헤더 검증, 상태 코드 검증, 날짜 포맷 검증
- 프로젝트 localStorage 초기화

## jQuery로 구현한 기능

- AJAX: `$.getJSON`으로 `data/*.json` 초기 데이터 로딩
- DOM 조작: 테이블 row, badge, chart, 상세 정보 동적 렌더링
- 이벤트 처리: 클릭, submit, 이벤트 위임 기반 테이블 액션 처리
- 모달: 직접 작성한 modal open/close 처리
- validation: 필수값 검사와 field error 표시
- 검색/필터/정렬/페이지네이션: 자산 및 작업지시 목록에서 클라이언트 처리
- localStorage: 로그인, 자산, 작업지시, 상태 변경 이력 저장 및 초기화
- CSV parsing: CSV 텍스트를 자산 데이터로 변환하고 헤더/행 오류 목록 표시

## 로컬 실행 방법

JSON 파일은 브라우저에서 직접 파일로 열면 CORS 또는 로컬 파일 접근 제한으로 로딩되지 않을 수 있습니다. 로컬 웹 서버로 실행하세요. jQuery 파일은 프로젝트에 포함되어 있어 별도 CDN 연결 없이 실행할 수 있습니다.

### VSCode Live Server

1. VSCode에서 프로젝트 폴더를 엽니다.
2. Live Server 확장을 설치합니다.
3. `login.html` 또는 `index.html`에서 `Open with Live Server`를 실행합니다.

### npx http-server

```bash
npx http-server . -p 8080
```

브라우저에서 `http://localhost:8080`으로 접속합니다.

PowerShell 실행 정책 때문에 `npx`가 막히는 환경에서는 포함된 간단 서버를 사용할 수 있습니다.

```bash
node server.js
```

## 의도적으로 제외한 것

- Vue/React/Angular 제외
- Spring Boot 제외
- DB 제외
- Docker 제외
- 실제 BIM/IFC 파싱 제외
- Bootstrap, jQuery UI, Chart 라이브러리 제외

## 이력서 포트폴리오 설명 문구

시설물 자산 및 작업지시 관리 관리자 화면 POC를 HTML5, CSS3, JavaScript, jQuery로 구현했습니다. JSON 기반 초기 데이터 로딩, localStorage 영속화, 자산 CRUD, 작업지시 상태 흐름과 이력 모달, 검색/필터/정렬/페이지네이션, 모달, 폼 검증, CSV import 및 헤더/값 검증 기능을 직접 구현하여 레거시 jQuery 기반 관리자 화면 개발 역량을 보여주는 프로젝트입니다.
