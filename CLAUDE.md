# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 빌드된 앱 실행
npm run lint     # ESLint 검사
```

## Architecture

의료기기 매출 데이터(2025 복사본.xlsx)를 보여주는 대시보드. Next.js App Router + Supabase + Railway 스택.

**Supabase 클라이언트 두 가지:**
- `lib/supabase/client.ts` — 브라우저 전용 (`'use client'` 컴포넌트에서 사용)
- `lib/supabase/server.ts` — Server Component / Route Handler / Server Function에서 사용. `cookies()`가 async이므로 `await createClient()`로 호출

**타입:**
- `types/index.ts` — `SalesRecord` (DB row 형태), `Database` (Supabase 제네릭용)

**DB 스키마:** `supabase/schema.sql` — `sales_records` 테이블. 컬럼: 매입처, 제조사, 매출처, 제품명, 보험코드, 기준가, 실매입단가, 실이익금액, 실이익율.

## Next.js 16 주요 변경사항

- **`params`는 Promise** — `page.tsx`에서 `const { id } = await params`로 await 필요
- **Server Components가 기본** — 인터랙티브한 컴포넌트에만 `'use client'` 추가
- **Server Functions** — 데이터 변경은 `'use server'` 지시어 사용, `action` prop으로 form에 전달
- **Tailwind CSS v4** — `tailwind.config.js` 없음. `postcss.config.mjs`에서 `@tailwindcss/postcss` 플러그인으로 동작. 커스텀 테마는 `globals.css`에서 CSS 변수로 정의

## 환경변수

`.env.local`에 두 값이 필요 (`.env.example` 참고):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
