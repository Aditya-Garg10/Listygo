import React from 'react';

const destinations = [
  {
    name: 'Goa',
    image: 'https://source.unsplash.com/400x400/?goa,beach',
  },
  {
    name: 'Himachal Pradesh',
    image: 'https://source.unsplash.com/400x400/?himachal,mountains',
  },
  {
    name: 'Kerala',
    image: 'https://source.unsplash.com/400x400/?kerala,backwaters',
  },
  {
    name: 'Rajasthan',
    image: 'https://source.unsplash.com/400x400/?rajasthan,forts',
  },
  {
    name: 'Uttarakhand',
    image: 'https://source.unsplash.com/400x400/?uttarakhand,valley',
  },
];

const Destinations = () => {
  return (
    <section className="w-full py-12 px-4 md:px-10 bg-white">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Choose Your Destination</h2>
        <p className="text-gray-600 mt-2">Take a look at the best places in the Work</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {destinations.map((dest, index) => (
          <div
            key={index}
            className="w-[140px] sm:w-[180px] md:w-[200px] text-center transition-transform duration-300 hover:scale-105"
          >
            <div className="overflow-hidden rounded-md shadow-md mb-2">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-[180px] object-cover"
              />
            </div>
            <h3 className="text-md md:text-lg font-semibold text-gray-800">{dest.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Destinations;
