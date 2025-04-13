import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Card, Row, Col, Typography, 
  Tag, Spin, Button, 
  Badge, Space
} from 'antd';
import { 
  EnvironmentOutlined, 
  StarOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// This is the homepage version of the HotelCard - simplified from the full one
const HomePageHotelCard = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch hotels from API - only get 4 for homepage
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/hotels?limit=4`);
        
        if (response.data.success) {
          setHotels(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching hotels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Handle navigation to hotel details page
  const handleHotelClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  return (
    <section className="bg-white px-4 md:px-10 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Featured Properties
          </div>
          
          <Title level={2} className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-blue-600">Most Popular</span> Accommodations
          </Title>
          
          <Paragraph className="text-gray-600 max-w-2xl mx-auto">
            Discover handpicked luxury accommodations with exceptional amenities and stunning views.
            Book your dream stay today!
          </Paragraph>
        </motion.div>

        {/* Hotel Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Row gutter={[24, 24]}>
              {hotels.map((hotel) => (
                <Col xs={24} sm={12} lg={6} key={hotel._id}>
                  <motion.div
                    variants={item}
                    className="h-full"
                  >
                    <Badge.Ribbon text={`$${hotel.price}/night`} color="blue">
                      <Card 
                        hoverable
                        className="overflow-hidden h-full"
                        cover={
                          <div className="relative overflow-hidden h-[200px]">
                            <img
                              src={Array.isArray(hotel.images) ? hotel.images[0] : hotel.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                              alt={hotel.name}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image';
                              }}
                            />
                            <div className="absolute top-2 right-2">
                              <Tag color="gold" className="flex items-center">
                                <StarOutlined className="mr-1" />
                                {hotel.rating || '4.5'}
                              </Tag>
                            </div>
                          </div>
                        }
                        onClick={() => handleHotelClick(hotel._id)}
                      >
                        <Title level={5} className="mb-1 line-clamp-1">{hotel.name}</Title>
                        
                        <Space className="mb-2">
                          <EnvironmentOutlined className="text-blue-500" />
                          <Text type="secondary" className="text-sm line-clamp-1">{hotel.location}</Text>
                        </Space>
                        
                        <Paragraph className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {hotel.description || 'Experience luxury and comfort at this beautiful property.'}
                        </Paragraph>
                        
                        <Button 
                          type="primary"
                          size="small"
                          className="bg-blue-600 hover:bg-blue-700 mt-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHotelClick(hotel._id);
                          }}
                        >
                          View Details
                        </Button>
                      </Card>
                    </Badge.Ribbon>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        )}

        {/* Show More Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/hotels')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Explore All Properties
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePageHotelCard;