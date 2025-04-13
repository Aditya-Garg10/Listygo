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
import AdminLoginPage from './Pages/AdminLoginPage';
import MyAccount from './Pages/MyAccount';
import ContactPage from './Pages/ContactPage';
import DealsPage from './Pages/DealsPage';
import AboutUs from './Pages/AboutUs';
import AdminHotels from './Pages/AdminHotels';
import ProtectedRoute from './components/ProtectedRoute';
import HotelDetailsPage from './Pages/HotelDetailsPage';
import HomePageHotelCard from './components/HomePageHotelCard';
import AdminDashboard from './components/AdminDashboard';
import AdminListings from './Pages/AdminListings';
import AdminCategories from './Pages/AdminCategories';
import ListingsPage from './Pages/ListingsPage';
import ListingDetailsPage from './Pages/ListingDetailsPage';

function HomePage() {
  return (
    <>
       <Header />
      <Destinations />
      <HomePageHotelCard />
      <HostSection />
      <GallerySection />
    </>
  );
}

// Layout component for routes that need navbar and footer
const MainLayout = ({ children }) => (
  <>
    <NavBar />
    {children}
    <Footer />
  </>
);

// Layout without navbar and footer for full-page designs
const CleanLayout = ({ children }) => <>{children}</>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with navbar and footer */}
        <Route path="/" element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        } />
        <Route path="/register" element={
          <MainLayout>
            <RegisterPage />
          </MainLayout>
        } />
        <Route path="/login" element={
          <MainLayout>
            <LoginPage />
          </MainLayout>
        } />
        <Route path="/account" element={
          <ProtectedRoute>
            <MainLayout>
              <MyAccount />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/hotels" element={
          <MainLayout>
            <HotelCard />
          </MainLayout>
        } />
        <Route path="/hotels/:id" element={
          <MainLayout>
            <HotelDetailsPage />
          </MainLayout>
        } />
        <Route path="/listings" element={
          <MainLayout>
            <ListingsPage />
          </MainLayout>
        } />
        <Route path="/listings/:id" element={
          <MainLayout>
            <ListingDetailsPage />
          </MainLayout>
        } />
        <Route path="/contact" element={
          <MainLayout>
            <ContactPage />
          </MainLayout>
        } />
        <Route path="/about" element={
          <MainLayout>
            <AboutUs/>
          </MainLayout>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={
          <CleanLayout>
            <AdminLoginPage />
          </CleanLayout>
        } />
        <Route path="/admin/hotels" element={
          <ProtectedRoute isAdmin={true}>
            <MainLayout>
              <AdminHotels />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute isAdmin={true}>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/listings" element={
          <ProtectedRoute isAdmin={true}>
            <AdminListings />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute isAdmin={true}>
            <AdminCategories />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;