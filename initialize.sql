CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email text UNIQUE NOT NULL ,
    first_name varchar(25) NOT NULL,
    last_name varchar(25)
)

CREATE TABLE IF NOT EXISTS snippets (
    snippet_id SERIAL PRIMARY KEY,
    content text NOT NULL,
    title varchar(256),
    creation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL, /* RETURNS THE CURRENT DATE AND TIME AND SETS THAT VALUE ON A NEW ROW*/
    expiration_date TIMESTAMPTZ,
    snippet_owner INTEGER NOT NULL,
    Foreign Key (snippet_owner) REFERENCES users (id)
)

/*
1. Is text the correct data type for the snippet content?
2. Should the content of the snippet be included in this table?
3. Are TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP NOT NULL and TIMESTAMPZ the correct data types for creation_date and expiration_date?
*/