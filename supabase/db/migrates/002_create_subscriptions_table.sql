create table
if not exists subscriptions
(
	id uuid primary key default gen_random_uuid
(),
	user_id uuid not null references auth.users
(id) on
delete cascade,
	lisk_id text
not null,
	plan text not null, -- e.g. 'starter', 'pro', 'business'
	status text not null default 'active', -- 'active', 'cancelled', 'expired'
	started_at timestamptz not null default now
(),
	expires_at timestamptz,
	created_at timestamptz not null default now
(),
	updated_at timestamptz not null default now
()
);

create index
if not exists idx_subscriptions_user_id on subscriptions
(user_id);
create index
if not exists idx_subscriptions_lisk_id on subscriptions
(lisk_id);
