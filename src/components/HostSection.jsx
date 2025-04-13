import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Correct usage
import { motion } from 'framer-motion';
import { Typography, Button, Card, Row, Col, Statistic } from 'antd';
import { DollarCircleOutlined, HomeOutlined, StarOutlined } from '@ant-design/icons';


const { Title, Paragraph } = Typography;

const HostSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-16 px-4 md:px-10 bg-gradient-to-r from-blue-50 to-white">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <div className="relative rounded-xl overflow-hidden flex flex-col md:flex-row">
            {/* Left Side - Content */}
            <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            // Adjusted padding, rounding for responsiveness
            className="w-full md:w-1/2 z-10 p-6 sm:p-8 md:p-12 bg-white shadow-lg rounded-t-lg md:rounded-l-lg md:rounded-r-none"
            >
            <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Become a Host
            </div>

            <Title level={2} className="mb-4 text-2xl sm:text-3xl">
              Share Your Space, <span className="text-blue-600">Earn Extra Income</span>
            </Title>

            <Paragraph className="text-gray-600 mb-6 sm:mb-8">
              Join thousands of hosts who are earning extra income by sharing their properties on ListyGo.
              Our simple platform makes it easy to list your space and welcome guests from around the world.
            </Paragraph>

            {/* Adjusted Col spans for responsiveness */}
            <Row gutter={[16, 16]} className="mb-6 sm:mb-8">
              <Col xs={24} sm={8}>
              <Card className="text-center bg-blue-50 border-0 h-full flex flex-col justify-center">
                <Statistic
                title="Average Income"
                value="$12,600"
                valueStyle={{ color: '#1890ff', fontSize: '1.25rem' }} // Adjusted font size slightly
                prefix={<DollarCircleOutlined style={{ fontSize: '1.25rem' }} />}
                />
                <div className="text-xs text-gray-500 mt-1">per year</div>
              </Card>
              </Col>
              <Col xs={24} sm={8}>
              <Card className="text-center bg-blue-50 border-0 h-full flex flex-col justify-center">
                <Statistic
                title="Host Rating"
                value="4.8"
                valueStyle={{ color: '#1890ff', fontSize: '1.25rem' }}
                prefix={<StarOutlined style={{ fontSize: '1.25rem' }} />}
                />
                <div className="text-xs text-gray-500 mt-1">average</div>
              </Card>
              </Col>
              <Col xs={24} sm={8}>
              <Card className="text-center bg-blue-50 border-0 h-full flex flex-col justify-center">
                <Statistic
                title="Properties"
                value="50K+"
                valueStyle={{ color: '#1890ff', fontSize: '1.25rem' }}
                prefix={<HomeOutlined style={{ fontSize: '1.25rem' }} />}
                />
                <div className="text-xs text-gray-500 mt-1">worldwide</div>
              </Card>
              </Col>
            </Row>

            <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate('/admin/login')} // Use the initialized navigate function
                        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" // Full width on small screens
                      >
                        Learn how to become a host
                      </Button>
            </motion.div>

            {/* Right Side - Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 h-[300px] md:h-[500px]"
          >
            <img
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
              alt="Try hosting"
              className="w-full h-full object-cover rounded-none md:rounded-r-lg shadow-lg"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HostSection;