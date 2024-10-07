create table if not exists users ( id serial primary key, email text unique not null, first_name varchar(25) not null, last_name varchar(25) not null);


create table if not exists snippets
    ( snippet_id uuid default gen_random_uuid() primary key not null, title varchar(255) not null, content text not null, creation_date int default extract (epoch
                                                                                                                                                             from now()) not null, expiration_date int not null, user_id int not null references users(id) on delete cascade);

