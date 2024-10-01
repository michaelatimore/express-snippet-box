/*create table if not exists users (
    id serial primary key,
    email text unique not null,
    first_name varchar(25) not null,
    last_name varchar(25)
);

create table if not exists snippets (
    snippet_id serial primary key,
    title varchar(256),
    content text not null,
    creation_date timestamptz default current_timestamp not null,
    expiration_date timestamptz,
    snippet_owner integer not null,
    foreign key (snippet_owner) references users (id)
);*/

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25)
);

CREATE TABLE IF NOT EXISTS snippets (
    snippet_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    title VARCHAR(256),
    creation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expiration_date TIMESTAMPTZ,
    snippet_owner INTEGER NOT NULL,
    FOREIGN KEY (snippet_owner) REFERENCES users (id)
);

-- Insert some initial data
INSERT INTO users (email, first_name, last_name) 
VALUES ('john.doe@example.com', 'John', 'Doe');

INSERT INTO snippets (content, title, expiration_date, snippet_owner) 
VALUES ('This is a test snippet.', 'Test Snippet', '2025-01-01 00:00:00', 1);


/*
1. Is text the correct data type for the snippet content?
2. Should the content of the snippet be included in this table?
3. Are TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP NOT NULL and TIMESTAMPZ the correct data types for creation_date and expiration_date?
*/