create table if not exists Users (
    id uuid not null default uuid_generate_v1() primary key,
    username varchar(30) not null,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    email varchar(50) not null,
    password bytea not null
);