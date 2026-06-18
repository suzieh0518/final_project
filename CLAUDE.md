# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 빌드된 앱 실행
npm run lint     # ESLint 검사
npx tsc --noEmit # 타입 검사
```

## Architecture

의료기기 매출 데이터(65,604건)를 보여주는 대시보드. Next.js App Router + Railway PostgreSQL(`pg`) 스택.

### 데이터 흐름

```
app/page.tsx (Server Component)
  ├── lib/queries.ts  ← lib/db.ts (pg Pool)
  │     ├── getSalesRecords(filters)   → 페이지네이션된 레코드
  │     ├── getSummaryStats(filters)   → 총건수/총이익/평균이익율
  │     └── getDistinct매출처()        → 매출처 드롭다운용
  └── app/components/
        ├── StatsCards.tsx   (Server)  — 요약 카드 3개
        ├── Filters.tsx      (Client)  — 검색·필터 (useSearchParams/useRouter)
        ├── DataTable.tsx    (Server)  — 데이터 테이블
        └── Pagination.tsx   (Client)  — 페이지 이동 (useSearchParams/useRouter)
```

### 필터 동작 방식

모든 필터 상태는 URL searchParams로 관리(`search`, `매입처`, `매출처`, `page`). `Filters`와 `Pagination`은 `'use client'`이며 `useRouter().push()`로 URL을 변경 → 페이지가 서버에서 새로 렌더링됨. 두 컴포넌트 모두 `<Suspense>`로 감싸야 함(useSearchParams 요구사항).

`buildWhere()` 함수가 세 필터 조건에서 공통 WHERE 절을 생성해 `getSalesRecords`와 `getSummaryStats` 양쪽에 적용되므로 통계와 테이블 항상 동기화됨.

### DB

- `lib/db.ts` — `pg` Pool 싱글톤. 서버 전용(Server Component / Route Handler)
- `lib/queries.ts` — 모든 DB 쿼리 집중. 새 쿼리는 여기에 추가
- `db/schema.sql` — `sales_records` 테이블 DDL (Railway SQL 콘솔에서 실행)
- `types/index.ts` — `SalesRecord` DB row 타입

### Next.js 16 주요 변경사항

- **`searchParams`/`params`는 Promise** — `page.tsx`에서 반드시 `await searchParams`
- **Server Components가 기본** — 인터랙티브한 컴포넌트에만 `'use client'` 추가
- **Tailwind CSS v4** — `tailwind.config.js` 없음. `postcss.config.mjs`의 `@tailwindcss/postcss`로 동작. 커스텀 테마는 `globals.css`에서 CSS 변수로 정의

## 환경변수

`.env.local`에 필요:
```
DATABASE_URL=postgresql://user:password@host:port/database
```
- **로컬 개발**: Railway PostgreSQL의 Public URL (`thomas.proxy.rlwy.net:포트`)
- **배포 환경**: Railway 내부 URL (`postgres.railway.internal:5432`) — Railway Variables에서 자동 주입
