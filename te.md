{
    "id": 17,
    "name": "Abhishek Bhat 77",
    "email": "loginfreefire685@gmail.com",
    "created_at": "2025-10-14T04:35:58.368Z",
    "Velocity Summary": {
        "Distance":23.0,
      "Velocity Count": 2,
        "Velocity": {
        "min": 1333.55301483375,
        "avg": 407,
        "max": 20.312708625000003 
      },
      "Time": {
        "min": 1333.55301483375,
        "avg": 407,
        "max": 20.312708625000003 
      },
    },
      "Attempt 1": {
        "velocity": 21.16,
        "time": 1.23,
      }, 
      "Attempt 2": {
        "velocity":12.12
        "time": 1.213,
      }
    }
}


  CREATE TABLE agility_test (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    agility JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

 CREATE TABLE velocity_test (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    velocity JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
