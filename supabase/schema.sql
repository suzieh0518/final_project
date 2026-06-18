-- 매출 데이터 테이블
create table if not exists sales_records (
  id bigint generated always as identity primary key,
  매입처 text not null,
  제조사 text not null,
  매출처 text not null,
  제품명 text not null,
  보험코드 text,
  기준가 numeric not null default 0,
  실매입단가 numeric not null default 0,
  실이익금액 numeric not null default 0,
  실이익율 numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Row Level Security 활성화
alter table sales_records enable row level security;

-- 읽기 허용 정책 (인증 없이 조회 가능 — 필요 시 수정)
create policy "Allow read access"
  on sales_records for select
  using (true);
