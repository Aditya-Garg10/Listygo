import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, Row, Col, Input, Select, Typography, 
  Tag, Rate, Empty, Spin, Skeleton, Button, 
  Badge, Space, Divider, Avatar,
  Alert
} from 'antd';
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  StarOutlined,
  HomeOutlined,
  DollarOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { MdBed, MdBathroom, MdCarRental } from 'react-icons/md';
import { FiMaximize2 } from 'react-icons/fi';
import { API_URL } from '../utils/constants';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const HotelCard = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const navigate = useNavigate();

  // Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/hotels`);
        
        if (response.data.success) {
          setHotels(response.data.data);
        } else {
          setError('Failed to fetch hotels');
        }
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('An error occurred while fetching hotels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Filter hotels based on search query and price filter
  const filteredHotels = hotels.filter(hotel => {
    // Search filter
    const nameMatch = hotel.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch = hotel.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || locationMatch || !searchQuery;
    
    // Price filter
    let matchesPrice = true;
    if (priceFilter === 'low' && hotel.price > 100) {
      matchesPrice = false;
    } else if (priceFilter === 'medium' && (hotel.price <= 100 || hotel.price > 300)) {
      matchesPrice = false;
    } else if (priceFilter === 'high' && hotel.price <= 300) {
      matchesPrice = false;
    }
    
    return matchesSearch && matchesPrice;
  });

  // Handle navigation to hotel details page
  const handleHotelClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  return (
    <div className="bg-[#f0f7ff] px-4 md:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <Row gutter={[16, 16]} align="middle" className="mb-8">
          <Col xs={24} md={16}>
            <Title level={2} className="mb-2">
              The very best of our <span className="text-blue-600">Selections</span>
            </Title>
            <Paragraph className="text-gray-600">
              Discover the most exceptional accommodations worldwide
            </Paragraph>
          </Col>
          <Col xs={24} md={8} className="text-right">
            <Button 
              type="link" 
              icon={<ArrowRightOutlined />} 
              onClick={() => navigate('/hotels')}
              className="text-blue-600 hover:text-blue-700"
            >
              See all listings
            </Button>
          </Col>
        </Row>

        {/* Search and Filter Bar */}
        <Card className="mb-6  shadow-sm">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <Input
                placeholder="Search by hotel name or location..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="large"
                className="rounded-md"
              />
            </Col>
            <Col xs={24} md={8}>
              <Space align="center" className="w-full">
                <Text strong>Price Range:</Text>
                <Select
                  value={priceFilter}
                  onChange={(value) => setPriceFilter(value)}
                  className="w-full"
                  size="large"
                >
                  <Option value="all">All Prices</Option>
                  <Option value="low">$0 - $100</Option>
                  <Option value="medium">$101 - $300</Option>
                  <Option value="high">$300+</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 mt-5">
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
            />
          </div>
        )}

        {/* Hotel Grid */}
        {loading ? (
          <Row className='mt-10' gutter={[24, 24]}>
            {[1, 2, 3, 4].map((item) => (
              <Col xs={24} lg={12} key={`skeleton-${item}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <Row gutter={16}>
                    <Col xs={24} sm={10}>
                      <Skeleton.Image className="w-full h-48" active />
                    </Col>
                    <Col xs={24} sm={14}>
                      <Skeleton active paragraph={{ rows: 4 }} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-16">
            <Empty
              description={
                <span className="text-gray-500">No hotels found matching your criteria</span>
              }
            >
              <Button 
                type="primary" 
                onClick={() => {
                  setSearchQuery('');
                  setPriceFilter('all');
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Clear filters
              </Button>
            </Empty>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredHotels.map((hotel) => (
              <Col xs={24} lg={12} key={hotel._id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className='mt-5'
                >
                  <Badge.Ribbon text={`$${hotel.price}/night`} color="blue">
                    <Card 
                      hoverable
                      className="overflow-hidden"
                      onClick={() => handleHotelClick(hotel._id)}
                    >
                      <Row gutter={16}>
                        <Col xs={24} sm={10} className="mb-4 sm:mb-0">
                          <div className="relative">
                            <img
                              src={Array.isArray(hotel.images) ? hotel.images[0] : hotel.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                              alt={hotel.name}
                              className="w-full h-48 object-cover rounded-lg"
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
                        </Col>
                        
                        <Col xs={24} sm={14}>
                          <Title level={4} className="mb-1">{hotel.name}</Title>
                          
                          <Space className="mb-4">
                            <EnvironmentOutlined className="text-blue-500" />
                            <Text type="secondary">{hotel.location}</Text>
                          </Space>
                          
                          <Divider className="my-3" />
                          
                          <Row gutter={[16, 12]}>
  {hotel.bedrooms && (
    <Col span={12}>
      <Space>
        <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
          <MdBed />
        </Avatar>
        <Text className="text-gray-700">
          {hotel.bedrooms} Bed{hotel.bedrooms > 1 ? 's' : ''}
        </Text>
      </Space>
    </Col>
  )}
  
  {hotel.bathrooms && (
    <Col span={12}>
      <Space>
        <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
          <MdBathroom />
        </Avatar>
        <Text className="text-gray-700">
          {hotel.bathrooms} Bath{hotel.bathrooms > 1 ? 's' : ''}
        </Text>
      </Space>
    </Col>
  )}
  
  {hotel.size && (
    <Col span={12}>
      <Space>
        <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
          <FiMaximize2 />
        </Avatar>
        <Text className="text-gray-700">{hotel.size} sq ft</Text>
      </Space>
    </Col>
  )}
  
  {hotel.parking !== undefined && (
    <Col span={12}>
      <Space>
        <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
          <MdCarRental />
        </Avatar>
        <Text className="text-gray-700">
          {hotel.parking ? 'Parking Available' : 'No Parking'}
        </Text>
      </Space>
    </Col>
  )}
</Row>
                          
                          <Divider className="my-3" />
                          
                          <div className="flex justify-between items-center">
                            {hotel.addedBy && (
                              <Text type="secondary" className="text-sm">
                                Added by {typeof hotel.addedBy === 'object' ? hotel.addedBy.name : 'Admin'}
                              </Text>
                            )}
                            <Button 
                              type="primary" 
                              size="small"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleHotelClick(hotel._id);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Badge.Ribbon>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}

        {/* Show More Button - only shown when hotels exist and not filtered */}
        {/* {!loading && !error && filteredHotels.length > 0 && (
          <div className="mt-10 text-center">
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate('/hotels')}
              className="bg-blue-600 hover:bg-blue-700 px-8 h-12"
            >
              View All Hotels
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default HotelCard;