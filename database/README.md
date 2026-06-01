# HIS Common Domain — Oracle DB

팀원은 **Oracle 11g XE(또는 호환 버전)** 를 각자 PC에 설치한 뒤, 아래 SQL만 실행하면 동일한 메뉴/권한 데이터를 씁니다.  
DB 덤프 파일(.dmp)은 공유하지 않습니다. **스크립트 = DB 배포물** 입니다.

## 필요 환경

- Oracle Listener + XE 서비스 실행
- SQL*Plus (`sqlplus` 명령 사용 가능)
- 계정 `hp` (없으면 DBA가 생성)

## 실행 순서 (최초 1회)

### 1) DBA — `hp` 사용자 준비 (SYSDBA)

```powershell
sqlplus "/ as sysdba" @database/oracle/prepare_hp_user.sql
```

> `hp` 사용자가 없으면 DBA가 `CREATE USER hp ...` 후 위 스크립트 실행.

### 2) 스키마 + 샘플 데이터 (hp 계정)

```powershell
cd <프론트엔드 프로젝트 루트>
sqlplus hp/본인비밀번호@localhost/XE @database/oracle/his_common_domain.sql
```

또는 **데이터만 다시 채우기**(테이블 유지, 메뉴/권한 리셋):

```powershell
sqlplus hp/본인비밀번호@localhost/XE @database/oracle/seed_common_domain_realistic.sql
```

### 3) 한글 메뉴명 수정 (이미 시드했다면 선택)

```powershell
sqlplus hp/본인비밀번호@localhost/XE @database/oracle/fix_menu_korean_unistr.sql
```

### 4) 검증 (선택)

```powershell
sqlplus hp/본인비밀번호@localhost/XE @database/oracle/verify_menu_korean_support.sql
```

## 스크립트 설명

| 파일 | 용도 |
|------|------|
| `prepare_hp_user.sql` | DBA용 — hp 권한·tablespace |
| `his_common_domain.sql` | 테이블/시퀀스 생성 + 기본 더미 |
| `seed_common_domain_realistic.sql` | **권장** — 진료·진료지원 포함 전체 시드 |
| `fix_menu_korean_unistr.sql` | 진료지원 하위 한글명 UNISTR 수정 |
| `verify_*.sql` | 데이터 확인용 |

## 백엔드 연결

[Hospital-backend](https://github.com/tldmsdl1341-ops/Hospital-backend)의 `application.yml` 또는 환경 변수:

| 변수 | 예시 |
|------|------|
| `DB_URL` | `jdbc:oracle:thin:@localhost:1521:XE` |
| `DB_USER` | `hp` |
| `DB_PASSWORD` | *(본인 로컬 비밀번호)* |

비밀번호는 **Git에 올리지 말 것**. 각자 `.env` / IntelliJ Run Configuration에만 설정.

## GitHub에 올릴 것 / 말 것

| 올림 | 올리지 않음 |
|------|-------------|
| `database/oracle/*.sql` | `.env.local`, 실제 비밀번호 |
| 이 README | Oracle 데이터파일, `target/`, `node_modules/` |
| `.env.example` (프론트) | |

## 테스트 계정 (시드 기준)

| USER_ID | 역할 | 비고 |
|---------|------|------|
| 1 | 관리자 | 사이드바 전체 메뉴 |
| 2 | 간호사 | 접수·환자·진료지원 |
| 3 | 의사 | 환자·진료 |
| 4 | 접수 | 접수 위주 |

프론트 기본값: `userId=1` (`HisAppShell`).
