# Screen Design

시설물 자산 및 작업지시 관리자 화면 설계 문서.

## 1. 공통 레이아웃

### 대상 화면

- `dashboard.html`
- `assets.html`
- `asset-detail.html`
- `work-orders.html`
- `import.html`

### 구성

- 상단 header
  - 시스템명
  - 모바일 메뉴 버튼
  - 로그인 사용자 표시
  - 초기화 버튼
  - 로그아웃 버튼
- 좌측 sidebar
  - 대시보드
  - 자산 관리
  - 작업지시
  - CSV Import
- 본문 content
  - 화면 제목
  - 화면별 검색 영역, 요약 영역, 테이블, 모달

### 반응형

- desktop: sidebar와 content를 좌우 배치
- mobile: sidebar를 접고 메뉴 버튼으로 열기

## 2. 로그인 화면

### 파일

- `login.html`

### 목적

- 데모 사용자 계정으로 관리자 화면에 진입

### 주요 요소

- 사용자 ID 입력
- Password 입력
- 로그인 버튼
- 오류 메시지 영역

### 주요 동작

- 필수값 미입력 시 field error 표시
- `demo / demo1234` 계정 확인
- 로그인 성공 시 `dashboard.html` 이동
- 로그인 실패 시 오류 메시지 표시

## 3. 대시보드

### 파일

- `dashboard.html`

### 목적

- 자산과 작업지시 현황을 요약 표시

### 주요 요소

- 전체 자산 수
- 자산 상태별 건수
- 작업지시 상태별 건수
- CSS 기반 막대 그래프
- 최근 작업지시 5건 테이블

### 주요 동작

- 자산 상태 카드를 클릭하면 해당 상태로 필터링된 자산 목록으로 이동
- 긴급 작업지시는 row와 badge 강조
- 완료/취소된 긴급 작업지시는 강조를 낮춰 표시

## 4. 자산 목록

### 파일

- `assets.html`

### 목적

- 시설물 자산 목록 조회, 검색, 등록, 수정, 삭제

### 검색 조건

- 자산명
- 자산코드
- 자산유형
- 상태
- 공간

### 주요 요소

- 검색 영역
- 자산 목록 테이블
- 정렬 가능한 컬럼
- 페이징
- 자산 등록/수정 모달

### 주요 동작

- 검색 버튼 클릭 시 조건에 맞는 자산 표시
- 초기화 버튼 클릭 시 검색 조건 초기화
- 자산코드, 자산명, 상태, 등록일 기준 정렬
- 등록/수정 모달에서 필수값 검증
- 삭제 버튼 클릭 시 confirm 후 삭제
- 상세 버튼 클릭 시 `asset-detail.html?id={assetId}` 이동

## 5. 자산 상세

### 파일

- `asset-detail.html`

### 목적

- 선택한 자산의 기본정보, 위치정보, 관련 작업지시 확인

### 주요 요소

- 자산 기본정보
- 위치정보
- `bimElementId`
- 관련 작업지시 목록
- 상태 변경 select
- 목록 이동 버튼

### 주요 동작

- URL query string의 `id`로 자산 조회
- 자산 상태 변경 후 저장
- 목록 버튼 클릭 시 자산 목록으로 이동

## 6. 작업지시 목록

### 파일

- `work-orders.html`

### 목적

- 작업지시 조회, 등록, 상태 변경, 취소, 이력 확인

### 검색 조건

- 상태
- 우선순위
- 자산명
- 담당자

### 주요 요소

- 검색 영역
- 작업지시 목록 테이블
- 작업지시 등록 모달
- 상태 변경 버튼
- 취소 버튼
- 이력 조회 모달
- 페이징

### 주요 동작

- 조건 검색 및 초기화
- 작업지시 등록 시 필수값 검증
- 상태 변경 흐름: `OPEN → ASSIGNED → IN_PROGRESS → DONE`
- 상태 변경 시 이력 저장
- 이력 버튼 클릭 시 변경 이력 모달 표시
- `URGENT` 작업지시는 강조 표시
- 완료/취소된 긴급 작업지시는 강조 제거

## 7. CSV Import

### 파일

- `import.html`

### 목적

- CSV 텍스트를 붙여넣어 자산 데이터를 일괄 추가

### 주요 요소

- CSV 텍스트 입력 영역
- 샘플 CSV 버튼
- 파싱 버튼
- 미리보기 테이블
- 오류 목록
- Import 버튼
- 결과 메시지 영역

### 주요 동작

- 샘플 CSV 버튼 클릭 시 예시 데이터 입력
- CSV 파싱 시 헤더, 필수값, 상태 코드, 날짜 형식 검증
- 정상 데이터는 미리보기 테이블에 표시
- 오류 데이터는 오류 목록에 표시
- Import 버튼 클릭 시 정상 데이터만 자산 목록에 추가

## 8. 화면 이동 흐름

```text
index.html
  ├─ 로그인 정보 있음 → dashboard.html
  └─ 로그인 정보 없음 → login.html

login.html
  └─ 로그인 성공 → dashboard.html

dashboard.html
  ├─ 자산 상태 클릭 → assets.html?status={status}
  ├─ sidebar 자산 관리 → assets.html
  ├─ sidebar 작업지시 → work-orders.html
  └─ sidebar CSV Import → import.html

assets.html
  └─ 상세 버튼 클릭 → asset-detail.html?id={assetId}

asset-detail.html
  └─ 목록 버튼 클릭 → assets.html
```
