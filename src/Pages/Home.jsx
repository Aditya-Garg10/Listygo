import { useState } from 'react';
import HotelCard from '../components/HotelCard';
import { motion } from 'framer-motion';

const hotelData = [
  {
    id: 1,
    name: "Grand Hotel",
    location: "New York",
    rating: 4.5,
    price: 199,
    image: "https://picsum.photos/400/300?random=1"
  },
  {
    id: 2,
    name: "Ocean View Resort",
    location: "Miami",
    rating: 4.8,
    price: 249,
    image: "https://picsum.photos/400/300?random=2"
  },
  // Add more hotels as needed
];

const Home = () => {
  const [hotels] = useState(hotelData);

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Featured Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;