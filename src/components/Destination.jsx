import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Typography, Card, Rate, Badge, Tooltip, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CompassOutlined, StarOutlined, HomeOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Enhanced destinations with additional context and featured status
const destinations = [
  {
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Sun, sand and beaches',
    longDescription: 'Experience the perfect beach getaway with golden sands, clear waters, and vibrant nightlife.',
    rating: 4.8,
    properties: 254,
    featured: true,
    trending: true,
    tags: ['Beaches', 'Nightlife', 'Water Sports']
  },
  {
    name: 'Himachal Pradesh',
    image: 'https://plus.unsplash.com/premium_photo-1697729729075-3e56242aef49?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Majestic mountain views',
    longDescription: 'Discover breathtaking vistas, snow-capped peaks, and serene valleys in this mountain paradise.',
    rating: 4.9,
    properties: 187,
    featured: true,
    trending: false,
    tags: ['Mountains', 'Trekking', 'Adventure']
  },
  {
    name: 'Kerala',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2VyZWxhfGVufDB8fDB8fHww',
    description: 'God\'s own country',
    longDescription: 'Relax in the tranquil backwaters, lush greenery, and experience authentic Ayurvedic treatments.',
    rating: 4.7,
    properties: 213,
    featured: false,
    trending: true,
    tags: ['Backwaters', 'Ayurveda', 'Nature']
  },
  {
    name: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFqYXN0aGFufGVufDB8fDB8fHww',
    description: 'Land of kings and palaces',
    longDescription: 'Step back in time with majestic forts, ornate palaces, and the vibrant culture of royal India.',
    rating: 4.6,
    properties: 176,
    featured: false,
    trending: false,
    tags: ['Heritage', 'Culture', 'Desert']
  },
  {
    name: 'Uttarakhand',
    image: 'https://images.unsplash.com/photo-1716573260891-23ad993e8833?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Spiritual highlands',
    longDescription: 'Find peace and spirituality amidst the sacred rivers, ancient temples, and pristine forests.',
    rating: 4.8,
    properties: 143,
    featured: true,
    trending: false,
    tags: ['Spiritual', 'Rivers', 'Wildlife']
  },
];

const Destinations = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Toggle destination as favorite
  const toggleFavorite = (e, index) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      } 
    }
  };

  const titleAnimation = {
    hidden: { opacity: 0, y: -20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100,
        delay: 0.2 
      } 
    }
  };

  return (
    <section className="w-full py-20 px-4 md:px-10 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl pb-16 mx-auto">
        {/* Section Header with Enhanced Animations */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-sm">
              <CompassOutlined className="mr-2" /> Discover Amazing Places
            </div>
          </motion.div>

          <motion.div variants={titleAnimation}>
            <Title level={2} className="text-3xl md:text-5xl font-extrabold mb-5 relative inline-block">
              Explore The <span className="text-blue-600">Most Visited Places</span>
              <div className="absolute left-0 -bottom-2 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-300 rounded-full transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform"></div>
            </Title>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.4 } }
            }}
          >
            <Paragraph className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              Discover beautiful destinations across India with the best accommodations and experiences.
              Book your next adventure today!
            </Paragraph>

            <div className="flex gap-2 justify-center">
              <Badge count={destinations.filter(d => d.trending).length} color="blue" offset={[-5, 5]}>
                <Button type="primary" ghost className="border-blue-500 text-blue-600 hover:text-blue-700">
                  Trending Destinations
                </Button>
              </Badge>
              <Button type="default">Popular Experiences</Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Destinations Grid with Enhanced Interactions */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-8"
        >
          {destinations.map((dest, index) => (
            <motion.div
              key={index}
              variants={item}
              className="cursor-pointer group"
              onClick={() => navigate('/hotels')}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Badge.Ribbon 
                  text={dest.featured ? "Featured" : (dest.trending ? "Trending" : null)} 
                  color={dest.featured ? "blue" : "orange"}
                  style={{ display: !dest.featured && !dest.trending ? 'none' : 'block' }}
                >
                  <Card 
                    className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                    cover={
                      <div className="relative overflow-hidden h-[220px] md:h-[260px]">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
                        
                        {/* Destination details overlay */}
                        <div className="absolute text-white bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-bold text-xl block mb-1">{dest.name}</p>
                          <div className="flex items-center  justify-between">
                            <div className="flex items-center">
                              <StarOutlined className="text-yellow-400 mr-1" />
                              <p className="text-white text-sm">{dest.rating}</p>
                            </div>
                            <div className="flex items-center">
                              <HomeOutlined className="text-white mr-1" />
                              <p className="text-white text-sm">{dest.properties}</p>
                            </div>
                          </div>
                        </div>

                        {/* Favorite button */}
                        <button
                          className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300"
                          onClick={(e) => toggleFavorite(e, index)}
                        >
                          {favorites.includes(index) ? 
                            <HeartFilled className="text-red-500 text-lg" /> : 
                            <HeartOutlined className="text-gray-600 hover:text-red-500 text-lg" />
                          }
                        </button>
                      </div>
                    }
                    bodyStyle={{ padding: '16px' }}
                  >
                    <div className="px-1">
                      <Paragraph className="text-gray-700 font-medium mb-2 line-clamp-1">
                        {dest.description}
                      </Paragraph>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {dest.tags?.map((tag, i) => (
                          <Tooltip title={`Search ${tag}`} key={i}>
                            <span 
                              className="text-xs bg-blue-50 text-blue-600 rounded-full px-2 py-1 inline-block"
                            >
                              {tag}
                            </span>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Badge.Ribbon>
                
                {/* Info popup on hover */}
                {hoveredCard === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute mt-2 bg-white shadow-xl rounded-lg p-4  z-30 max-w-xs"
                    style={{ width: 'calc(100% - 10px)' }}
                  >
                    <div className="text-sm text-gray-700">{dest.longDescription}</div>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <Text type="secondary" className="text-xs">Available year-round</Text>
                      <Text className="text-blue-600 font-medium text-xs">
                        {dest.properties} Stays
                      </Text>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-12"
        >
          {/* <Button 
            type="primary" 
            size="large"
            className="bg-blue-600 z-0  hover:bg-blue-700 px-8"
            onClick={() => navigate('/hotels')}
          >
            View All Destinations
          </Button> */}
        </motion.div>
      </div>
    </section>
  );
};

export default Destinations;