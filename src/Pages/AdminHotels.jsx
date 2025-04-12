import React, { useState } from 'react';

const AdminHotels = () => {
  const [hotel, setHotel] = useState({
    name: '',
    location: '',
    price: '',
    rating: '',
    description: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotel(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle hotel submission (connect to your API/backend)
    console.log('Hotel submitted:', hotel);
    // Clear form after submission
    setHotel({
      name: '',
      location: '',
      price: '',
      rating: '',
      description: '',
      image: ''
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin - Add New Hotel</h2>
      
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block mb-1">Hotel Name</label>
          <input
            type="text"
            name="name"
            value={hotel.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={hotel.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Price per Night ($)</label>
          <input
            type="number"
            name="price"
            value={hotel.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Rating (1-5)</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            step="0.1"
            value={hotel.rating}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={hotel.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={hotel.image}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Hotel
        </button>
      </form>
    </div>
  );
};

export default AdminHotels;