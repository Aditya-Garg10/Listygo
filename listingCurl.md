
Here are CURL commands to test all the listing endpoints:
# Basic fetch of all listings
curl -X GET "http://localhost:3000/api/listings" \
  -H "Content-Type: application/json"

# With pagination
curl -X GET "http://localhost:3000/api/listings?page=1&limit=5" \
  -H "Content-Type: application/json"

# With filtering
curl -X GET "http://localhost:3000/api/listings?price[gte]=500&rating[gte]=4" \
  -H "Content-Type: application/json"

# With sorting (price ascending)
curl -X GET "http://localhost:3000/api/listings?sort=price" \
  -H "Content-Type: application/json"

# With field selection
curl -X GET "http://localhost:3000/api/listings?select=name,price,rating,location" \
  -H "Content-Type: application/json"

2. Get Listing by ID
curl -X GET "http://localhost:3000/api/listings/5f8d0d55b6e6a72d2010b1e7" \
  -H "Content-Type: application/json"

3. Get Listings by Category
curl -X GET "http://localhost:3000/api/listings/category/5f8d0c1ab6e6a72d2010b1e5" \
  -H "Content-Type: application/json"

4. Get Featured Listings
curl -X GET "http://localhost:3000/api/listings/featured" \
  -H "Content-Type: application/json"

5. Create New Listing
Example: Hotel Listing
curl -X POST "http://localhost:3000/api/listings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Grand Hotel & Spa",
    "category": "5f8d0c1ab6e6a72d2010b1e5",
    "location": "New York, NY",
    "price": 299,
    "rating": 4.8,
    "description": "Luxury hotel in the heart of Manhattan with spa facilities and excellent dining options.",
    "images": [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd"
    ],
    "amenities": ["WiFi", "Pool", "Spa", "Gym", "Restaurant"],
    "attributes": {
      "bedrooms": 1,
      "bathrooms": 1,
      "maxGuests": 2,
      "size": 450,
      "parking": true,
      "checkInTime": "15:00",
      "checkOutTime": "11:00"
    },
    "owner": {
      "name": "Hilton Group",
      "phone": "+12125551234",
      "email": "info@grandhotel.com"
    },
    "tags": ["Luxury", "City Center", "Business"]
  }'

Example: Gym Listing
curl -X POST "http://localhost:3000/api/listings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "FitZone Gym",
    "category": "5f8d0c1ab6e6a72d2010b1e6",
    "location": "Chicago, IL",
    "price": 49.99,
    "rating": 4.5,
    "description": "Modern fitness center with the latest equipment and professional trainers.",
    "images": [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c"
    ],
    "amenities": ["Showers", "Lockers", "Towel Service", "Sauna"],
    "attributes": {
      "equipmentCount": 75,
      "hasTrainers": true,
      "maxCapacity": 120,
      "hasShowers": true,
      "hasLockers": true
    },
    "hours": {
      "monday": {"open": "06:00", "close": "22:00"},
      "tuesday": {"open": "06:00", "close": "22:00"},
      "wednesday": {"open": "06:00", "close": "22:00"},
      "thursday": {"open": "06:00", "close": "22:00"},
      "friday": {"open": "06:00", "close": "22:00"},
      "saturday": {"open": "08:00", "close": "20:00"},
      "sunday": {"open": "08:00", "close": "18:00"}
    },
    "tags": ["Fitness", "Weights", "Personal Training"]
  }'

Example: Restaurant Listing
curl -X POST "http://localhost:3000/api/listings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Bella Italia",
    "category": "5f8d0c1ab6e6a72d2010b1e7",
    "location": "San Francisco, CA",
    "price": 35,
    "rating": 4.7,
    "description": "Authentic Italian cuisine using fresh, locally-sourced ingredients.",
    "images": [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de"
    ],
    "amenities": ["Outdoor Seating", "Full Bar", "Wheelchair Accessible", "Vegan Options"],
    "attributes": {
      "cuisine": ["Italian", "Mediterranean"],
      "seatingCapacity": 60,
      "hasOutdoorSeating": true,
      "servesAlcohol": true,
      "priceRange": "moderate",
      "reservationRequired": false
    },
    "hours": {
      "monday": {"open": "11:30", "close": "22:00"},
      "tuesday": {"open": "11:30", "close": "22:00"},
      "wednesday": {"open": "11:30", "close": "22:00"},
      "thursday": {"open": "11:30", "close": "22:30"},
      "friday": {"open": "11:30", "close": "23:00"},
      "saturday": {"open": "10:00", "close": "23:00"},
      "sunday": {"open": "10:00", "close": "21:30"}
    },
    "website": "www.bellaitalia-sf.com",
    "contactPhone": "+14155551234",
    "tags": ["Italian", "Pizza", "Pasta", "Wine Bar"]
  }'

6. Update Listing
curl -X PUT "http://localhost:3000/api/listings/5f8d0d55b6e6a72d2010b1e7" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "price": 329,
    "description": "Updated luxury hotel in the heart of Manhattan with newly renovated spa facilities and award-winning dining options.",
    "isFeatured": true,
    "attributes": {
      "bedrooms": 1,
      "bathrooms": 1,
      "maxGuests": 3,
      "size": 450,
      "parking": true
    },
    "amenities": ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Room Service"]
  }'

7. Delete Listing
curl -X DELETE "http://localhost:3000/api/listings/5f8d0d55b6e6a72d2010b1e7" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"