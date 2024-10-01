/*
ALL LOWERCASE KEYWORDS

create table if not exists users (
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
    title VARCHAR(256),
    content TEXT NOT NULL,
    creation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expiration_date TIMESTAMPTZ,
    snippet_owner INTEGER NOT NULL,
    FOREIGN KEY (snippet_owner) REFERENCES users (id)
);

/* Insert users*/
INSERT INTO users (email, first_name, last_name) /*user ids are auto increment so they don't have to be inserted*/
VALUES 
('john.doe@example.com', 'John', 'Doe'),
('jane.smith@example.com', 'Jane', 'Smith'),
('bob.johnson@example.com', 'Bob', 'Johnson');

/*Insert snippets*/

INSERT INTO snippets (content, title, expiration_date, snippet_owner) /*current_date will be set by default to the current date so it's not neccessary to explicitly insert it.*/
('Test Snippet 1', 'This is a test snippet.', '2025-01-01 00:00:00', 1),
('Test Snippet 2', 'Another test snippet.', '2025-02-01 00:00:00', 2),
('Test Snippet 3', 'A third test snippet.', '2025-03-01 00:00:00', 3);


/*
1. Is text the correct data type for the snippet content?
2. Should the content of the snippet be included in this table?
3. Are TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP NOT NULL and TIMESTAMPZ the correct data types for creation_date and expiration_date?
*/