-- Run once in a new Supabase project's SQL editor.
create table public.requests (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check (kind in ('report','consultation')),
 company text not null check (char_length(company) between 1 and 120),
 area text not null check (char_length(area) between 1 and 200),
 business text not null check (business in ('cafe','restaurant','retail','other')),
 date text not null default '',
 message text not null check (char_length(message) between 10 and 2000),
 status text not null default 'requested' check (status in ('requested','in_review','completed','cancelled')),
 created_at timestamptz not null default now()
);
alter table public.requests enable row level security;
create policy "Owners read requests" on public.requests for select to authenticated using ((select auth.uid())=user_id);
create policy "Owners submit new requests" on public.requests for insert to authenticated with check ((select auth.uid())=user_id and status='requested');
grant select,insert on public.requests to authenticated;
revoke update,delete on public.requests from authenticated;
create index requests_user_idx on public.requests(user_id,created_at desc);

create table public.orders (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 stripe_session_id text not null unique,
 request_id uuid not null references public.requests(id),
 service_id text not null check (service_id='custom-feasibility'),
 status text not null check (status='paid_test'),
 amount integer not null check (amount>0),
 currency text not null default 'myr' check (currency='myr'),
 created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "Owners read test orders" on public.orders for select to authenticated using ((select auth.uid())=user_id);
grant select on public.orders to authenticated;
revoke insert,update,delete on public.orders from anon,authenticated;
create index orders_user_idx on public.orders(user_id,created_at desc);
-- Orders are written ONLY by the signature-verified Stripe webhook with service-role access.
