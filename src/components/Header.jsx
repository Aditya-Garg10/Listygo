import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Button, Input, Select, DatePicker, Card, Typography, Row, Col } from 'antd';
import { SearchOutlined, CalendarOutlined, TeamOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Header = () => {
  const navigate = useNavigate();
  
  const handleSearch = () => {
    navigate('/hotels');
  };

  return (
    <section className="relative h-[85vh] md:h-[80vh] overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover brightness-[0.65]"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-shot-of-a-city-on-a-cloudy-day-41376-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col items-center justify-center text-center px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white mb-8"
        >
          <h1 className="text-4xl text-black sm:text-5xl md:text-6xl font-bold mb-4">
            Find Your Perfect <span className="text-blue-400">Getaway</span>
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto opacity-90">
            Discover amazing places to stay around the world at exceptional prices
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-4xl"
        >
          <Card className="shadow-xl bg-white/95 backdrop-blur-md" bordered={false}>
            <form onSubmit={(e) => e.preventDefault()}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={24} lg={9}>
                  <div className="mb-0">
                    <Text strong className="block mb-2">Where to?</Text>
                    <Input 
                      size="large"
                      placeholder="Search destinations" 
                      prefix={<SearchOutlined className="text-gray-400" />}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12} lg={9}>
                  <div className="mb-0">
                    <Text strong className="block mb-2">When?</Text>
                    <RangePicker
                      size="large"
                      className="w-full"
                      placeholder={['Check-in', 'Check-out']}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12} lg={4}>
                  <div className="mb-0">
                    <Text strong className="block mb-2">Guests</Text>
                    <Select
                      size="large"
                      defaultValue="2"
                      className="w-full"
                    >
                      <Option value="1">1 Guest</Option>
                      <Option value="2">2 Guests</Option>
                      <Option value="3">3 Guests</Option>
                      <Option value="4">4 Guests</Option>
                      <Option value="5">5+ Guests</Option>
                    </Select>
                  </div>
                </Col>
                <Col xs={24} lg={2}>
                  <div className="mb-0 h-full flex items-end">
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={handleSearch}
                      className="w-full bg-blue-600 hover:bg-blue-700 mt-md-0 mt-0 sm:mt-7"
                    >
                      <SearchOutlined />
                    </Button>
                  </div>
                </Col>
              </Row>
            </form>
          </Card>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4 sm:gap-8"
        >
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <StarFilled className="text-yellow-400" />
              <span className="text-black font-medium">4.9/5 ratings</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <TeamOutlined className="text-white" />
              <span className="text-black font-medium">1M+ happy customers</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-white">
          <path d="M0,64L48,80C96,96,192,128,288,122.7C384,117,480,75,576,64C672,53,768,75,864,80C960,85,1056,75,1152,69.3C1248,64,1344,64,1392,64L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Header;