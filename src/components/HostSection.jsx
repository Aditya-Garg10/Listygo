import React from 'react';

const HostSection = () => {
  return (
    <section className="w-full my-12 px-4 md:px-10">
      <div className="relative rounded-xl overflow-hidden flex flex-col md:flex-row items-center bg-black">
        {/* Left Side - Content */}
        <div className="w-full md:w-1/2 text-white p-8 md:p-12 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Try hosting</h2>
          <p className="mb-6 text-sm md:text-base">
            Earn extra income and unlock new opportunities by sharing your space.
          </p>
          <button className="bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-100 transition">
            Learn more
          </button>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 h-[300px] md:h-[400px]">
          <img
            src="https://i.imgur.com/ehH0pUz.png" // You can replace this with your own hosted image URL
            alt="Try hosting"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HostSection;
