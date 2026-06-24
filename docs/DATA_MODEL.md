# Data Model

시설물 자산 및 작업지시 관리자 화면에서 사용하는 JSON 데이터 구조.

## 1. 데이터 파일

| 파일 | 용도 |
| --- | --- |
| `data/assets.json` | 자산 초기 데이터 |
| `data/work-orders.json` | 작업지시 초기 데이터 |
| `data/spaces.json` | 위치정보 초기 데이터 |
| `data/users.json` | 데모 로그인 계정 데이터 |

## 2. Asset

자산 기본정보와 위치정보를 표현하는 데이터.

### 필드

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | string | Y | 자산 고유 ID |
| `assetCode` | string | Y | 자산 코드 |
| `assetName` | string | Y | 자산명 |
| `assetType` | string | Y | 자산 유형 |
| `status` | string | Y | 자산 상태 |
| `projectName` | string | N | 프로젝트명 |
| `buildingName` | string | N | 건물명 |
| `floorName` | string | N | 층 |
| `spaceName` | string | Y | 공간명 |
| `bimElementId` | string | N | BIM 요소 식별자 |
| `installedAt` | string | N | 설치일, `YYYY-MM-DD` |
| `updatedAt` | string | N | 수정일, `YYYY-MM-DD` |

### status

| 값 | 화면 표시 |
| --- | --- |
| `NORMAL` | 정상 |
| `INSPECTION` | 점검중 |
| `BROKEN` | 고장 |
| `DISPOSED` | 폐기 |

### 예시

```json
{
  "id": "A001",
  "assetCode": "PUMP-001",
  "assetName": "급수 펌프 1호",
  "assetType": "PUMP",
  "status": "NORMAL",
  "projectName": "스마트팩토리",
  "buildingName": "A동",
  "floorName": "B1",
  "spaceName": "펌프실",
  "bimElementId": "bim-pump-0001",
  "installedAt": "2024-03-10",
  "updatedAt": "2026-06-20"
}
```

## 3. WorkOrder

자산에 연결된 작업지시 데이터.

### 필드

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | string | Y | 작업지시 고유 ID |
| `assetId` | string | Y | 연결 자산 ID |
| `title` | string | Y | 작업지시 제목 |
| `description` | string | N | 작업 설명 |
| `priority` | string | Y | 우선순위 |
| `status` | string | Y | 작업지시 상태 |
| `assignee` | string | N | 담당자 |
| `requestedAt` | string | Y | 요청일시, ISO 문자열 |
| `completedAt` | string | N | 완료일시, ISO 문자열 |

### priority

| 값 | 화면 표시 |
| --- | --- |
| `LOW` | 낮음 |
| `MEDIUM` | 보통 |
| `HIGH` | 높음 |
| `URGENT` | 긴급 |

### status

| 값 | 화면 표시 |
| --- | --- |
| `OPEN` | 접수 |
| `ASSIGNED` | 배정 |
| `IN_PROGRESS` | 진행중 |
| `DONE` | 완료 |
| `CANCELED` | 취소 |

### 상태 변경 흐름

```text
OPEN → ASSIGNED → IN_PROGRESS → DONE
```

`CANCELED`는 취소 버튼으로 변경.

### 예시

```json
{
  "id": "W001",
  "assetId": "A001",
  "title": "급수 펌프 진동 점검",
  "description": "진동 수치 상승에 따른 현장 점검",
  "priority": "URGENT",
  "status": "OPEN",
  "assignee": "김관리",
  "requestedAt": "2026-06-20T09:30",
  "completedAt": ""
}
```

## 4. WorkOrderHistory

작업지시 상태 변경 이력 데이터.

### 저장 위치

- 초기 JSON 파일 없음
- 상태 변경 시 localStorage에 누적 저장

### 필드

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `workOrderId` | string | Y | 작업지시 ID |
| `fromStatus` | string | Y | 변경 전 상태 |
| `toStatus` | string | Y | 변경 후 상태 |
| `changedAt` | string | Y | 변경일시, ISO 문자열 |

### 예시

```json
{
  "workOrderId": "W001",
  "fromStatus": "OPEN",
  "toStatus": "ASSIGNED",
  "changedAt": "2026-06-20T10:10:00.000Z"
}
```

## 5. Space

자산 위치정보 입력과 표시를 위한 데이터.

### 필드

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | string | Y | 위치정보 ID |
| `projectName` | string | Y | 프로젝트명 |
| `buildingName` | string | Y | 건물명 |
| `floorName` | string | Y | 층 |
| `spaceName` | string | Y | 공간명 |

### 예시

```json
{
  "id": "S001",
  "projectName": "스마트팩토리",
  "buildingName": "A동",
  "floorName": "B1",
  "spaceName": "펌프실"
}
```

## 6. User

데모 로그인을 위한 사용자 데이터.

### 필드

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `userId` | string | Y | 로그인 ID |
| `password` | string | Y | 데모 비밀번호 |
| `userName` | string | N | 사용자명 |
| `role` | string | N | 권한 |

### 예시

```json
{
  "userId": "demo",
  "password": "demo1234",
  "userName": "Demo User",
  "role": "ADMIN"
}
```

## 7. localStorage key

| key | 저장 데이터 |
| --- | --- |
| `fw_assets` | 변경된 자산 목록 |
| `fw_workOrders` | 변경된 작업지시 목록 |
| `fw_spaces` | 위치정보 목록 |
| `fw_workOrderHistories` | 작업지시 상태 변경 이력 |
| `loginUser` | 로그인 사용자 정보 |

## 8. 데이터 로딩 우선순위

```text
localStorage 데이터 존재
  → localStorage 데이터 사용

localStorage 데이터 없음
  → data/*.json 초기 데이터 로딩
  → localStorage에 초기 데이터 저장
```

## 9. CSV Import 필수 컬럼

CSV Import에서 검증하는 필수 컬럼.

| 컬럼 | 설명 |
| --- | --- |
| `assetCode` | 자산 코드 |
| `assetName` | 자산명 |
| `assetType` | 자산 유형 |
| `status` | 자산 상태 |
| `spaceName` | 공간명 |
| `installedAt` | 설치일 |

### status 허용값

```text
NORMAL, INSPECTION, BROKEN, DISPOSED
```

### installedAt 형식

```text
YYYY-MM-DD
```
