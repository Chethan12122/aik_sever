How to test API 

1. Upload Image API (POST /api/upload)
Method: POST

URL: http://localhost:3000/api/upload

 
Add key: image

Type: File

Upload an image file

2. Create Feed (POST /api/feeds)
Method: POST

URL: http://localhost:3000/api/feeds

Body:

{
  "user_id": 123,
  "description": "My new feed post",
  "image_url": "https://yourblobstorageurl.com/container/image.jpg"
}


3. Get Feed By ID (GET /api/feeds/:id)

URL: http://localhost:3000/api/feeds/1
(Replace 1 with actual feed ID)

4. Get All Feeds For User with Pagination (GET /api/feeds/user/:user_id?page=1&limit=10)
Method: GET

URL: http://localhost:3000/api/feeds/user/123?page=1&limit=10
(Replace 123 with the actual user ID)

5. Update Feed (PUT /api/feeds/:id)
Method: PUT

URL: http://localhost:3000/api/feeds/1
(Replace 1 with feed ID to update)

Body:
{
  "description": "Updated feed description",
  "image_url": "https://newimageurl.com/image.jpg"
}

6. Delete Feed (DELETE /api/feeds/:id)
Method: DELETE

URL: http://localhost:3000/api/feeds/1
(Replace 1 with the feed ID)