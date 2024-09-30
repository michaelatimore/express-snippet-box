CREATE TABLE IF NOT EXISTS users (
    id SERIAL,
    email text UNIQUE NOT NULL ,
    first_name varchar(25) NOT NULL,
    last_name varchar(25)
)

CREATE TABLE IF NOT EXISTS snippets (
    title varchar(256),
    creation_date CURRENT_TIMESTAMP NOT NULL,
    expiration_date TIMESTAMP,
    snippet_owner INT,
    Foreign Key (snippet_owner) REFERENCES users (id)
)