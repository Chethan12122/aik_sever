***************************  Aikyam Server  ***************************

{
  "email": "user@example.com", 
  "duration": 45,   
  "image": "https://example.com/workout-image.jpg",   
  "title": "Full Body Strength Workout",  
  "description": "A comprehensive strength workout targeting all major muscle groups.",  
  "level": "Intermediate", 
  "video": "https://example.com/workout-video.mp4",  
  "steps": ["Warm up for 5 minutes", "Perform squats for 10 minutes", "Finish with stretching"],  
  "outcomes": ["Increased muscle strength", "Improved endurance"],  
  "category": "Strength"   
}



INSERT INTO details (
    email, role, name, gender, date_of_birth, weight, height, 
    interests, achievements, work, location
) 
VALUES (
    'bhatabhi@gmail.com', 'athlete', 'John Doe', 'Male', '1990-05-15', 
    75.5, 180.3, 
    '{"Running", "Swimming", "Cycling"}', 
    '{"Marathon Winner", "Ironman Finisher"}', 
    '{"Personal Trainer at XYZ Gym", "Freelance Fitness Coach"}', 
    'New York, USA'
);
