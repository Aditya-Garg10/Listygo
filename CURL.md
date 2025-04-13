CURL Commands for Testing

Here are CURL commands to test all the category endpoints:
1. Get All Categories
curl -X GET "http://localhost:3000/api/categories" \
  -H "Content-Type: application/json"

2. Get Category by ID
curl -X GET "http://localhost:3000/api/categories/60d21b4667d0d8992e610c85" \
  -H "Content-Type: application/json"

3. Create New Category
curl -X POST "http://localhost:3000/api/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Hotels",
    "description": "Places to stay overnight",
    "icon": "hotel"
  }'

curl -X POST "http://localhost:3000/api/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Gyms",
    "description": "Fitness centers and workout spaces",
    "icon": "dumbbell"
  }'

  curl -X POST "http://localhost:3000/api/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Restaurants",
    "description": "Places to eat and dine",
    "icon": "utensils"
  }'

4. Update Category
curl -X PUT "http://localhost:3000/api/categories/60d21b4667d0d8992e610c85" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "description": "Updated description for hotels",
    "icon": "building"
  }'
  
5. Delete Category
curl -X DELETE "http://localhost:3000/api/categories/60d21b4667d0d8992e610c85" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

