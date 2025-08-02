create table
if not exists users
(
	id uuid primary key,
	firstName text,
	lastName text,
	email text not null unique,
	imageUrl text,
	enabledPay boolean,
	role text check
(role in
('ADMIN', 'MEMBER', 'CUSTOMER')) not null default 'CUSTOMER',
	publicKey text,
	paymentIdentifier text,
	businessId text,
	createdAt timestamptz not null default now
(),
	updatedAt timestamptz not null default now
(),
	apiKey text
);

-- If you already have a users table, run this as a migration:
alter table users add column
if not exists apiKey text;