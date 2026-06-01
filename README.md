# HIS Common Domain — Frontend

병원 공통 도메인(메뉴·권한·다국어) Next.js + Redux-Saga 프론트엔드.

## 요구 사항

- Node.js 20+
- Oracle 11g XE (또는 호환)
- **Hospital Backend** (`Hospital-backend` 로컬 프로젝트) — Spring Boot, 포트 9695. 백엔드는 별도 저장소로 올리거나 팀에 zip 공유.

## 빠른 시작

### 1. DB

[database/README.md](./database/README.md) 참고.

```powershell
sqlplus hp/비밀번호@localhost/XE @database/oracle/seed_common_domain_realistic.sql
```

### 2. 백엔드

포트 **9695** 에 Spring Boot 실행 (`Hospital-backend`).

### 3. 프론트

```powershell
copy .env.example .env.local
npm install
npm run dev
```

브라우저: http://localhost:3002 (기본 `userId=1` 관리자 메뉴)

## 구조

- `src/features/common/menu` — 메뉴 조회 Redux-Saga
- `src/components/layout` — Sidebar, AppShell, locale KO/EN
- `database/oracle` — DDL·시드 SQL (팀 공유용)

## 환경 변수

| 변수 | 기본값 |
|------|--------|
| `NEXT_PUBLIC_COMMON_API_BASE_URL` | `http://localhost:9695` |
