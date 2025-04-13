import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Statistic, Row, Col, Button, Table, Tag, Avatar } from 'antd';
import { FiUser, FiHome, FiActivity } from 'react-icons/fi';
import { fetchAdminData } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  const navigate = useNavigate()
  // Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminData();
        setAdminData(data);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-lg text-blue-400">Loading Admin Dashboard...</p>
      </div>
    );
  }

  // Columns for Recent Users table
  const userColumns = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="text-blue-400 font-medium">{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  // Columns for Recent Hotels table
  const hotelColumns = [
    {
      title: 'Hotel',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="flex items-center  space-x-3">
          {record.images && record.images.length > 0 ? (
            <Avatar  shape="square" size={48} src={record.images[0]} />
          ) : (
            <Avatar shape="square" size={48} icon={<FiHome />} />
          )}
          <span className="text-blue-500 ms-5 font-medium">{name}</span>
        </div>
      )
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <>₹{price}</>
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Tag color="blue" className="font-semibold">
          {rating}
        </Tag>
      )
    },
    {
      title: 'Added On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 bg-blue-50 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-8 text-black">Admin Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="shadow-md bg-white">
            <Statistic 
              title="Total Users" 
              value={adminData?.totalUsers || 0} 
              prefix={<FiUser className="text-black" />} 
              valueStyle={{ color: '#1d4ed8' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="shadow-md bg-white">
            <Statistic 
              title="Total Hotels" 
              value={adminData?.totalHotels || 0}
              prefix={<FiHome className="text-black " />} 
              valueStyle={{ color: '#1d4ed8' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="shadow-md bg-white">
            <Statistic 
              title="Active Sessions" 
              value={adminData?.activeSessions || 0} 
              prefix={<FiActivity className="text-black" />}
              valueStyle={{ color: '#1d4ed8' }}
            />
          </Card>
        </Col>
      </Row>

      <motion.div variants={itemVariants} className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Recent Users</h2>
        <Table 
          dataSource={adminData?.recentUsers || []}
          columns={userColumns}
          rowKey="_id"
          pagination={false}
          bordered
          className="bg-white shadow-md"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Recent Hotels</h2>
        <Table 
          dataSource={adminData?.recentHotels || []}
          columns={hotelColumns}
          rowKey="_id"
          pagination={false}
          bordered
          className="bg-white  shadow-md"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mt-10 flex gap-4">
        {/* <Button type="primary" onClick={()=>navigate("/admin/hotels")} className="bg-blue-600 hover:bg-blue-700 shadow-md">
          Add Hotel
        </Button> */}
        <Button type="primary" onClick={()=>navigate("/admin/hotels")} className="hover:bg-blue-100 shadow-md">
          Manage Hotels
        </Button>
        {/* <Button type="default" className="hover:bg-blue-100 shadow-md">
          Settings
        </Button> */}
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;