// large Scale
Users
-- Enable the extension for UUIDs (if you plan to use UUIDs for ids instead of SERIAL integers)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the users table with optimizations
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- Integer ID as the primary key (or UUID if needed)
    email VARCHAR(255) NOT NULL UNIQUE,  -- Email should be unique and indexed
    name VARCHAR(100),  -- User's name (could split into first_name and last_name)
    password VARCHAR(255) NOT NULL,  -- Store hashed password, never plain-text
    firebase_uid VARCHAR(255) UNIQUE,  -- Firebase UID should be unique (especially useful for Firebase authentication)
    
    -- Timestamps for tracking creation, updates, and verification times
    verified_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the user is verified
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the user is created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the user is last updated

    -- Email format validation constraint
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')  -- Ensures a valid email format
);

-- Indexes to improve query performance
CREATE INDEX idx_users_email ON users (email);  -- Index on email for fast lookup
CREATE INDEX idx_users_firebase_uid ON users (firebase_uid);  -- Index on firebase_uid for Firebase auth lookups
CREATE INDEX idx_users_verified_at ON users (verified_at);  -- Index on verified_at for queries on verification status
CREATE INDEX idx_users_created_at ON users (created_at);  -- Index on created_at for efficient querying of new users

-- Optional: Add a UUID for user id if you prefer UUIDs instead of SERIAL integers
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Enable UUID generation
-- ALTER TABLE users ADD COLUMN id UUID PRIMARY KEY DEFAULT uuid_generate_v4();  -- Use UUID as the primary key (if needed)

-- Partitioning for large-scale data management (based on created_at timestamp for monthly partitioning)
CREATE TABLE users_2023_01 PARTITION OF users FOR VALUES FROM ('2023-01-01') TO ('2023-02-01');
CREATE TABLE users_2023_02 PARTITION OF users FOR VALUES FROM ('2023-02-01') TO ('2023-03-01');
-- You can continue creating more partitions as per your data needs, e.g., by year or by month


CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    duration INT NOT NULL,
    image TEXT,
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL,
    video TEXT,
    steps TEXT[],
    outcomes TEXT[],
    category TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_email FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')) // Not Included



