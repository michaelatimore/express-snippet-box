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
1. Do I need an expiration date or will our code handle that at the creation of the snippet?
2. Is text the correct data type for the snippet content?
3. Should the content of the snippet be included in this table?
4. Are CURRENT_TIMESTAMPZ and TIMESTAMPZ the correct data types for creation_date and expiration_date?
5. snippet_id uuid DEFAULT gen_random_uuid() as a method to generate a unique ID for the snippet?
*/