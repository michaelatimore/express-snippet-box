create table if not exists users (
    id serial primary key,
    email text unique not null,
    first_name varchar(25) not null,
    last_name varchar(25)
);

create table if not exists snippets (
    snippet_id uuid default gen_random_uuid() primary key,
    title varchar(256),
    content text not null,
    creation_date timestamptz default now(),
    expiration_date timestamptz,
    snippet_owner integer,
    foreign key (snippet_owner) references users (id)

);

