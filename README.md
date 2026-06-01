# HIS Common Domain — Frontend

병원 공통 도메인(메뉴·권한·다국어) Next.js + Redux-Saga 프론트엔드.

## 연관 저장소

| 저장소 | 역할 |
|--------|------|
| **[Hospital](https://github.com/tldmsdl1341-ops/Hospital)** (이 repo) | UI + **Oracle SQL** (`database/oracle/`) |
| **[Hospital-backend](https://github.com/tldmsdl1341-ops/Hospital-backend)** | Spring Boot API (포트 9695) |

나중에 서비스가 커지면 백엔드만 repo 분리·배포하면 됩니다. 지금은 **프론트 + DB 스크립트 = 이 repo**, **API = 백엔드 repo** 구성입니다.

## 요구 사항

- Node.js 20+
- Java 17+ / Maven
- Oracle 11g XE

## 빠른 시작

### 1. Clone (두 repo)

```powershell
git clone https://github.com/tldmsdl1341-ops/Hospital.git
git clone https://github.com/tldmsdl1341-ops/Hospital-backend.git
```

### 2. DB (Hospital repo)

[database/README.md](./database/README.md)

```powershell
cd Hospital
sqlplus hp/비밀번호@localhost/XE @database/oracle/seed_common_domain_realistic.sql
sqlplus hp/비밀번호@localhost/XE @database/oracle/fix_menu_korean_unistr.sql
```

### 3. 백엔드

```powershell
cd Hospital-backend
mvn spring-boot:run
```

### 4. 프론트

```powershell
cd Hospital
copy .env.example .env.local
npm install
npm run dev
```

http://localhost:3002

## 환경 변수

| 변수 | 기본값 |
|------|--------|
| `NEXT_PUBLIC_COMMON_API_BASE_URL` | `http://localhost:9695` |

## 인증

로그인/토큰 없음. 메뉴는 `userId` 쿼리로만 조회 (기본 데모: `userId=1`).
