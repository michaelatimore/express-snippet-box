create table if not exists users (
    id serial primary key,
    email text unique not null,
    first_name varchar(25) not null,
    last_name varchar(25) not null
);

create table if not exists snippets (
    snippet_id uuid default gen_random_uuid() primary key not null,
    title varchar(256) not null,
    content text not null,
    creation_date int default extract (epoch from now()) not null,
    expiration_date int default extract (epoch from now() + interval '1 month') not null,
    snippet_owner int not null,
    foreign key (snippet_owner) references users (id)
);




  