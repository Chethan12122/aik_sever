name, email, {set1, {s1,s2,s3,s4,s5,s6, MaxPower, MinPower, TotalTime, F Index},} so here json fields are repeating everytime and here s1,..s6 values are folat values 

CREATE TABLE rast_test (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  sets JSONB NOT NULL 
);



FIXES ******************************

1) it is not repeatative
2) fetching should be faster



INSERT INTO rast_test (id, name, email, sets, created_at)
VALUES
  (3, 'Abhishek', 'AbhishekBhat@example.com', '[{"s1": 0.58, "s2": 0.3, "s3": 0.7, "s4": 0.2, "s5": 0.1, "s6": 0.6, "s7":1.2, "FIndex": 1.2, "MaxPower": 100.5, "MinPower": 50.2, "TotalTime": 120}]', '2025-09-03 09:32:24.392');




  3 | Abhi25 | Abhi15@example.com | 2025-09-29 17:15:04.751369+05:30 | {"Gate 1": {"speed": 750, "velocity": 1000}, "Gate 2": {"speed": 750, "velocity": 1000}}
  here update the table in order to store this data 
  CREATE TABLE Sprint_Test (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    gates JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);