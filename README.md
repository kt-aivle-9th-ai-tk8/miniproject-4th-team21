# 📚 도서 관리 서비스 (Book Management Service)

본 프로젝트는 `json-server`를 백엔드 가상 REST API로 활용하여, 도서 데이터의 조회, 생성, 상세 조회, 수정, 삭제(CRUD) 기능을 제공하는 웹 애플리케이션 서비스입니다.

---

## 🏗️ 1. 서비스 기본 구조 (Service Architecture)

본 서비스는 프론트엔드 클라이언트 애플리케이션과 독립된 가상 REST API 서버(`json-server`)를 동기화하여 작동하는 클라이언트-서버 아키텍처를 따릅니다.

```text
[ Frontend Client ] 💡 (React / Vite)
       │
       │ HTTP Requests (GET, POST, PATCH, DELETE)
       ▼
[ Backend REST API ] ⚙️ json-server (v0.17.4)
       │
       │ 파일 시스템 로컬 I/O
       ▼
[ Local Database ] 📂 db.json (JSON Data Store)
```

### 📁 프로젝트 디렉토리 구조

```text
project-root/
│
├── public/                 # 정적 에셋 및 기본 리소스
├── src/                    # 프론트엔드 개발 소스코드
│   ├── components/         # UI 컴포넌트군
│   ├── App.css             # 애플리케이션 디자인 파일
│   ├── App.jsx             # 애플리케이션 루트 엔트리
│   ├── index.css           # 기본 디자인 파일
│   └── main.jsx            # 스크립트 진입점
│
├── db.json                 # 로컬 가상 데이터베이스 파일
├── index.html              # 정적 페이지 (main.jsx 로딩용)
├── package.json            # 의존성 패키지 및 개발 스크립트
└── README.md               # 서비스 가이드라인 및 명세서 (본 문서)
```

## 🚀 2. 실행 방법 (Installation & Getting Started)

### ⚠️ 중요: 백엔드 라이브러리 버전 고정 안내

> **CRITICAL VERSION WARNING** 본 프로젝트의 `db.json` 데이터 스키마는 고유 식별자인 `id` 필드를 **정수형(Integer)**으로 매핑 및 관리합니다. `json-server`를 **1.x 이상 버전으로 사용할 경우, 새 데이터를 생성할 때 id 형식이 문자열(UUID 등)로 변환되어 깨지는 현상이 발생**합니다. 이에 따라, 반드시 정상 호환되는 `json-server@0.17.4`**json-server@0.17.4** 버전으로 고정하여 환경을 빌드하셔야 합니다.

### 🛠️ 1) 패키지 설치

프로젝트 루트 디렉토리에서 아래 명령어를 실행하여 명세에 부합하는 필요한 패키지들을 일괄 설치합니다.

```bash
npm install
npm install json-server@0.17.4
```

### 🏃 2) 가상 백엔드 Mock 서버 구동

서버 측 데이터 저장소 역할을 수행할 `db.json` 파일을 감시(watch) 모드로 설정하여 API 서버를 실행합니다. 기본 포트는 `3000`번을 사용합니다.

```bash
npx json-server --watch db.json --port 3000
```

### 💻 3) 프론트엔드 클라이언트 실행

새로운 개발 터미널 탭을 열고 프론트엔드 로컬 서버를 가동합니다.

```bash
npm run dev
```

서버가 준비되면 브라우저를 통해 로컬 환경(`http://localhost:3000` 또는 지정된 포트 URL)에 접근하여 화면을 확인할 수 있습니다.

## 📊 3. 데이터 모델 정의 (`db.json`)

`db.json` 내부 `books` 데이터 컬렉션의 세부 스펙 및 제약조건은 다음과 같습니다.

| 필드명             | 데이터 타입  | 데이터 형태 / 포맷         | 비고 및 설명                                           |
| --------------- | ------- | ------------------- | ------------------------------------------------- |
| `id`            | **int** | 정수형                 | **고유 식별자** (json-server v0.17.4 버전에 의해 자동 시퀀스 증가) |
| `title`         | **str** | 문자열                 | 도서 제목                                             |
| `author`        | **str** | 문자열                 | 도서 저자                                             |
| `content`       | **str** | 문자열 (Long Text)     | 도서 상세 소개 및 본문 내용                                  |
| `coverImageUrl` | **str** | **Base64 Data URL** | 도서 대표 표지 이미지 데이터 (`data:image/...;base64,` 포맷)    |
| `createdAt`     | **str** | **ISO 8601** 문자열    | 도서 데이터 생성 시각 포맷 (`YYYY-MM-DDTHH:mm:ss.sssZ`)      |
| `updatedAt`     | **str** | **ISO 8601** 문자열    | 도서 데이터 최종 수정 시각 (최초 생성 시 `createdAt`과 동일)         |

## 🔌 4. API 기능 명시 (API Specification)

도서 데이터 조작을 위해 제공되는 5가지 REST 엔드포인트 명세입니다. (Base URL: `http://localhost:3000`)

### 📝 1) API 요약 개요

|내용|유형 (메서드)|엔드포인트|성공 상태 코드|
|---|---|---|---|
|**책 리스트 조회**|`GET`|`/books`|`200 OK`|
|**책 단건 생성**|`POST`|`/books`|`201 Created`|
|**책 단건 조회**|`GET`|`/books/{id}`|`200 OK`|
|**책 단건 수정**|`PATCH`|`/books/{id}`|`200 OK`|
|**책 단건 삭제**|`DELETE`|`/books/{id}`|`200 OK / 204`|

### 🔍 2) 엔드포인트별 세부 요청/응답 예시

#### 1. 책 리스트 조회

- **Method / Path**: `GET /books`
    
- **설명**: 저장소 내 저장된 전체 도서 목록의 객체 배열을 받아옵니다.
    
- **응답 예시 (200 OK)**:
    

```json
[
  {
    "id": 1,
    "title": "클린 코드",
    "author": "로버트 C. 마틴",
    "content": "애자일 소프트웨어 장인 정신 기술 서적.",
    "coverImageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "createdAt": "2026-05-26T15:45:00.000Z",
    "updatedAt": "2026-05-26T15:45:00.000Z"
  }
]
```

#### 2. 책 단건 생성

- **Method / Path**: `POST /books`
    
- **설명**: 새로운 도서 정보를 추가합니다. 요청 시 `id` 필드는 비워두어야 하며, 가상 서버가 정수형 증가값을 자동으로 할당합니다.
    
- **요청 바디 (JSON)**:
    

```json
{
  "title": "리팩터링 2판",
  "author": "마틴 파울러",
  "content": "코드를 개선하는 객체지향 기술과 패턴.",
  "coverImageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "createdAt": "2026-05-26T15:50:00.000Z",
  "updatedAt": "2026-05-26T15:50:00.000Z"
}
```

- **응답 예시 (201 Created)**: `id: 2`가 자동 바인딩되어 온전한 객체로 반환됩니다.
    

#### 3. 책 단건 조회

- **Method / Path**: `GET /books/{id}`
    
- **설명**: URL 경로에 명시된 특정 정수형 고유 `id`에 해당하는 도서의 상세 데이터를 가져옵니다. (예: `/books/1`)
    
- **응답 예시 (200 OK)**: 단건 객체 리턴. 만약 없는 아이디일 경우 `404 Not Found` 혹은 빈 객체 `{}` 반환.
    

#### 4. 책 단건 수정

- **Method / Path**: `PATCH /books/{id}`
    
- **설명**: 기존 도서 레코드 중 변경하려는 필드만 선별적으로 부분 수정(Update)을 반영합니다. 이때 `updatedAt` 필드를 신규 수정 시점 시각으로 동기화해야 합니다.
    
- **요청 바디 (JSON)**:
    

```json
{
  "title": "클린 코드 (개정판)",
  "updatedAt": "2026-05-26T16:00:00.000Z"
}
```

#### 5. 책 단건 삭제

- **Method / Path**: `DELETE /books/{id}`
    
- **설명**: 해당 `id`를 가진 도서 데이터를 파일 저장소 내에서 영구 제거합니다.
    
- **응답 예시 (200 OK / 204 No Content)**: 삭제 작업 처리 완료 후 빈 오브젝트 혹은 무응답 상태가 유지됩니다.