What is tstzrange?
In PostgreSQL, tstzrange is a range data type that stores a range of timestamps with time zones.

So instead of storing two separate timestamps (e.g., start_time and end_time), you can store them together in one column as a range. For example:

sql
Copy
Edit
'[2025-01-01 00:00:00+00, 2025-12-31 23:59:59+00)'::tstzrange
This value represents a time period from Jan 1, 2025 to Dec 31, 2025 (exclusive of the end).

🧠 Why use tstzrange?
It’s useful when you want to store and query periods of time easily and efficiently. In a users table, it could represent:

Account active period – e.g., a user has access only from date X to date Y.

Subscription validity – start and end of a paid subscription.

Temporary bans or suspensions – when they start and end.

🔍 Examples of using tstzrange:
Table Definition:
sql
Copy
Edit
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    ...
    valid_time tstzrange  -- A single field for the start and end of validity
);
Inserting a valid time range:
sql
Copy
Edit
INSERT INTO users (email, password, valid_time)
VALUES (
    'test@example.com',
    'hashedpassword',
    tstzrange('2025-01-01 00:00:00+00', '2025-12-31 23:59:59+00')
);
Querying users who are active right now:
sql
Copy
Edit
SELECT * FROM users
WHERE valid_time @> now();
This uses the @> operator, which means "contains" — so you're finding users where the current timestamp falls within the valid_time range.

