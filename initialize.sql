create table if not exists users (
    id serial primary key,
    email text unique not null,
    first_name varchar(25) not null,
    last_name varchar(25)
);

create table if not exists snippets (
    snippet_id serial primary key,
    content text not null,
    title varchar(256),
    creation_date timestamptz default current_timestamp not null,
    expiration_date timestamptz,
    snippet_owner integer not null,
    foreign key (snippet_owner) references users (id)
);


/*
1. Is text the correct data type for the snippet content?
2. Should the content of the snippet be included in this table?
3. Are TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP NOT NULL and TIMESTAMPZ the correct data types for creation_date and expiration_date?
*/