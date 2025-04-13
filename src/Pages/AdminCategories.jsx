import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Table, Button, Form, Input, 
  Popconfirm, Space, Card, Tag,
  Switch, notification, Modal,
  Typography, Spin, Empty
} from 'antd';
import { 
  FiPlus, FiEdit, FiTrash2, FiCheck, 
  FiX, FiList, FiGrid, FiTag
} from 'react-icons/fi';

const { Title, Text } = Typography;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AdminCategories = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || !isAuthenticated || (userRole !== 'admin' && userRole !== 'super-admin')) {
      navigate('/admin/login');
    } else {
      fetchCategories();
    }
  }, [navigate]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to load categories. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/categories`,
        values,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      notification.success({
        message: 'Success',
        description: 'Category created successfully!',
      });
      
      setModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'Failed to create category. Please try again.',
      });
    }
  };

  const handleUpdateCategory = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/categories/${editingCategory._id}`,
        values,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      notification.success({
        message: 'Success',
        description: 'Category updated successfully!',
      });
      
      setModalVisible(false);
      setEditingCategory(null);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'Failed to update category. Please try again.',
      });
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/categories/${categoryId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      notification.success({
        message: 'Success',
        description: 'Category deleted successfully!',
      });
      
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'Failed to delete category. This category might have listings associated with it.',
      });
    }
  };

  const showEditModal = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      icon: category.icon,
      active: category.active
    });
    setModalVisible(true);
  };

  const showCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium text-blue-600">{text}</span>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      responsive: ['md'],
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      responsive: ['md'],
      render: (text) => (
        <span className="line-clamp-2">{text || 'No description'}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active) => (
        active ? 
          <Tag color="green">Active</Tag> : 
          <Tag color="red">Inactive</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<FiEdit />} 
            onClick={() => showEditModal(record)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="primary" 
              danger 
              size="small" 
              icon={<FiTrash2 />}
            >
              Delete
            </Button>
          </Popconfirm>
          <Button 
            size="small" 
            onClick={() => navigate(`/admin/listings?category=${record._id}`)}
          >
            View Listings
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ListyGo Admin</h1>
          <div className="flex items-center gap-4">
            <span>{localStorage.getItem('userName') || 'Admin'}</span>
            <button 
              className="px-3 py-1 bg-blue-700 hover:bg-blue-900 rounded"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userRole');
                navigate('/admin/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manage Categories</h2>
            <p className="text-gray-600">Create, update and delete categories for listings</p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded flex items-center gap-1 hover:bg-gray-300"
              onClick={() => navigate('/admin/dashboard')}
            >
              Dashboard
            </Button>
            <Button
              type="primary"
              icon={<FiPlus />}
              onClick={showCreateModal}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Category
            </Button>
          </div>
        </div>

        <Card className="shadow-md">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : categories.length > 0 ? (
            <Table
              dataSource={categories}
              columns={columns}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
              }}
            />
          ) : (
            <Empty
              description="No categories found"
              className="py-16"
            />
          )}
        </Card>
      </div>

      <Modal
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingCategory ? handleUpdateCategory : handleCreateCategory}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter a category name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <Form.Item
            name="icon"
            label="Icon Name"
            tooltip="Enter an icon name (e.g., 'hotel', 'gym', 'restaurant')"
          >
            <Input placeholder="e.g., hotel" />
          </Form.Item>
          
          <Form.Item
            name="active"
            label="Active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          
          <Form.Item className="flex justify-end">
            <Space>
              <Button 
                onClick={() => {
                  setModalVisible(false);
                  setEditingCategory(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;