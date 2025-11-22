POST 
http://localhost:3000/api/jump
{
  "name": "Alice",
  "email": "alice@example.com",
  "metrics": {
    "force": {
      "avg": 750,
      "max": 1000,
      "min": 500
    },
    "flight_time": {
      "avg": 12,
      "max": 400,
      "min": 39
    },
    "jump_height": {
      "avg": 15,
      "max": 25,
      "min": 10
    },
    "net_impulse": {
      "avg": 300,
      "max": 450,
      "min": 200
    },
    "take_off_velocity": {
      "avg": 80,
      "max": 120,
      "min": 50
    }
  }
}
