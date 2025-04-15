// HeaderCarouselSection.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Hotel, Home, ShoppingBag, ChevronDown, Search, MapPin } from "lucide-react"; // Added MapPin
import { Link, useNavigate} from "react-router-dom"; // Import Link for routing

const slides = [
  {
    category: "Accommodations",
    title: "Find Your Stay",
    subtitle: "Top-rated hotels, motels & homestays near you",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    icon: <Hotel size={16} />,
    route: "/listings/accommodations" // Example route
  },
  {
    category: "Real Estate",
    title: "Explore Real Estate",
    subtitle: "Buy, sell or rent homes and offices",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    icon: <Home size={16} />,
    route: "/listings/real-estate" // Example route
  },
  {
    category: "Shopping",
    title: "Shop the Best Deals",
    subtitle: "Local marketplace for everything you need",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    icon: <ShoppingBag size={16} />,
    route: "/listings/shopping" // Example route
  },
];

export default function HeaderCarouselSection() {
  const navigate = useNavigate(); // Initialize useNavigate for routing
  const [current, setCurrent] = React.useState(0);
  const [location, setLocation] = React.useState(""); // Geolocation state
  const [searchLocation, setSearchLocation] = React.useState(""); // State for location input
  const [searchInput, setSearchInput] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("all"); // State for dropdown
  const [isSearching, setIsSearching] = React.useState(false); // State for loading overlay

  const length = slides.length;

  const nextSlide = React.useCallback(() => setCurrent((prev) => (prev + 1) % length), [length]);
  const prevSlide = () => setCurrent((current - 1 + length) % length);

  React.useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Geolocation logic (remains the same)
  const handleGeoLocation = React.useCallback(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            )
              .then((res) => res.json())
              .then((data) => {
                const city = data.address.city || data.address.town || data.address.village || "Your Area";
                setLocation(city);
                // Optionally pre-fill search location if empty
                // if (!searchLocation) setSearchLocation(city);
              })
              .catch(() => setLocation("Location Unavailable"));
          },
          () => setLocation("Location Unavailable")
        );
      } else {
          setLocation("Geolocation not supported");
      }
  }, []); // Removed searchLocation dependency if not pre-filling

  React.useEffect(() => {
    handleGeoLocation();
  }, [handleGeoLocation]);

  // Search input and suggestions logic
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (val.length > 1) {
      setSuggestions(
        ["Hotels", "Rentals", "Gyms", "Shopping Malls", "Events", "Studios"].filter((item) =>
          item.toLowerCase().includes(val.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  // Location input change handler
  const handleLocationChange = (e) => {
    setSearchLocation(e.target.value);
  };

  const handleSearchSubmit = () => {
    // Trim inputs to check if they are non-empty
    const trimmedSearch = searchInput.trim();
    const trimmedLocation = searchLocation.trim();

    // Proceed only if at least one input has value
    if (trimmedSearch || trimmedLocation) {
      setIsSearching(true); // Set loading state to true

      // Simulate a brief loading period before navigation
      setTimeout(() => {
        // Construct search params, only including non-empty values
        const params = new URLSearchParams();
        if (trimmedSearch) params.set('search', trimmedSearch);
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (trimmedLocation) params.set('location', trimmedLocation);

        navigate(`/listings?${params.toString()}`);

        // Clear inputs after search
        setSearchInput("");
        setSearchLocation(""); // Clear location input
        setSuggestions([]);
        setIsSearching(false); // Hide loading overlay
      }, 1500); // 1.5 seconds of loading animation
    }
  };


  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <section className="relative w-full h-[100vh] overflow-hidden pt-16"> {/* Ensure mt-18 matches your header height */}

      {/* Category Tabs - Updated active state to blue */}
      <div className="absolute top-6 left-4 right-4 md:left-6 md:right-auto z-20 flex gap-2 md:gap-3 flex-wrap justify-center md:justify-start">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium shadow-md transition-all duration-300 ${
              current === index
                ? "bg-blue-600 text-white scale-105" // Active tab is blue
                : "bg-white/80 text-black/80 hover:bg-white" // Adjusted inactive/hover
            }`}
          >
            {slide.icon} {slide.category}
          </button>
        ))}
      </div>

      {/* Background slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[current].image})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4 z-10">
        <AnimatePresence mode="wait">
            <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 drop-shadow-lg">
                    {slides[current].title}
                </h1>
                <p className="text-lg md:text-2xl mb-6 drop-shadow-md">
                    {slides[current].subtitle}
                </p>
            </motion.div>
        </AnimatePresence>

        {/* Refined Search Bar */}
        <motion.div
          className="mt-4 w-full max-w-xl lg:max-w-3xl relative" // Increased max-width slightly
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-stretch bg-white rounded-xl overflow-hidden shadow-lg border border-gray-300">

            {/* Category Dropdown Section */}
            <div className="relative border-b border-gray-300 md:border-b-0 md:border-r w-full md:w-auto shrink-0">
              <select
                className="w-full md:w-auto appearance-none cursor-pointer focus:outline-none bg-transparent text-gray-700 pl-4 pr-10 py-3 text-sm md:text-base"
                value={selectedCategory} // Controlled component
                onChange={handleCategoryChange} // Handle change
                aria-label="Select Category"
              >
                <option value="all">All Categories</option>
                {slides.map((slide, i) => (
                  <option key={i} value={slide.category.toLowerCase()}>
                    {slide.category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown size={18} className="text-gray-500" />
              </div>
            </div>

            {/* Location Input Section */}
            <div className="relative flex-grow border-b border-gray-300 md:border-b-0 md:border-r">
              <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchLocation}
                onChange={handleLocationChange}
                placeholder={location || "Enter Location"} // Use detected location as placeholder
                className="w-full pl-10 pr-4 py-3 text-sm md:text-base text-black bg-transparent focus:outline-none"
                aria-label="Search location"
              />
            </div>

            {/* Search Input Section */}
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="What are you looking for?"
                className="w-full px-4 py-3 text-sm md:text-base text-black bg-transparent focus:outline-none"
                aria-label="Search listings"
              />
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.ul
                    className="absolute left-0 right-0 top-full mt-1 w-full bg-white text-black rounded-lg max-h-48 overflow-y-auto shadow-xl z-20 border border-gray-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {suggestions.map((sug, i) => (
                      <motion.li
                        key={i}
                        onClick={() => {
                          setSearchInput(sug);
                          setSuggestions([]);
                        }}
                        className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer"
                        whileHover={{ backgroundColor: ["#EFF6FF", "#DBEAFE"] }}
                        transition={{ duration: 0.1 }}
                      >
                        {sug}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Search Button Section */}
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-3 transition-colors duration-300 w-full md:w-auto flex items-center justify-center gap-2 shrink-0"
              onClick={handleSearchSubmit}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Submit Search"
            >
              <Search size={18} />
              <span className="text-sm md:text-base font-medium">Search</span>
            </motion.button>

          </div>
        </motion.div>

        {/* CTA Buttons - Updated to use Link */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
           {/* Explore Now Button routes to /all-listings */}
           <motion.div // Wrap Link in motion.div for animation
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.5 }}
           >
             <Link to={`/listings?category=${slides[current].category.toLowerCase()}`}

               className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 text-sm md:text-base"
             >
               Explore Now <ChevronRight size={18} />
             </Link>
           </motion.div>

           {/* Learn More Button routes to /about-us */}
           <motion.div // Wrap Link in motion.div for animation
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.7 }}
           >
             <Link
               to="/about" // Route to About Us page
               className="inline-block px-6 py-2.5 bg-white/20 text-white font-semibold rounded-lg border border-white hover:bg-white/30 transition-colors duration-300 text-sm md:text-base"
             >
               Learn More
             </Link>
           </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 cursor-pointer z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors text-white"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 cursor-pointer z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors text-white"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots Navigation - Active dot uses blue */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="p-0.5"
          >
            <motion.div
              animate={{ scale: i === current ? 1.4 : 1, opacity: i === current ? 1 : 0.6 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`w-2.5 h-2.5 rounded-full ${i === current ? "bg-blue-500" : "bg-white/60"}`} // Active dot is blue
            />
          </button>
        ))}
      </div>

      {/* Search Loading Overlay */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{
                rotate: 360,
                borderRadius: ["50% 50%", "40% 60%", "50% 50%"]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-16 h-16 border-t-4 border-blue-500 border-r-4 rounded-full"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white text-xl font-medium mt-4"
            >
              Searching...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
