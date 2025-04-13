import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Statistic, Row, Col, Button, Table, Tag, Avatar, Select } from 'antd';
import { FiUser, FiHome, FiActivity, FiLayers, FiList, FiGrid , FiPlus  } from 'react-icons/fi';
import { fetchAdminData } from '../services/adminService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  
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

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin/login');
          return;
        }
        
        // Fetch categories
        await fetchCategories();
        
        // Fetch dashboard data
        const data = await fetchAdminData();
        setAdminData(data);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-blue-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  // Columns for Recent Users table
  const userColumns = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="text-blue-600 font-medium">{text}</span>
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

  // Columns for Recent Listings table
  const listingColumns = [
    {
      title: 'Listing',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          {record.images && record.images.length > 0 ? (
            <Avatar shape="square" size={48} src={record.images[0]} />
          ) : (
            <Avatar shape="square" size={48} icon={<FiHome />} />
          )}
          <span className="text-blue-600 ms-5 font-medium">{name}</span>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="green">{category.name}</Tag>
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Button 
            type="primary" 
            icon={<FiLayers />}
            onClick={() => navigate("/admin/categories")}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Manage Categories
          </Button>
          <Button 
            type="primary" 
            icon={<FiList />}
            onClick={() => navigate("/admin/listings")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Manage Listings
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="shadow-md bg-white hover:shadow-lg transition-shadow">
            <Statistic 
              title="Total Users" 
              value={adminData?.totalUsers || 0} 
              prefix={<FiUser className="text-blue-500 mr-2" />} 
              valueStyle={{ color: '#1d4ed8' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="shadow-md bg-white hover:shadow-lg transition-shadow">
            <Statistic 
              title="Total Listings" 
              value={adminData?.totalListings || 0}
              prefix={<FiHome className="text-blue-500 mr-2" />} 
              valueStyle={{ color: '#1d4ed8' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="shadow-md bg-white hover:shadow-lg transition-shadow">
            <Statistic 
              title="Categories" 
              value={categories?.length || 0} 
              prefix={<FiGrid className="text-blue-500 mr-2" />}
              valueStyle={{ color: '#1d4ed8' }}
            />
          </Card>
        </Col>
      </Row>

      <motion.div variants={itemVariants} className="mt-10">
        <Card 
          title={<h2 className="text-xl font-semibold text-gray-800">Categories</h2>}
          bordered={false}
          className="shadow-md bg-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <Card 
                key={category._id} 
                className="border border-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/listings?category=${category._id}`)}
              >
                <div className="flex flex-col items-center">
                  <Avatar size={48} className="bg-blue-100 text-blue-600 mb-2">
                    {category.icon ? category.icon.charAt(0).toUpperCase() : category.name.charAt(0)}
                  </Avatar>
                  <h3 className="font-medium text-gray-800">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </div>
              </Card>
            ))}
            <Card 
              className="border border-dashed border-blue-300 hover:border-blue-500 transition-colors"
              onClick={() => navigate('/admin/categories')}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                  <FiPlus size={24} />
                </div>
                <p className="text-blue-600 font-medium">Add Category</p>
              </div>
            </Card>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-10">
        <Card 
          title={<h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>}
          bordered={false}
          className="shadow-md bg-white"
          extra={<Button type="link" onClick={() => navigate('/admin/users')}>View All</Button>}
        >
          <Table 
            dataSource={adminData?.recentUsers || []}
            columns={userColumns}
            rowKey="_id"
            pagination={false}
            className="bg-white"
          />
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-10">
        <Card 
          title={<h2 className="text-xl font-semibold text-gray-800">Recent Listings</h2>}
          bordered={false}
          className="shadow-md bg-white"
          extra={<Button type="link" onClick={() => navigate('/admin/listings')}>View All</Button>}
        >
          <Table 
            dataSource={adminData?.recentListings || []}
            columns={listingColumns}
            rowKey="_id"
            pagination={false}
            className="bg-white"
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;