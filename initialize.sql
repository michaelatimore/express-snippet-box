CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email text UNIQUE NOT NULL ,
    first_name varchar(25) NOT NULL,
    last_name varchar(25)
)

CREATE TABLE IF NOT EXISTS snippets (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    title varchar(256),
    creation_date CURRENT_TIMESTAMPZ NOT NULL,
    expiration_date TIMESTAMPZ,
    snippet_owner SERIAL NOT NULL,
    Foreign Key (snippet_owner) REFERENCES users (id) NOT NULL
)

/*
1. Do I need an expiration date or will our code handle that at the creation of the snippet?
2. Is text the correct data type for the snippet content?
3. Are CURRENT_TIMESTAMPZ and TIMESTAMPZ the correct data types for creation_date and expiration_date?
*/