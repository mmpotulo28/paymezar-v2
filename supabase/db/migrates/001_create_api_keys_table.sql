create table
if not exists api_keys
(
	id uuid primary key default gen_random_uuid
(),
	user_id uuid not null references auth.users
(id) on
delete cascade,
	api_key text
not null unique,
	status text not null default 'active', -- e.g. 'active', 'revoked'
	lisk_id text, -- Lisk account id, nullable until created
	created_at timestamptz not null default now
(),
	updated_at timestamptz not null default now
);

create index
if not exists idx_api_keys_user_id on api_keys
(user_id);
