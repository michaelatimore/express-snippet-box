create extension if not exists citext;

create table if not exists users (
    id serial primary key,
    email citext unique not null,
    first_name varchar(25) not null,
    last_name varchar(25) not null,
    password text not null,
    email_verified boolean not null default false
);

create table if not exists snippets(
    snippet_id uuid default gen_random_uuid() primary key not null,
    title varchar(255) not null,
    content text not null,
    creation_date int default extract (epochfrom now()) not null,
    expiration_date int not null,
    user_id int not null references users(id) on delete cascade
);

create table if not exists tokens (
    hash text primary key,
    user_id int not null references users(id) on delete cascade,
    expiry int not null,
    scope text not null
);