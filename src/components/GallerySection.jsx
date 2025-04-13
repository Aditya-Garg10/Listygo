import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Modal, 
  Image, 
  Button, 
  Typography, 
  Tag,
  message
} from 'antd';
import { 
  CameraOutlined, 
  LeftOutlined, 
  RightOutlined, 
  HeartOutlined,
  StarFilled, 
  EnvironmentOutlined, 
  CheckCircleOutlined,
  CalendarOutlined,
  PhoneOutlined,
  ShareAltOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;


// Using better quality images with accommodation theme
const images = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551918120-9739cb430c6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
];

const GallerySection = () => {
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setVisible(true);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  };

  const imageDetails = [
    {
      heading: "Luxury Villa with Ocean View",
      description: "Enjoy breathtaking ocean views from this modern luxury villa. Features include infinity pool, 5 bedrooms, and a private beach access."
    },
    {
      heading: "Downtown High-Rise Apartment",
      description: "Located in the heart of the city, this sleek apartment offers panoramic skyline views, modern amenities, and easy access to dining and entertainment."
    },
    {
      heading: "Rustic Mountain Cabin",
      description: "Escape to this charming wooden cabin nestled in the mountains. Perfect for a cozy retreat with fireplace, hot tub, and hiking trails nearby."
    },
    {
      heading: "Beachfront Paradise",
      description: "Step directly onto white sandy beaches from this stunning beachfront property. Includes large patio, outdoor kitchen, and breathtaking sunset views."
    },
    {
      heading: "Boutique Hotel Suite",
      description: "Experience luxury in this elegantly designed hotel suite featuring high-end furnishings, spa bathroom, and 24-hour concierge service."
    },
    {
      heading: "Modern Countryside Retreat",
      description: "This architectural masterpiece blends seamlessly with nature, offering floor-to-ceiling windows, designer interiors, and expansive garden views."
    },
    {
      heading: "Penthouse Loft Apartment",
      description: "Urban living at its finest in this spacious penthouse. Features include industrial design elements, rooftop terrace, and state-of-the-art kitchen."
    },
    {
      heading: "Historic Converted Townhouse",
      description: "Restored with attention to detail, this historic property combines period features with modern comforts in a prime neighborhood location."
    }
  ];
  return (
    <section className="px-4 md:px-10 py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <CameraOutlined className="mr-1" /> Gallery
          </div>
          
          <Title level={2} className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our <span className="text-blue-600">Beautiful Properties</span>
          </Title>
          
          <Text className="text-gray-600 max-w-2xl mx-auto block">
            Browse through our curated collection of stunning properties around the world.
            Find inspiration for your next trip and discover unique places to stay.
          </Text>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="relative overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => handleImageClick(idx)}
            >
              <div className="overflow-hidden rounded-lg shadow-md">
                <img
                  src={src}
                  alt={`gallery-${idx}`}
                  className="w-full h-[250px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-black/[0.4] bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="bg-white text-blue-600 w-10 h-10 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <CameraOutlined />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Modal
  visible={visible}
  footer={null}
  onCancel={() => setVisible(false)}
  width={1200}
  centered
  className="gallery-modal"
>
  <div className="flex flex-col md:flex-row gap-6">
    {/* Left side - Image section */}
    <div className="w-full md:w-3/5">
      <div className="relative">
        <Image
          src={images[selectedImage]}
          alt={`${imageDetails[selectedImage].heading}`}
          className="rounded-lg"
          style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
          preview={false}
        />
        
        {/* Image navigation */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-4">
          <Button 
            shape="circle" 
            icon={<LeftOutlined />} 
            className="bg-white/80 hover:bg-white shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
            }}
          />
          <Button 
            shape="circle" 
            icon={<RightOutlined />} 
            className="bg-white/80 hover:bg-white shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
            }}
          />
        </div>
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {selectedImage + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnail gallery */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <div 
            key={idx}
            className={`cursor-pointer rounded-md overflow-hidden w-16 h-16 flex-shrink-0 border-2 ${
              selectedImage === idx ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => setSelectedImage(idx)}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
    
    {/* Right side - Property details */}
    <div className="w-full md:w-2/5">
      {/* Property title and save button */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-blue-600">
          {imageDetails[selectedImage].heading}
        </h2>
        <Button
          shape="circle"
          icon={<HeartOutlined />} 
          className="text-red-500 border-red-200 hover:border-red-500"
        />
      </div>
      
      {/* Location and rating */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center">
          <EnvironmentOutlined className="text-blue-500 mr-1" />
          <Text>Miami, Florida</Text>
        </div>
        <div className="flex items-center">
          <StarFilled className="text-yellow-400 mr-1" />
          <Text>4.9 (120 reviews)</Text>
        </div>
      </div>
      
      {/* Price information */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <Text strong className="text-lg">Price</Text>
          <div>
            <Text className="text-xl font-bold text-blue-600">
              ${Math.floor(Math.random() * 200) + 100}
            </Text>
            <Text className="text-gray-500"> / night</Text>
          </div>
        </div>
        <Text type="secondary" className="block mt-1">
          Includes all taxes and fees
        </Text>
      </div>
      
      {/* Property description */}
      <div className="mb-6">
        <Title level={5} className="mb-3">About this property</Title>
        <Paragraph className="text-gray-600">
          {imageDetails[selectedImage].description}
        </Paragraph>
        <Paragraph className="text-gray-600 mt-2">
          Located in a prime area with easy access to local attractions and amenities. This property offers the perfect balance of comfort, convenience, and luxury for your stay.
        </Paragraph>
        <Paragraph className="text-gray-600 mt-2">
          Recently renovated with modern furnishings and high-end finishes throughout. The perfect choice for both short getaways and extended stays.
        </Paragraph>
      </div>
      
      {/* Amenities */}
      <div className="mb-6">
        <Title level={5} className="mb-3">Top amenities</Title>
        <div className="grid grid-cols-2 gap-y-3">
          <div className="flex items-center">
            <CheckCircleOutlined className="text-blue-500 mr-2" />
            <Text>Free WiFi</Text>
          </div>
          <div className="flex items-center">
            <CheckCircleOutlined className="text-blue-500 mr-2" />
            <Text>Air conditioning</Text>
          </div>
          <div className="flex items-center">
            <CheckCircleOutlined className="text-blue-500 mr-2" />
            <Text>Swimming pool</Text>
          </div>
          <div className="flex items-center">
            <CheckCircleOutlined className="text-blue-500 mr-2" />
            <Text>Free parking</Text>
          </div>
          <div className="flex items-center">
            <CheckCircleOutlined className="text-blue-500 mr-2" />
            <Text>Kitchen</Text>
          </div>
          <div className="flex items-center">
            <CheckCircleOutlined className="text-blue-500 mr-2" />
            <Text>Washing machine</Text>
          </div>
        </div>
      </div>
      
      {/* Availability */}
      <div className="mb-6">
        <Title level={5} className="mb-2">Availability</Title>
        <div className="flex gap-2 mb-4">
          <Tag color="success">Available now</Tag>
          <Tag color="processing">Free cancellation</Tag>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <Button 
          type="primary" 
          size="large"
          block
          icon={<CalendarOutlined />}
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            message.success('Redirecting to booking page');
            setVisible(false);
          }}
        >
          Book Now
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            icon={<PhoneOutlined />}
            size="large"
          >
            Contact Host
          </Button>
          <Button 
            icon={<ShareAltOutlined />}
            size="large"
          >
            Share Property
          </Button>
        </div>
      </div>
    </div>
  </div>
</Modal>
    </section>
  );
};

export default GallerySection;