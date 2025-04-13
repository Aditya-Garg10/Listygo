import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, Row, Col, Input, Select, Typography, 
  Tag, Rate, Empty, Spin, Button, 
  Badge, Space, Divider, Avatar, Drawer,
  Slider, Radio, Checkbox, Cascader, Alert
} from 'antd';
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  StarOutlined,
  DollarOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  TagOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { MdBed, MdBathroom, MdCarRental } from 'react-icons/md';
import { FiMaximize2 } from 'react-icons/fi';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [amenities, setAmenities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filtersDrawerVisible, setFiltersDrawerVisible] = useState(false);

  // Location data (hierarchical format)
  const [locations, setLocations] = useState([
    {
      value: 'US',
      label: 'United States',
      children: [
        {
          value: 'NY',
          label: 'New York',
          children: [
            {
              value: 'NYC',
              label: 'New York City',
              children: [
                { value: 'MAN', label: 'Manhattan' },
                { value: 'BRK', label: 'Brooklyn' },
                { value: 'BRX', label: 'Bronx' }
              ]
            },
            {
              value: 'BUF',
              label: 'Buffalo'
            }
          ]
        },
        {
          value: 'CA',
          label: 'California',
          children: [
            {
              value: 'LA',
              label: 'Los Angeles',
              children: [
                { value: 'HWD', label: 'Hollywood' },
                { value: 'DTLA', label: 'Downtown' }
              ]
            },
            {
              value: 'SF',
              label: 'San Francisco'
            }
          ]
        },
        {
          value: 'TX',
          label: 'Texas',
          children: [
            { value: 'HOU', label: 'Houston' },
            { value: 'AUS', label: 'Austin' },
            { value: 'DAL', label: 'Dallas' }
          ]
        }
      ]
    },
    {
      value: 'IN',
      label: 'India',
      children: [
        {
          value: 'MH',
          label: 'Maharashtra',
          children: [
            {
              value: 'MUM',
              label: 'Mumbai',
              children: [
                { value: 'BKC', label: 'Bandra Kurla Complex' },
                { value: 'CST', label: 'Chhatrapati Shivaji Terminus' }
              ]
            },
            {
              value: 'PUN',
              label: 'Pune'
            }
          ]
        },
        {
          value: 'DL',
          label: 'Delhi',
          children: [
            { value: 'NDL', label: 'New Delhi' },
            { value: 'ODL', label: 'Old Delhi' }
          ]
        }
      ]
    }
  ]);
  
  // Common amenities for filter
  const commonAmenities = [
    'WiFi', 'Pool', 'Gym', 'Parking',
    'Air Conditioning', 'Restaurant', 'Bar',
    'Spa', 'Room Service', 'Pet Friendly'
  ];

  // Fetch categories and listings
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      }
    };

    const fetchListings = async () => {
      setLoading(true);
      try {
        // Parse URL parameters
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const rating = searchParams.get('rating');
        const sort = searchParams.get('sort');
        const locationParam = searchParams.get('location');
        const amenitiesParam = searchParams.get('amenities');
        
        // Set filter states from URL params
        if (category) setSelectedCategory(category);
        if (search) setSearchQuery(search);
        if (minPrice && maxPrice) setPriceRange([Number(minPrice), Number(maxPrice)]);
        if (rating) setRatingFilter(Number(rating));
        if (sort) setSortBy(sort);
        if (locationParam) {
          try {
            const locationValues = locationParam.split(',').filter(Boolean);
            setSelectedLocation(locationValues || []);
          } catch (err) {
            console.error('Error parsing location parameter:', err);
            setSelectedLocation([]);
          }
        } else {
          setSelectedLocation([]);
        }
        if (amenitiesParam) {
          setAmenities(amenitiesParam.split(','));
        }
        
        // Build API query without location filter initially
        let queryParams = new URLSearchParams();
        
        // Apply all non-location filters
        if (category) queryParams.append('category', category);
        if (minPrice) queryParams.append('price[gte]', minPrice);
        if (maxPrice) queryParams.append('price[lte]', maxPrice);
        if (rating) queryParams.append('rating[gte]', rating);
        if (search) queryParams.append('search', search);
        if (amenitiesParam) queryParams.append('amenities', amenitiesParam);
        if (sort) {
          const [field, direction] = sort.split('_');
          queryParams.append('sort', direction === 'desc' ? `-${field}` : field);
        }
        
        // Fetch data from API without location filter
        console.log(`Fetching listings with params: ${queryParams.toString()}`);
        const response = await axios.get(`${API_URL}/listings?${queryParams.toString()}`);
        
        let filteredListings = response.data.data || [];
        
        // Apply location filter in client-side code
        if (locationParam && locationParam.trim()) {
          try {
            const locationCodes = locationParam.split(',').filter(Boolean);
            if (locationCodes.length > 0) {
              const locationLabels = getFullLocationPath(locationCodes);
              
              if (locationLabels && locationLabels.length > 0) {
                // Build a full location path string for comparison
                const fullLocationPath = locationLabels.join(', ');
                const specificLocation = locationLabels[locationLabels.length - 1]; // Most specific location
                
                console.log('Filtering by location path:', fullLocationPath);
                console.log('Filtering by specific location:', specificLocation);
                
                // Log state before filtering
                console.log('Before filtering - count:', filteredListings.length);
                
                // STRICT LOCATION FILTERING - FIX FOR "STILL VISIBLE" ISSUE
                filteredListings = filteredListings.filter(listing => {
                  if (!listing.location) return false;
                  
                  const locationLower = listing.location.toLowerCase();
                  const specificLocationLower = specificLocation.toLowerCase();
                  
                  // Check if the listing location contains the specific location term
                  const matches = locationLower.includes(specificLocationLower);
                  
                  // Debug output for each listing
                  console.log(`Checking "${listing.location}" against "${specificLocation}": ${matches ? 'MATCH' : 'NO MATCH'}`);
                  
                  return matches;
                });
                
                console.log('After filtering - count:', filteredListings.length);
                console.log('After filtering - locations:', filteredListings.map(l => l.location).join(', '));
              }
            }
          } catch (err) {
            console.error('Error applying location filter:', err);
          }
        }

        // Important: Make sure this line is outside the try-catch block
        setListings(filteredListings);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchListings();
  }, [searchParams]);

  // New helper function to get the full path of location names
 
const getFullLocationPath = (locationCodes) => {
  if (!locationCodes || !Array.isArray(locationCodes) || locationCodes.length === 0) 
    return [];
  
  try {
    // This will store our complete path of location labels
    let result = [];
    
    // Start with the top-level locations array
    let currentLocations = locations;
    
    // Process each location code to build the full path
    for (const code of locationCodes) {
      // Find the location object with this code
      const found = findLocationInArray(currentLocations, code);
      
      if (found) {
        // Add this location's label to our result
        result.push(found.label);
        
        // If this location has children, they become the scope for the next iteration
        if (found.children && Array.isArray(found.children)) {
          currentLocations = found.children;
        } else {
          // No more children, so we're done
          break;
        }
      } else {
        // If we can't find this code, stop here
        console.warn(`Location code not found: ${code}`);
        break;
      }
    }
    
    return result;
  } catch (err) {
    console.error('Error in getFullLocationPath:', err);
    return [];
  }
};

// Helper function to find a location object by its code
const findLocationInArray = (locationsArray, code) => {
  if (!locationsArray || !Array.isArray(locationsArray)) return null;
  
  for (const loc of locationsArray) {
    if (loc.value === code) {
      return loc;
    }
  }
  
  return null;
};
  // Update the existing getLocationDisplayString function
  const getLocationDisplayString = (locationCodes = []) => {
    if (!locationCodes || locationCodes.length === 0) return '';
    const path = getFullLocationPath(locationCodes);
    return path.join(', ');
  };

  // Apply filters and update URL
  // Update the applyFilters function to include amenities
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0]);
    if (priceRange[1] < 1000) params.set('maxPrice', priceRange[1]);
    
    if (ratingFilter > 0) params.set('rating', ratingFilter);
    if (sortBy) params.set('sort', sortBy);
    
    // Location filter - use the code path for URL params
    if (selectedLocation.length > 0) {
      params.set('location', selectedLocation.join(','));
    }
    
    // Amenities filter
    if (amenities.length > 0) {
      params.set('amenities', amenities.join(','));
    }
    
    setSearchParams(params);
    setFiltersDrawerVisible(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setRatingFilter(0);
    setSortBy('createdAt_desc');
    setAmenities([]);  // Ensure it's an empty array, not undefined
    setSelectedLocation([]);  // Ensure it's an empty array, not undefined
    setSearchParams({});
  };

  // Handle category change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  // Handle navigation to listing details
  const handleListingClick = (listingId) => {
    navigate(`/listings/${listingId}`);
  };

  // Render grid view item
  const renderGridItem = (listing) => (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className='mb-5'
    >
      <Badge.Ribbon text={`$${listing.price}`} color="blue">
        <Card 
          hoverable
          className="overflow-hidden"
          onClick={() => handleListingClick(listing._id)}
        >
          <div className="relative">
            <img
              src={Array.isArray(listing.images) && listing.images.length > 0 
                ? listing.images[0] 
                : 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={listing.name}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image';
              }}
            />
            <div className="absolute top-2 right-2">
              <Tag color="gold" className="flex items-center">
                <StarOutlined className="mr-1" />
                {listing.rating || '4.5'}
              </Tag>
            </div>
          </div>
          
          <div className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <Tag color="blue">{listing.category.name}</Tag>
              <Text type="secondary" className="text-sm">${listing.price}</Text>
            </div>
            
            <Title level={5} className="mb-1">{listing.name}</Title>
            
            <Space className="mb-3">
              <EnvironmentOutlined className="text-blue-500" />
              <Text type="secondary">{listing.location}</Text>
            </Space>
            
            <Divider className="my-3" />
            
            <Row gutter={[16, 12]}>
              {listing.attributes?.bedrooms && (
                <Col span={12}>
                  <Space>
                    <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
                      <MdBed />
                    </Avatar>
                    <Text className="text-gray-700">
                      {listing.attributes.bedrooms} Bed{listing.attributes.bedrooms > 1 ? 's' : ''}
                    </Text>
                  </Space>
                </Col>
              )}
              
              {listing.attributes?.bathrooms && (
                <Col span={12}>
                  <Space>
                    <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
                      <MdBathroom />
                    </Avatar>
                    <Text className="text-gray-700">
                      {listing.attributes.bathrooms} Bath{listing.attributes.bathrooms > 1 ? 's' : ''}
                    </Text>
                  </Space>
                </Col>
              )}
              
              {listing.attributes?.size && (
                <Col span={12}>
                  <Space>
                    <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
                      <FiMaximize2 />
                    </Avatar>
                    <Text className="text-gray-700">{listing.attributes.size} sq ft</Text>
                  </Space>
                </Col>
              )}
              
              {listing.attributes?.parking !== undefined && (
                <Col span={12}>
                  <Space>
                    <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
                      <MdCarRental />
                    </Avatar>
                    <Text className="text-gray-700">
                      {listing.attributes.parking ? 'Parking' : 'No Parking'}
                    </Text>
                  </Space>
                </Col>
              )}
            </Row>
          </div>
        </Card>
      </Badge.Ribbon>
    </motion.div>
  );

  // Render list view item
  const renderListItem = (listing) => (
    <Card 
      hoverable 
      className="mb-4"
      onClick={() => handleListingClick(listing._id)}
    >
      <Row gutter={16}>
        <Col xs={24} sm={8} md={6} className="mb-4 sm:mb-0">
          <div className="relative">
            <img
              src={Array.isArray(listing.images) && listing.images.length > 0 
                ? listing.images[0] 
                : 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={listing.name}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image';
              }}
            />
            <div className="absolute top-2 right-2">
              <Tag color="gold" className="flex items-center">
                <StarOutlined className="mr-1" />
                {listing.rating || '4.5'}
              </Tag>
            </div>
            <div className="absolute bottom-2 left-2">
              <Tag color="blue">{listing.category.name}</Tag>
            </div>
          </div>
        </Col>
        
        <Col xs={24} sm={16} md={18}>
          <div className="flex justify-between items-start">
            <div>
              <Title level={4} className="mb-1">{listing.name}</Title>
              <Space className="mb-2">
                <EnvironmentOutlined className="text-blue-500" />
                <Text type="secondary">{listing.location}</Text>
              </Space>
            </div>
            <Text className="text-lg font-semibold text-blue-600">${listing.price}</Text>
          </div>
          
          <Paragraph className="text-gray-600 line-clamp-2 mb-3">
            {listing.description}
          </Paragraph>
          
          <Divider className="my-3" />
          
          <Row gutter={[16, 12]}>
            {listing.attributes?.bedrooms && (
              <Col xs={12} md={6}>
                <Space>
                  <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
                    <MdBed />
                  </Avatar>
                  <Text className="text-gray-700">
                    {listing.attributes.bedrooms} Bed{listing.attributes.bedrooms > 1 ? 's' : ''}
                  </Text>
                </Space>
              </Col>
            )}
            
            {listing.attributes?.bathrooms && (
              <Col xs={12} md={6}>
                <Space>
                  <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
                    <MdBathroom />
                  </Avatar>
                  <Text className="text-gray-700">
                    {listing.attributes.bathrooms} Bath{listing.attributes.bathrooms > 1 ? 's' : ''}
                  </Text>
                </Space>
              </Col>
            )}
            
            {listing.attributes?.size && (
              <Col xs={12} md={6}>
                <Space>
                  <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FiMaximize2 />
                  </Avatar>
                  <Text className="text-gray-700">{listing.attributes.size} sq ft</Text>
                </Space>
              </Col>
            )}
            
            {listing.attributes?.parking !== undefined && (
              <Col xs={12} md={6}>
                <Space>
                  <Avatar size="small" className="bg-blue-100 text-blue-700 flex items-center justify-center">
                    <MdCarRental />
                  </Avatar>
                  <Text className="text-gray-700">
                    {listing.attributes.parking ? 'Parking' : 'No Parking'}
                  </Text>
                </Space>
              </Col>
            )}
          </Row>
          
          <div className="mt-4">
            {listing.amenities && listing.amenities.slice(0, 3).map((amenity, i) => (
              <Tag key={i} className="mr-1 mb-1">{amenity}</Tag>
            ))}
            
            {listing.amenities && listing.amenities.length > 3 && (
              <Tag>+{listing.amenities.length - 3} more</Tag>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );

  // Display summary of active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (searchQuery) count++;
    if (priceRange && (priceRange[0] > 0 || priceRange[1] < 1000)) count++;
    if (ratingFilter > 0) count++;
    if (selectedLocation && selectedLocation.length > 0) count++;
    if (amenities && amenities.length > 0) count++;
    return count;
  }, [selectedCategory, searchQuery, priceRange, ratingFilter, selectedLocation, amenities]);

  try {
    return (
      <div className="bg-[#f0f7ff] min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Row gutter={[16, 16]} align="middle" className="mb-8">
            <Col xs={24} md={16}>
              <Title level={2} className="mb-2">
                Find the perfect <span className="text-blue-600">listing</span> for you
              </Title>
              <Paragraph className="text-gray-600">
                Explore our diverse collection of listings across multiple categories
              </Paragraph>
            </Col>
          </Row>

          {/* Main Search and Category Filter */}
          <Card className="mb-6 shadow-sm">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={8}>
                <Input
                  placeholder="Search listings..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="large"
                  className="rounded-md"
                  onPressEnter={applyFilters}
                />
              </Col>
              <Col xs={24} md={8}>
                <Select
                  placeholder="Select Category"
                  value={selectedCategory || undefined}
                  onChange={handleCategoryChange}
                  className="w-full"
                  size="large"
                  allowClear
                >
                  {categories.map(category => (
                    <Option key={category._id} value={category._id}>{category.name}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={8}>
                <Cascader
                  placeholder="Select Location"
                  options={locations}
                  value={selectedLocation || []}
                  onChange={(value) => {
                    console.log('Selected location:', value);
                    setSelectedLocation(Array.isArray(value) ? value : []);
                  }}
                  size="large"
                  className="w-full"
                  expandTrigger="hover"
                  maxTagCount={2}
                  showSearch={{
                    filter: (inputValue, path) => {
                      return path.some(option => 
                        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                      );
                    }
                  }}
                  displayRender={(labels) => labels.join(' > ')}
                  changeOnSelect
                />
              </Col>
            </Row>
            
            <Divider className="my-4" />
            
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={16}>
                <Space wrap>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-40"
                    size="middle"
                  >
                    <Option value="createdAt_desc">Newest First</Option>
                    <Option value="price_asc">Price: Low to High</Option>
                    <Option value="price_desc">Price: High to Low</Option>
                    <Option value="rating_desc">Highest Rated</Option>
                    <Option value="name_asc">Name A-Z</Option>
                  </Select>
                  
                  <Button 
                    icon={<FilterOutlined />}
                    onClick={() => setFiltersDrawerVisible(true)}
                    size="middle"
                  >
                    More Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </Button>
                  
                  {activeFiltersCount > 0 && (
                    <Button 
                      icon={<ReloadOutlined />}
                      onClick={resetFilters}
                      size="middle"
                    >
                      Reset
                    </Button>
                  )}
                </Space>
              </Col>
              <Col xs={24} md={8} className="flex justify-end">
                <Space>
                  <Text className="mr-2">View:</Text>
                  <Radio.Group 
                    value={viewMode} 
                    onChange={(e) => setViewMode(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="grid"><AppstoreOutlined /></Radio.Button>
                    <Radio.Button value="list"><BarsOutlined /></Radio.Button>
                  </Radio.Group>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Location display if selected */}
         
{Array.isArray(selectedLocation) && selectedLocation.length > 0 && (
  <div className="mb-4 mt-3 ms-2">
    <Tag icon={<EnvironmentOutlined />} color="blue" className="text-md px-3 py-1">
      Location: {getLocationDisplayString(selectedLocation)}
    </Tag>
    <Button 
      type="text" 
      size="small"
      className="ml-2 text-blue-500 hover:text-blue-700"
      onClick={() => {
        setSelectedLocation([]);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('location');
        setSearchParams(newParams);
      }}
    >
      Clear location
    </Button>
  </div>
)}

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

          {/* Results summary - FIXED VERSION */}
          <div className="mb-4">
            <Text className="text-gray-500">
              {loading ? 'Searching...' : `Found ${listings.length} listings`}
              {listings.length > 0 && selectedCategory && categories.find(c => c._id === selectedCategory) && 
                ` in ${categories.find(c => c._id === selectedCategory).name}`}
              {listings.length > 0 && searchQuery && ` matching "${searchQuery}"`}
              {listings.length > 0 && selectedLocation && selectedLocation.length > 0 && 
                ` in ${getLocationDisplayString(selectedLocation)}`}
              {listings.length === 0 && selectedLocation && selectedLocation.length > 0 && 
                ` - No listings found in "${getLocationDisplayString(selectedLocation)}"`}
            </Text>
            
            {/* Debug section - help identify what's happening */}
            <div className="text-xs text-gray-400 mt-1">
              Available locations: {listings.map(l => l.location).join(' | ')}
            </div>
          </div>

          {/* Listings Grid/List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" tip="Loading listings..." />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16">
              <Empty
                description={
                  <span className="text-gray-500">No listings found matching your criteria</span>
                }
              >
                <Button 
                  type="primary" 
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Clear filters
                </Button>
              </Empty>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {listings.map((listing) => (
                <React.Fragment key={listing._id}>
                  {viewMode === 'grid' 
                    ? renderGridItem(listing)
                    : renderListItem(listing)
                  }
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Filters Drawer */}
        <Drawer
          title="Filter Listings"
          placement="right"
          onClose={() => setFiltersDrawerVisible(false)}
          visible={filtersDrawerVisible}
          width={320}
          footer={
            <div className="flex justify-between">
              <Button onClick={resetFilters}>Reset</Button>
              <Button type="primary" onClick={applyFilters} className="bg-blue-600">
                Apply Filters
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div>
              <Title level={5}>Price Range</Title>
              <Slider
                range
                min={0}
                max={1000}
                value={priceRange}
                onChange={setPriceRange}
                tipFormatter={value => `$${value}`}
              />
              <div className="flex justify-between text-gray-500 text-sm mt-1">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <div>
              <Title level={5}>Rating</Title>
              <Rate 
                allowHalf 
                value={ratingFilter} 
                onChange={setRatingFilter} 
              />
              <div className="text-gray-500 text-sm mt-1">
                {ratingFilter > 0 ? `${ratingFilter} stars & above` : 'Any rating'}
              </div>
            </div>

            <div>
              <Title level={5}>Location</Title>
              <Cascader
                placeholder="Select Location"
                options={locations}
                value={selectedLocation || []}
                onChange={(value) => {
                  console.log('Selected location:', value);
                  setSelectedLocation(Array.isArray(value) ? value : []);
                }}
                className="w-full"
                expandTrigger="hover"
                showSearch={{
                  filter: (inputValue, path) => {
                    return path.some(option => 
                      option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                    );
                  }
                }}
                displayRender={(labels) => labels.join(' > ')}
                changeOnSelect
              />
            </div>

            <div>
              <Title level={5}>Amenities</Title>
              <Checkbox.Group
                options={commonAmenities}
                value={amenities}
                onChange={setAmenities}
                className="flex flex-col space-y-2"
              />
            </div>

            <div>
              <Title level={5}>Sort By</Title>
              <Radio.Group 
                onChange={(e) => setSortBy(e.target.value)} 
                value={sortBy}
                className="flex flex-col space-y-2"
              >
                <Radio value="createdAt_desc">Newest First</Radio>
                <Radio value="price_asc">Price: Low to High</Radio>
                <Radio value="price_desc">Price: High to Low</Radio>
                <Radio value="rating_desc">Highest Rated</Radio>
                <Radio value="name_asc">Name A-Z</Radio>
              </Radio.Group>
            </div>
          </div>
        </Drawer>
      </div>
    );
  } catch (err) {
    console.error('Error rendering ListingsPage:', err);
    return (
      <div className="bg-[#f0f7ff] min-h-screen py-8 px-4 flex justify-center items-center">
        <Alert
          message="Something went wrong"
          description="There was an error loading the listings page. Please try refreshing the page."
          type="error"
          showIcon
          action={
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          }
        />
      </div>
    );
  }
};

export default ListingsPage;