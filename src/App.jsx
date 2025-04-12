import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/Navbar';
import Footer from './components/Footer';
import Header from './components/Header';
import Destinations from './components/Destination';
import HostSection from './components/HostSection';
import HotelCard from './components/HotelCard';
import GallerySection from './components/GallerySection';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
import MyAccount from './Pages/MyAccount';
import ContactPage from './Pages/ContactPage';
import DealsPage from './Pages/DealsPage';
import AboutUs from './Pages/AboutUs';
import AdminHotels from './Pages/AdminHotels';
import ProtectedRoute from './components/ProtectedRoute';

function HomePage() {
  return (
    <>
      <Header />
      <Destinations />
      <HostSection />
      <HotelCard />
      <GallerySection />
    </>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/hotels" element={<HotelCard />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/about" element={<AboutUs/>} />
        <Route 
          path="/admin/hotels" 
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminHotels />
            </ProtectedRoute>
          } 
        />
      </Routes>
      
      <Footer />
    </Router>
  );
}

export default App;
