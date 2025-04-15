import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Modal, 
  Image, 
  Button, 
  Typography, 
  Tag,
  message,
  Spin
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
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const GallerySection = () => {
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);

  const navigate = useNavigate();
  
  // Fetch listings from the API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/listings`);
        // Take up to 8 listings for the gallery
        const fetchedListings = response.data.data.slice(0, 8);
        setListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        message.error('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleImageClick = (listing, index = 0) => {
    setSelectedListing(listing);
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
            <CameraOutlined className="mr-1" /> Featured Listings
          </div>
          
          <Title level={2} className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our <span className="text-blue-600">Featured Properties</span>
          </Title>
          
          <Text className="text-gray-600 max-w-2xl mx-auto block">
            Browse through our curated collection of listings across multiple categories.
            Find the perfect property that meets your needs.
          </Text>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {listings.map((listing, idx) => (
              <motion.div
                key={listing._id}
                variants={item}
                className="relative overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => handleImageClick(listing)}
              >
                <div className="overflow-hidden rounded-lg shadow-md">
                  <img
                    src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://via.placeholder.com/800x600?text=No+Image'}
                    alt={listing.name}
                    className="w-full h-[250px] object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/[0.4] bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white text-blue-600 w-10 h-10 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <CameraOutlined />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-medium truncate">{listing.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500 flex items-center">
                      <StarFilled className="mr-1" />
                      {listing.rating || "4.5"}
                    </span>
                    <span className="text-white/90 text-sm">${listing.price}</span>
                    {listing.category && <Tag className="ml-1" color="blue">{listing.category.name}</Tag>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {selectedListing && (
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
              <div className="relative min-h-[400px] bg-gray-100 rounded-lg">
                <Image
                  src={selectedListing.images && selectedListing.images.length > 0 
                    ? selectedListing.images[selectedImage] 
                    : 'https://via.placeholder.com/800x600?text=No+Image'}
                  alt={selectedListing.name}
                  className="rounded-lg"
                  style={{ 
                    width: '100%', 
                    height: '500px',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  preview={false}
                  placeholder={
                    <div className="flex items-center justify-center h-full w-full">
                      <Spin size="large" />
                    </div>
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                  }}
                />
                
                {/* Image navigation */}
                <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-4">
                  <Button 
                    shape="circle" 
                    icon={<LeftOutlined />} 
                    className="bg-white/80 hover:bg-white shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage((prev) => (prev > 0 ? prev - 1 : (selectedListing.images?.length > 0 ? selectedListing.images.length - 1 : 0)));
                    }}
                  />
                  <Button 
                    shape="circle" 
                    icon={<RightOutlined />} 
                    className="bg-white/80 hover:bg-white shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage((prev) => (prev < (selectedListing.images?.length - 1) ? prev + 1 : 0));
                    }}
                  />
                </div>
                
                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {selectedListing.images?.length || 1}
                </div>
              </div>
              
              {/* Thumbnail gallery */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {selectedListing.images && selectedListing.images.map((img, idx) => (
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
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
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
                  {selectedListing.name}
                </h2>
                <Button
                  shape="circle"
                  icon={<HeartOutlined />} 
                  className="text-red-500 border-red-200 hover:border-red-500"
                  onClick={() => message.success('Added to favorites!')}
                />
              </div>
              
              {/* Category and location */}
              <div className="mb-3">
                {selectedListing.category && 
                  <Tag color="blue" className="mr-2">{selectedListing.category.name}</Tag>
                }
              </div>
              
              {/* Location and rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <EnvironmentOutlined className="text-blue-500 mr-1" />
                  <Text>{selectedListing.location}</Text>
                </div>
                <div className="flex items-center">
                  <StarFilled className="text-yellow-400 mr-1" />
                  <Text>{selectedListing.rating || "4.5"} rating</Text>
                </div>
              </div>
              
              {/* Price information */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <Text strong className="text-lg">Price</Text>
                  <div>
                    <Text className="text-xl font-bold text-blue-600">
                      ${selectedListing.price}
                    </Text>
                    {selectedListing.category && selectedListing.category.name === "Hotels" && 
                      <Text className="text-gray-500"> / night</Text>
                    }
                  </div>
                </div>
                <Text type="secondary" className="block mt-1">
                  {selectedListing.attributes?.priceType || "Includes all taxes and fees"}
                </Text>
              </div>
              
              {/* Property description */}
              <div className="mb-6">
                <Title level={5} className="mb-3">About this listing</Title>
                <Paragraph className="text-gray-600">
                  {selectedListing.description}
                </Paragraph>
              </div>
              
              {/* Amenities */}
              <div className="mb-6">
                <Title level={5} className="mb-3">Amenities</Title>
                <div className="grid grid-cols-2 gap-y-3">
                  {selectedListing.amenities ? (
                    selectedListing.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircleOutlined className="text-blue-500 mr-2" />
                        <Text>{amenity}</Text>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center">
                        <CheckCircleOutlined className="text-blue-500 mr-2" />
                        <Text>WiFi</Text>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleOutlined className="text-blue-500 mr-2" />
                        <Text>Air conditioning</Text>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Attributes display */}
              {selectedListing.attributes && (
                <div className="mb-6">
                  <Title level={5} className="mb-2">Features</Title>
                  <div className="grid grid-cols-2 gap-y-3">
                    {selectedListing.attributes.bedrooms && (
                      <div className="flex items-center">
                        <CheckCircleOutlined className="text-blue-500 mr-2" />
                        <Text>{selectedListing.attributes.bedrooms} Bedrooms</Text>
                      </div>
                    )}
                    {selectedListing.attributes.bathrooms && (
                      <div className="flex items-center">
                        <CheckCircleOutlined className="text-blue-500 mr-2" />
                        <Text>{selectedListing.attributes.bathrooms} Bathrooms</Text>
                      </div>
                    )}
                    {selectedListing.attributes.size && (
                      <div className="flex items-center">
                        <CheckCircleOutlined className="text-blue-500 mr-2" />
                        <Text>{selectedListing.attributes.size} sq ft</Text>
                      </div>
                    )}
                    {selectedListing.attributes.parking !== undefined && (
                      <div className="flex items-center">
                        <CheckCircleOutlined className="text-blue-500 mr-2" />
                        <Text>{selectedListing.attributes.parking ? 'Parking Available' : 'No Parking'}</Text>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {selectedListing.tags && selectedListing.tags.length > 0 && (
                <div className="mb-6">
                  <Title level={5} className="mb-2">Tags</Title>
                  <div className="flex flex-wrap gap-2">
                    {selectedListing.tags.map((tag, idx) => (
                      <Tag key={idx} color="default">{tag}</Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  type="primary" 
                  size="large"
                  block
                  icon={<CalendarOutlined />}
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    message.success('Viewing listing details');
                    setVisible(false);
                    // Navigate to the listing details page
                    navigate(`/listings/${selectedListing._id}`)
                  }}
                >
                  View Details
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    icon={<PhoneOutlined />}
                    size="large"
                    onClick={() => {
                      // Use owner's phone if available
                      const phoneNumber = selectedListing.owner?.phone || "917435070468";
                      window.location.href = `tel:${phoneNumber}`;
                      message.info(`Calling owner at ${phoneNumber}`);
                    }}
                  >
                    Contact Owner
                  </Button>
                  <Button 
                    icon={<ShareAltOutlined />}
                    size="large"
                    onClick={() => {
                      const domain = window.location.origin;
                      const listingUrl = `${domain}/listings/${selectedListing._id}`;
                      const shareText = `Check out this amazing property: ${selectedListing.name}!`;
                      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + listingUrl)}`;
                      window.open(whatsappUrl, '_blank');
                      message.success('Opening WhatsApp to share this listing');
                    }}
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default GallerySection;