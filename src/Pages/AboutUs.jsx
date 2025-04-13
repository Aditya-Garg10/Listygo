import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-scroll';
import { 
  FaRegSmileBeam, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaHistory, 
  FaAward, 
  FaHotel, 
  FaHandshake, 
  FaGlobe 
} from 'react-icons/fa';
import { Avatar, Progress, Tabs } from 'antd';

const AboutUs = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Sections for the navigation
  const sections = [
    { id: 'ourStory', label: 'Our Story', icon: <FaHistory /> },
    { id: 'ourMission', label: 'Our Mission', icon: <FaRegSmileBeam /> },
    { id: 'ourTeam', label: 'Our Team', icon: <FaUsers /> },
    { id: 'ourLocations', label: 'Locations', icon: <FaMapMarkerAlt /> }
  ];

  // Refs for scroll sections
  const refs = {
    ourStory: useRef(null),
    ourMission: useRef(null),
    ourTeam: useRef(null),
    ourLocations: useRef(null)
  };

  // Team members data
  const teamMembers = [
    {
      name: "Aditya Garg",
      role: "Founder & CEO",
      bio: "Passionate about creating exceptional travel experiences and leading our team to new heights.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      bio: "Ensures smooth day-to-day operations and exceptional service quality for all customers.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Rajat Kumar",
      role: "Chief Technology Officer",
      bio: "Leads our technical innovations and ensures our platform remains cutting-edge and user-friendly.",
      image: "https://randomuser.me/api/portraits/men/68.jpg"
    },
    {
      name: "Ananya Singh",
      role: "Customer Experience Lead",
      bio: "Dedicated to creating memorable experiences for our users through personalized service.",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];

  // Milestones data
  const milestones = [
    {
      year: "2020",
      title: "ListyGo Founded",
      description: "Started with a small team of 5 members in Baroda, Gujarat"
    },
    {
      year: "2021",
      title: "First 1000 Bookings",
      description: "Reached milestone of facilitating 1,000 successful stays"
    },
    {
      year: "2022",
      title: "Expanded to 10 Cities",
      description: "Grew our presence across major metropolitan areas in India"
    },
    {
      year: "2023",
      title: "Award-Winning App",
      description: "Received 'Best Travel Tech Startup' award at India Tech Summit"
    },
    {
      year: "2024",
      title: "3 Million Users",
      description: "Crossed milestone of 3 million registered users on our platform"
    }
  ];

  // Stats data
  const stats = [
    { label: "Cities", value: "50+", icon: <FaMapMarkerAlt /> },
    { label: "Hotels & Properties", value: "2,500+", icon: <FaHotel /> },
    { label: "Happy Customers", value: "3M+", icon: <FaRegSmileBeam /> },
    { label: "Partners", value: "200+", icon: <FaHandshake /> }
  ];

  // Check if section is in view
  const useIsInView = (ref) => {
    return useInView(ref, { once: false, margin: "-30% 0px -30% 0px" });
  };

  // Render a section with animation if in view
  const RenderSection = ({ id, title, content }) => {
    const isInView = useIsInView(refs[id]);
    
    return (
      <motion.div
        ref={refs[id]}
        id={id}
        className="mb-16"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2"
        >
          {sections.find(s => s.id === id)?.icon}
          {title}
        </motion.h2>
        {content}
      </motion.div>
    );
  };

  return (
    <>
      {/* Hero Section */}
      <motion.div 
        className="relative h-[50vh] flex items-center justify-center bg-blue-600 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-10">
          <img 
            src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
            alt="Hotel lobby" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center px-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            About ListyGo
          </motion.h1>
          <motion.p 
            className="text-xl text-white/90 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Creating memorable stays for travelers around the world
          </motion.p>
        </div>
      </motion.div>

      <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Pills - Desktop */}
          <div className="hidden md:block sticky top-20 z-40 bg-white/80 backdrop-blur-md shadow-sm rounded-full px-6 py-3 mb-12">
            <div className="flex justify-center gap-8">
              {sections.map(section => (
                <Link
                  key={section.id}
                  to={section.id}
                  spy={true}
                  smooth={true}
                  offset={-100}
                  duration={500}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                  activeClass="text-blue-600 font-semibold"
                >
                  {section.icon}
                  {section.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Pills - Mobile */}
          <div className="md:hidden mb-8">
            <Tabs
              centered
              items={sections.map(section => ({
                key: section.id,
                label: (
                  <Link
                    to={section.id}
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    className="flex items-center gap-2"
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </Link>
                )
              }))}
            />
          </div>
          
          {/* Our Story Section */}
          <RenderSection id="ourStory" title="Our Story" content={
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <div className="relative">
                    <div className="absolute  -inset-4 bg-blue-100 rounded-lg transform -rotate-6 z-0"></div>
                    <img 
                      src="/top-photo.svg"
                      alt="Company founding" 
                      className="rounded-lg ms-16 -rotate-6 h-[300px]  relative z-10 shadow-lg"
                    />
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <p className="text-gray-700 mb-4">
                    ListyGo was founded in 2020 with a simple mission: to make travel accommodations more accessible, transparent, and enjoyable for everyone.
                  </p>
                  <p className="text-gray-700 mb-4">
                    What started as a small startup in Baroda, Gujarat has grown into a nationwide platform connecting travelers with unique stays across India.
                  </p>
                  <p className="text-gray-700">
                    Our team combines expertise in hospitality, technology, and customer service to create a seamless booking experience that puts travelers first.
                  </p>
                </div>
              </motion.div>

              {/* Timeline */}
              <motion.div variants={fadeInUp} className="pt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Our Journey</h3>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-blue-200"></div>
                  
                  {/* Timeline items */}
                  {milestones.map((milestone, index) => (
                    <motion.div 
                      key={index}
                      className={`flex flex-col md:flex-row gap-4 mb-8 relative ${
                        index % 2 === 0 ? 'md:flex-row-reverse' : ''
                      }`}
                      variants={fadeInUp}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center text-xs text-white font-bold">
                        {milestone.year.substring(2)}
                      </div>
                      
                      {/* Content */}
                      <div className={`pl-16 md:pl-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                          <h4 className="text-lg font-bold text-blue-600">{milestone.year}: {milestone.title}</h4>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                      <div className="hidden md:block md:w-1/2"></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          }/>

          {/* Mission & Vision Section */}
          <RenderSection id="ourMission" title="Our Mission & Values" content={
            <div>
              <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h3>
                  <p className="text-gray-700">
                    To revolutionize the way people discover and book accommodations by providing a platform that offers unique, quality stays with transparency, reliability, and exceptional service.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Our Vision</h3>
                  <p className="text-gray-700">
                    To become the most trusted accommodation platform globally, known for our diverse range of quality properties and customer-centric approach.
                  </p>
                </div>
              </motion.div>
              
              {/* Values */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Our Core Values</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Customer First",
                      description: "We prioritize our customers' needs and preferences in everything we do.",
                      icon: "💙"
                    },
                    {
                      title: "Transparency",
                      description: "We believe in being honest and clear in our communications and listings.",
                      icon: "🔍"
                    },
                    {
                      title: "Innovation",
                      description: "We constantly seek new ways to improve our platform and user experience.",
                      icon: "💡"
                    },
                    {
                      title: "Quality",
                      description: "We maintain high standards for all properties on our platform.",
                      icon: "✨"
                    },
                    {
                      title: "Inclusivity",
                      description: "We welcome all travelers and hosts from diverse backgrounds.",
                      icon: "🌈"
                    },
                    {
                      title: "Sustainability",
                      description: "We promote responsible travel and environmentally-friendly practices.",
                      icon: "🌱"
                    }
                  ].map((value, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="text-3xl mb-3">{value.icon}</div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h4>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Stats Section */}
              <motion.div 
                variants={fadeInUp} 
                className="mt-16 p-8 bg-blue-600 rounded-xl text-white"
              >
                <h3 className="text-xl font-bold text-center mb-8">ListyGo By The Numbers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-5xl mb-2">{stat.icon}</div>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-blue-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          }/>

          {/* Team Section */}
          <RenderSection id="ourTeam" title="Our Team" content={
            <div>
              <motion.p variants={fadeInUp} className="text-gray-700 mb-8">
                Meet the dedicated professionals behind ListyGo. Our diverse team brings together expertise from technology, hospitality, and customer service to create an exceptional travel platform.
              </motion.p>
              
              <motion.div 
                variants={staggerContainer} 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
              >
                {teamMembers.map((member, index) => (
                  <motion.div 
                    key={index} 
                    variants={fadeInUp}
                    className="bg-white rounded-lg shadow-md overflow-hidden group"
                  >
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="text-white text-sm">{member.bio}</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800">{member.name}</h4>
                      <p className="text-sm text-blue-600">{member.role}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div variants={fadeInUp} className="mt-12 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Why People Love Working at ListyGo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <div className="text-2xl mb-3">🚀</div>
                    <h4 className="font-medium text-gray-800 mb-2">Growth Opportunities</h4>
                    <p className="text-sm text-gray-600">Continuous learning and career advancement in a rapidly growing company</p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <div className="text-2xl mb-3">🤝</div>
                    <h4 className="font-medium text-gray-800 mb-2">Collaborative Culture</h4>
                    <p className="text-sm text-gray-600">A supportive environment where ideas are valued and teamwork thrives</p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <div className="text-2xl mb-3">💪</div>
                    <h4 className="font-medium text-gray-800 mb-2">Meaningful Impact</h4>
                    <p className="text-sm text-gray-600">Making a real difference in how people experience travel</p>
                  </div>
                </div>
              </motion.div>
            </div>
          }/>

          {/* Locations Section */}
          <RenderSection id="ourLocations" title="Our Global Presence" content={
            <div>
              <motion.p variants={fadeInUp} className="text-gray-700 mb-8">
                Since our founding, we've expanded our presence across India and are now taking our first steps into global markets.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="mb-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">India Coverage</h3>
                
                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2">
                      <img 
                        src="https://i.pinimg.com/736x/90/98/d8/9098d87fa95cba68939dc0bdb650383e.jpg" 
                        alt="Map of India" 
                        className="w-full object-contain h-auto max-h-96"
                      />
                    </div>
                    <div className="md:w-1/2">
                      <h4 className="font-medium text-gray-800 mb-4">Major Regions</h4>
                      <div className="space-y-4">
                        {[
                          { region: "North India", cities: "Delhi, Jaipur, Chandigarh, Lucknow", percentage: 25 },
                          { region: "South India", cities: "Bangalore, Chennai, Hyderabad, Kochi", percentage: 30 },
                          { region: "West India", cities: "Mumbai, Pune, Ahmedabad, Baroda", percentage: 35 },
                          { region: "East India", cities: "Kolkata, Bhubaneswar, Guwahati", percentage: 10 }
                        ].map((region, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-gray-700">{region.region}</span>
                              <span className="text-blue-600">{region.percentage}%</span>
                            </div>
                            <Progress 
                              percent={region.percentage} 
                              showInfo={false} 
                              strokeColor="#3b82f6"
                              trailColor="#e5e7eb"
                              size="small"
                            />
                            <div className="text-xs text-gray-500 mt-1">{region.cities}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Global Expansion</h3>
                
                <div className="bg-blue-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <FaGlobe className="text-blue-600 text-xl" />
                    <h4 className="font-medium text-gray-800">Coming Soon</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { country: "United Arab Emirates", city: "Dubai", year: "2025" },
                      { country: "Singapore", city: "Singapore City", year: "2025" },
                      { country: "Thailand", city: "Bangkok", year: "2026" },
                      { country: "Malaysia", city: "Kuala Lumpur", year: "2026" },
                      { country: "Indonesia", city: "Bali", year: "2026" },
                      { country: "Vietnam", city: "Ho Chi Minh City", year: "2027" }
                    ].map((location, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="font-medium text-gray-800">{location.country}</div>
                        <div className="text-sm text-gray-600">{location.city}</div>
                        <div className="text-xs text-blue-600 mt-1">Target: {location.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          }/>
          
          {/* CTA Section */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Join the ListyGo Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Whether you're looking to book your next stay or partner with us as a property owner, we'd love to have you as part of our growing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
                Explore Properties
              </button>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors">
                Partner with Us
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;