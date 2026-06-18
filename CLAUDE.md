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

의료기기 매출 데이터(65,604건)를 보여주는 대시보드. Next.js App Router + Railway PostgreSQL(`pg`) 스택. 다크 테마(slate-950 배경).

### 탭 구조

URL `?tab=overview` / `?tab=data` 로 두 탭을 구분. `app/page.tsx`가 단일 Server Component로 두 탭 모두 처리.

- **개요 탭** — 차트 4종 + Top10 목록 + 요약 카드 4개. 상단에 `YearSelector`로 연도 필터 가능.
- **데이터 탭** — 페이지네이션 테이블 + 필터 + 엑셀 업로드.

### 데이터 흐름

```
app/page.tsx (Server Component)
  ├── OverviewContent(연도?)
  │     ├── getOverviewData(연도?)  → 차트 데이터 6종 + globalStats(총매출/총이익/평균이익율/거래건수)
  │     ├── getDistinct연도()       → YearSelector 드롭다운용
  │     └── components/overview/   → Recharts 차트들 (모두 'use client')
  │
  └── DataContent(params)
        ├── getSalesRecords(filters)   → 페이지네이션된 레코드
        ├── getSummaryStats(filters)   → 요약 통계 3종 (total_sales 없음)
        ├── getDistinct매출처()        → 매출처 드롭다운용
        └── getDistinct연도()          → 연도 드롭다운용
```

### URL 파라미터

모든 상태는 URL searchParams로 관리. 서버가 매 요청마다 해당 상태로 렌더링.

| 파라미터 | 사용처 |
|---|---|
| `tab` | overview / data 탭 전환 |
| `연도` | 양쪽 탭 공유 — TabNav와 YearSelector가 보존하며 전달 |
| `search` | 제품명·보험코드 텍스트 검색 (data 탭) |
| `매입처` | ILIKE 검색 (data 탭) |
| `매출처` | 정확히 일치 (data 탭) |
| `page` | 페이지네이션 (data 탭) |

`TabNav`는 탭 전환 시 `연도` 파라미터를 보존한다. `Filters`, `Pagination`, `YearSelector`는 모두 `'use client'` + `useRouter().push()`로 URL 변경 → 서버 재렌더링. `Filters`와 `Pagination`은 `<Suspense>`로 감싸야 함(useSearchParams 요구사항).

### lib/queries.ts 핵심 함수

- `buildWhere(filters)` — `getSalesRecords`와 `getSummaryStats`가 공유하는 WHERE 절 빌더. 통계와 테이블이 항상 동기화됨.
- `getOverviewData(연도?)` — 개요 탭 전용. 연도 파라미터가 있으면 모든 서브쿼리에 `WHERE 연도 = $1` 추가. `globalStats`에는 `total_sales`(기준가 합계) 포함.
- `getSummaryStats(filters)` — 데이터 탭 전용. `total_sales` 없음.

### StatsCards

`total_sales` 필드 유무에 따라 카드 수가 자동으로 달라짐:
- `total_sales` 있음(개요 탭) → 4카드, `grid-cols-4`
- `total_sales` 없음(데이터 탭) → 3카드, `grid-cols-3`

### DB

- `lib/db.ts` — `pg` Pool 싱글톤. 서버 전용.
- `lib/queries.ts` — 모든 DB 쿼리 집중. 새 쿼리는 여기에 추가.
- `db/schema.sql` — `sales_records` 테이블 DDL (Railway SQL 콘솔에서 실행).
- `types/index.ts` — `SalesRecord` DB row 타입.

### Next.js 16 주의사항

- **`searchParams`는 Promise** — `page.tsx`에서 반드시 `await searchParams`
- **Server Components가 기본** — 인터랙티브 컴포넌트에만 `'use client'` 추가
- **Tailwind CSS v4** — `tailwind.config.js` 없음. `postcss.config.mjs`의 `@tailwindcss/postcss`로 동작. 커스텀 테마는 `globals.css`에서 CSS 변수로 정의.
- **Recharts는 반드시 `'use client'`** — SSR 불가.

## 환경변수

`.env.local`에 필요:
```
DATABASE_URL=postgresql://user:password@host:port/database
```
- **로컬 개발**: Railway PostgreSQL Public URL (`thomas.proxy.rlwy.net:포트`)
- **배포 환경**: Railway 내부 URL (`postgres.railway.internal:5432`) — Railway Variables에서 자동 주입
