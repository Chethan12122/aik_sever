CREATE TABLE details (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    weight NUMERIC(5,2) NOT NULL,
    height NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT details_email_fkey FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);



CREATE TYPE weight_unit_enum AS ENUM ('kg', 'lb');
CREATE TYPE height_unit_enum AS ENUM ('cm', 'inch');

CREATE TABLE details (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    weight NUMERIC(5,2) NOT NULL,
    height NUMERIC(5,2) NOT NULL,
    primary_sport VARCHAR(100) NOT NULL,
    weight_unit weight_unit_enum NOT NULL,
    height_unit height_unit_enum NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT details_email_fkey FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);


CREATE TYPE weight_unit_enum AS ENUM ('kg', 'lb');
CREATE TYPE height_unit_enum AS ENUM ('cm', 'inch');

CREATE TABLE details (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('athlete', 'trainer')),
    name VARCHAR(100) ,
    gender VARCHAR(10) ,
    date_of_birth DATE ,
    weight NUMERIC(5,2) ,
    height NUMERIC(5,2) ,
    primary_sport VARCHAR(100),
    weight_unit weight_unit_enum NOT NULL DEFAULT 'kg',
    height_unit height_unit_enum NOT NULL DEFAULT 'cm',
    about_me VARCHAR,
    intrests VARCHAR,
    achievements VARCHAR,
    work VARCHAR,
    location VARCHAR,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT details_email_fkey FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);


to alter only required things to details table
 
CREATE TYPE weight_unit_enum AS ENUM ('kg', 'lb');
CREATE TYPE height_unit_enum AS ENUM ('cm', 'inch');

-- Step 2: Add new columns
ALTER TABLE details
ADD COLUMN primary_sport VARCHAR(100),
ADD COLUMN weight_unit weight_unit_enum NOT NULL DEFAULT 'kg',
ADD COLUMN height_unit height_unit_enum NOT NULL DEFAULT 'cm',
ADD COLUMN created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Optional: If you want to rename or modify any existing columns or constraints, you can do so too.


CREATE TABLE details (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('athlete', 'trainer')),
    name VARCHAR(100),
    gender VARCHAR(10),
    date_of_birth DATE,
    weight NUMERIC(5,2),
    height NUMERIC(5,2),
    about_me VARCHAR,
    intrests VARCHAR,
    achievements VARCHAR,
    work VARCHAR,
    location VARCHAR,
    primary_sport VARCHAR(100),
    CONSTRAINT unique_email UNIQUE (email),
    CONSTRAINT details_email_fkey FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);
