import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Row, Col, Card, Button, Spin, Typography, Tag, Form, 
  DatePicker, InputNumber, Carousel, Rate, Image, Divider, Empty, 
  Result, Badge, Space, Breadcrumb, Avatar, Tooltip, message
} from 'antd';
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  HomeOutlined,
  CarOutlined, 
  TeamOutlined,
  InfoCircleOutlined,
  FullscreenOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { MdBed, MdBathtub, MdWifi, MdAcUnit, MdTv, MdKitchen, MdPool, MdFitnessCenter } from 'react-icons/md';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [form] = Form.useForm();
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/hotels/${id}`);
        
        if (response.data.success) {
          setHotel(response.data.data);
        } else {
          setError('Failed to fetch hotel details');
        }
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError('An error occurred while fetching hotel details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotel();
    }
  }, [id]);

  // Handle booking
  const handleBookNow = async (values) => {
    try {
      const { checkIn, checkOut, guests } = values;
      
      if (!checkIn || !checkOut) {
        message.warning('Please select check-in and check-out dates');
        return;
      }
      
      // Format dates for API
      const checkInFormatted = checkIn.format('YYYY-MM-DD');
      const checkOutFormatted = checkOut.format('YYYY-MM-DD');
      
      // Calculate total price
      const nights = checkOut.diff(checkIn, 'day');
      const totalPrice = nights * hotel.price;
      
      message.success('Booking details confirmed. Redirecting to payment...');
      
      // Navigate to booking page with data
      navigate(`/booking/${id}`, { 
        state: { 
          checkInDate: checkInFormatted, 
          checkOutDate: checkOutFormatted, 
          guests,
          nights,
          totalPrice,
          hotelName: hotel.name,
          hotelPrice: hotel.price,
          hotelImage: Array.isArray(hotel.images) && hotel.images.length > 0 ? hotel.images[0] : null
        } 
      });
    } catch (error) {
      message.error('Failed to process booking request');
      console.error('Booking error:', error);
    }
  };

  // Prepare images
  const getImages = () => {
    if (!hotel) return [];
    return Array.isArray(hotel.images) && hotel.images.length > 0 
      ? hotel.images 
      : (hotel.image ? [hotel.image] : []);
  };

  const images = getImages();

  const handleThumbnailClick = (index) => {
    setActiveImage(index);
    if (carouselRef.current) {
      carouselRef.current.goTo(index);
    }
  };

  const getAmenityIcon = (amenity) => {
    const iconProps = { size: 18 };
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <MdWifi {...iconProps} />;
      case 'air conditioning':
        return <MdAcUnit {...iconProps} />;
      case 'tv':
        return <MdTv {...iconProps} />;
      case 'kitchen':
        return <MdKitchen {...iconProps} />;
      case 'pool':
        return <MdPool {...iconProps} />;
      case 'gym':
        return <MdFitnessCenter {...iconProps} />;
      default:
        return <CheckCircleOutlined />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <Spin size="large" tip="Loading hotel details..." />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <Result
        status="error"
        title="Something went wrong"
        subTitle={error || "We couldn't find this hotel. It might have been removed or there was a connection error."}
        extra={
          <Button type="primary" onClick={() => navigate('/hotels')}>
            Back to Hotels
          </Button>
        }
      />
    );
  }

  return (
    <div className="bg-[#f0f7ff] pb-20  min-h-screen pt-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb and Header */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col span={24}>
            <Breadcrumb className="">
              <Breadcrumb.Item>
                <a onClick={() => navigate('/')}>
                  <HomeOutlined /> Home
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a onClick={() => navigate('/hotels')}>Hotels</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{hotel.name}</Breadcrumb.Item>
            </Breadcrumb>
            
            <Button 
              type="link" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
              className="mb-4 px-0 flex items-center"
            >
              Back to listings
            </Button>
            
            <Title level={2} className="mb-2">{hotel.name}</Title>
            <Space className="mb-4">
              <Tag icon={<EnvironmentOutlined />} color="blue">
                {hotel.location}
              </Tag>
              <Rate disabled defaultValue={hotel.rating || 4.5} allowHalf className="text-sm" />
              <Text type="secondary">{hotel.rating || 4.5} Rating</Text>
            </Space>
          </Col>
        </Row>

        {/* Image Gallery and Booking Section */}
        <Row gutter={[24, 24]}>
          <Col xs={24} xl={16}>
            <Card bordered={false} className="shadow-md rounded-lg overflow-hidden">
              <div className="relative">
                <Carousel
                  effect="fade"
                  autoplay
                  dots={true}
                  afterChange={(current) => setActiveImage(current)}
                  className="hotel-carousel"
                  ref={carouselRef}
                >
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <div key={index} className="h-[400px] rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${hotel.name} - View ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/800x400?text=No+Image+Available';
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="h-[400px] bg-gray-100 flex items-center justify-center">
                      <Empty description="No images available" />
                    </div>
                  )}
                </Carousel>
                
                {images.length > 0 && (
                  <Button
                    icon={<FullscreenOutlined />}
                    className="absolute right-4 top-4 bg-white/70 backdrop-blur-sm hover:bg-white"
                    shape="circle"
                    size="large"
                    onClick={() => setImagePreviewVisible(true)}
                  />
                )}
              </div>

              {/* Thumbnail Row */}
              {images.length > 1 && (
                <Row gutter={8} className="mt-4">
                  {images.slice(0, 5).map((img, index) => (
                    <Col span={4} key={index}>
                      <div 
                        className={`cursor-pointer rounded-md overflow-hidden h-16 border-2 ${
                          activeImage === index ? 'border-blue-500' : 'border-transparent'
                        }`}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100?text=Error';
                          }}
                        />
                      </div>
                    </Col>
                  ))}
                  {images.length > 5 && (
                    <Col span={4}>
                      <div 
                        className="cursor-pointer rounded-md overflow-hidden h-16 bg-black/70 flex items-center justify-center"
                        onClick={() => setImagePreviewVisible(true)}
                      >
                        <Text className="text-white">+{images.length - 5} more</Text>
                      </div>
                    </Col>
                  )}
                </Row>
              )}
            </Card>
            
            {/* Hotel Details Card */}
            <Card 
              bordered={false} 
              className="mt-6 shadow-md rounded-lg"
              title={<Title level={4}>Hotel Details</Title>}
            >
              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={12} sm={6}>
                  <Card className="text-center h-full bg-blue-50 border-0">
                    <div className="flex flex-col items-center">
                      <Avatar size={48} className="bg-blue-100 flex items-center justify-center mb-2">
                        <MdBed size={28} className="text-blue-600" />
                      </Avatar>
                      <Text strong>{hotel.bedrooms || 2} Bedrooms</Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className="text-center h-full bg-blue-50 border-0">
                    <div className="flex flex-col items-center">
                      <Avatar size={48} className="bg-blue-100 flex items-center justify-center mb-2">
                        <MdBathtub size={28} className="text-blue-600" />
                      </Avatar>
                      <Text strong>{hotel.bathrooms || 2} Bathrooms</Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className="text-center h-full bg-blue-50 border-0">
                    <div className="flex flex-col items-center">
                      <Avatar size={48} className="bg-blue-100 flex items-center justify-center mb-2">
                        <TeamOutlined style={{ fontSize: '24px' }} className="text-blue-600" />
                      </Avatar>
                      <Text strong>Up to {hotel.maxGuests || 6} Guests</Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className="text-center h-full bg-blue-50 border-0">
                    <div className="flex flex-col items-center">
                      <Avatar size={48} className="bg-blue-100 flex items-center justify-center mb-2">
                        <CarOutlined style={{ fontSize: '24px' }} className="text-blue-600" />
                      </Avatar>
                      <Text strong>{hotel.parking ? 'Parking Available' : 'No Parking'}</Text>
                    </div>
                  </Card>
                </Col>
              </Row>
              
              <Divider orientation="left">
                <Space>
                  <InfoCircleOutlined />
                  <span>Description</span>
                </Space>
              </Divider>
              
              <Paragraph className="text-gray-600">
                {hotel.description || 'No description available.'}
              </Paragraph>
              
              {/* Amenities Section */}
              <Divider orientation="left">
  <Space>
    <CheckCircleOutlined />
    <span>Amenities</span>
  </Space>
</Divider>

<Row gutter={[16, 16]} className="pb-2">
  {hotel.amenities && hotel.amenities.length > 0 ? (
    hotel.amenities.map((amenity) => (
      <Col key={amenity} xs={12} md={8} lg={6}>
        <div className="bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg p-3 h-full">
          <Space align="start">
            <div className="bg-white rounded-full p-2 shadow-sm text-blue-600">
              {getAmenityIcon(amenity)}
            </div>
            <Text className="text-gray-700 font-medium">
              {amenity}
            </Text>
          </Space>
        </div>
      </Col>
    ))
  ) : (
    ['WiFi', 'Air Conditioning', 'TV', 'Kitchen', 'Pool', 'Gym'].map((amenity) => (
      <Col key={amenity} xs={12} md={8} lg={6}>
        <div className="bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg p-3 h-full">
          <Space align="start">
            <div className="bg-white rounded-full p-2 shadow-sm text-blue-600">
              {getAmenityIcon(amenity)}
            </div>
            <Text className="text-gray-700 font-medium">
              {amenity}
            </Text>
          </Space>
        </div>
      </Col>
    ))
  )}
</Row>
            </Card>
          </Col>
          
          {/* Booking Card */}
          <Col xs={24} xl={8}>
            <div className="sticky space-y-2 top-24">
              <Badge.Ribbon 
                text={`$${hotel.price}/night`}
                color="blue"
              >
                <Card 
                  bordered={false} 
                  className="shadow-md rounded-lg"
                  title={
                    <div className="flex justify-between items-center">
                      <Title level={4} className="my-0">Book Your Stay</Title>
                    </div>
                  }
                >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleBookNow}
                  initialValues={{
                    guests: 2
                  }}
                >
                  <Form.Item
                    name="checkIn"
                    label="Check-in Date"
                    rules={[{ required: true, message: 'Please select check-in date!' }]}
                  >
                    <DatePicker 
                      className="w-full" 
                      format="YYYY-MM-DD"
                      placeholder="Select check-in date" 
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                      suffixIcon={<CalendarOutlined />}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="checkOut"
                    label="Check-out Date"
                    dependencies={['checkIn']}
                    rules={[
                      { required: true, message: 'Please select check-out date!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const checkIn = getFieldValue('checkIn');
                          if (!value || !checkIn || value.isAfter(checkIn)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Check-out must be after check-in!'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker 
                      className="w-full" 
                      format="YYYY-MM-DD" 
                      placeholder="Select check-out date"
                      disabledDate={(current) => {
                        const checkIn = form.getFieldValue('checkIn');
                        return (current && current < dayjs().startOf('day')) || 
                               (checkIn && current && current <= checkIn);
                      }}
                      suffixIcon={<CalendarOutlined />}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="guests"
                    label="Number of Guests"
                    rules={[{ required: true, message: 'Please select number of guests!' }]}
                  >
                    <InputNumber 
                      min={1} 
                      max={10} 
                      className="w-full"
                      addonBefore={<TeamOutlined />} 
                    />
                  </Form.Item>

                  {/* Price Calculator */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <Row justify="space-between" className="mb-1">
                      <Text>${hotel.price} x <span id="nights">0</span> nights</Text>
                      <Text strong>$<span id="subtotal">0</span></Text>
                    </Row>
                    <Row justify="space-between" className="mb-1">
                      <Text>Service fee</Text>
                      <Text>$<span id="serviceFee">0</span></Text>
                    </Row>
                    <Divider className="my-2" />
                    <Row justify="space-between">
                      <Text strong>Total</Text>
                      <Text strong className="text-lg">$<span id="total">0</span></Text>
                    </Row>
                  </div>
                  
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      block
                      size="large"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Book Now
                    </Button>
                  </Form.Item>
                </Form>
                
                <Text type="secondary" className="block text-center text-xs mt-2">
                  You won't be charged yet. Payment will be processed at checkout.
                </Text>
              </Card>
              </Badge.Ribbon>
              
              {/* Contact Host Card */}
              <Card bordered={false} className="shadow-md rounded-lg mt-4">
                <Space className="flex items-center">
                  <Avatar 
                    size={48} 
                    src={hotel.host?.image || "https://randomuser.me/api/portraits/men/32.jpg"}
                  />
                  <div>
                    <Text strong>{hotel.host?.name || "John Host"}</Text>
                    <div>
                      {hotel.host?.isSuperhost && (
                        <>
                          <Text type="secondary" className="text-sm">Superhost</Text>
                          <span className="mx-1">·</span>
                        </>
                      )}
                      <Text type="secondary" className="text-sm">
                        Response rate: {hotel.host?.responseRate || 99}%
                      </Text>
                    </div>
                  </div>
                </Space>
                <Button 
                  type="default" 
                  block 
                  className="mt-4"
                  onClick={() => {
                    if (hotel.host?.phone) {
                      window.location.href = `tel:${hotel.host.phone}`;
                      message.info(`Calling host at ${hotel.host.phone}`);
                    } else {
                      message.info('Contact information not available');
                    }
                  }}
                >
                  Contact Host
                </Button>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Image Gallery Preview */}
        {imagePreviewVisible && (
          <Image.PreviewGroup
            preview={{
              visible: imagePreviewVisible,
              onVisibleChange: (visible) => setImagePreviewVisible(visible),
              current: activeImage
            }}
          >
            {images.map((img, index) => (
              <Image key={index} src={img} style={{ display: 'none' }} />
            ))}
          </Image.PreviewGroup>
        )}
      </div>
      
      {/* Add custom CSS for Carousel dots */}
      <style jsx>{`
        .hotel-carousel .ant-carousel .slick-dots li button {
          background: #1890ff;
          opacity: 0.4;
        }
        .hotel-carousel .ant-carousel .slick-dots li.slick-active button {
          opacity: 1;
        }
        /* Make price calculator live with JavaScript */
        ${`
          document.addEventListener('DOMContentLoaded', function() {
            const form = document.querySelector('form');
            const checkInInput = form.querySelector('input[id$=_checkIn]');
            const checkOutInput = form.querySelector('input[id$=_checkOut]');
            
            const updatePriceCalculation = function() {
              try {
                const checkIn = dayjs(checkInInput.value);
                const checkOut = dayjs(checkOutInput.value);
                
                if (checkIn.isValid() && checkOut.isValid() && checkOut.isAfter(checkIn)) {
                  const nights = checkOut.diff(checkIn, 'day');
                  const pricePerNight = ${hotel.price};
                  const subtotal = nights * pricePerNight;
                  const serviceFee = Math.round(subtotal * 0.12);
                  const total = subtotal + serviceFee;
                  
                  document.getElementById('nights').textContent = nights;
                  document.getElementById('subtotal').textContent = subtotal;
                  document.getElementById('serviceFee').textContent = serviceFee;
                  document.getElementById('total').textContent = total;
                }
              } catch (e) {
                console.error('Error calculating price:', e);
              }
            };
            
            if (checkInInput && checkOutInput) {
              checkInInput.addEventListener('change', updatePriceCalculation);
              checkOutInput.addEventListener('change', updatePriceCalculation);
            }
          });
        `}
      `}</style>
    </div>
  );
};

export default HotelDetailsPage;