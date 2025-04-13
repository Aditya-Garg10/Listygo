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
    <section className="relative min-h-[100vh] md:min-h-[90vh] overflow-hidden">
    

      {/* Content */}
      <div className="relative z-10 md:mt-20 max-w-7xl mx-auto h-full flex flex-col items-center justify-center text-center px-4 md:px-8 py-16 md:py-0">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white mb-6 md:mb-8"
        >
          <h1 className="text-3xl text-black sm:text-5xl md:text-6xl font-bold mb-3 md:mb-4">
            Find Your Perfect <span className="text-blue-400">Getaway</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-500 font-normal max-w-2xl mx-auto opacity-90">
            Discover amazing places to stay around the world at exceptional prices
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full border border-gray-200/[0.5] rounded-2xl max-w-4xl"
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
                      inputReadOnly
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
                      className="w-full bg-blue-600 hover:bg-blue-700 mt-0 md:mt-7"
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
          className="hidden sm:flex  absolute bottom-16 sm:-bottom-40 left-1/2 transform -translate-x-1/2 gap-3 sm:gap-8 flex-wrap justify-center"
        >
          <div className="bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <StarFilled style={{color : "#51a2ff"}} className="text-blue-400" />
              <span className="text-black text-sm sm:text-base font-medium">4.9/5 ratings</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <TeamOutlined style={{color : "#51a2ff"}} />
              <span className="text-black text-sm sm:text-base font-medium">1M+ happy customers</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="fill-white w-full"
          preserveAspectRatio="none"
          style={{ display: 'block', height: '70px' }}
        >
          <path d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,320 L0,320 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Header;