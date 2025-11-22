GET :- http://localhost:3000/api/teams

POST :- http://localhost:3000/api/teams
BODY :- {
        "img": "https://example.com/image.png",
        "team_name": "Awesome Team",
        "sport": "Soccer",
        "description": "A description about the team",
        "email": "bhatabhishek226@gmail.com",
        "trainers": ["abhishekabachan098@gmail.com", "pacab79956@iridales.com"],
        "athletes": ["pacab79956@iridales.com", "abhishekabachan098@gmail.com"]
        }

GET :- http://localhost:3000/api/teams/2

PUT :- http://localhost:3000/api/teams/7
BODY :- {
        "img": "https://example.com/image.png",
        "team_name": "Awesome Team",
        "sport": "Soccer",
        "description": "A description about the team",
        "email": "bhatabhishek226@gmail.com",
        "trainers": ["abhishekabachan098@gmail.com", "pacab79956@iridales.com"],
        "athletes": ["pacab79956@iridales.com", "abhishekabachan098@gmail.com"]
        }

POST :- http://localhost:3000/api/teams/by-email
BODY :-{
            "email": "bhatabhishek226@gmail.com"
       }