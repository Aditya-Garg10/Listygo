import React from 'react';

const hotelData = [
  {
    image: 'https://i.imgur.com/yXy4zYp.png',
    title: "Beloshi’s Cliffhanger",
    bedroom: 10,
    bathroom: 10,
    poster: "Dr.Drake",
    price: "$45,545",
  },
  {
    image: 'https://i.imgur.com/n9lGjZ6.png',
    title: "Sky Penthouse | Luxurious 3bhk",
    bedroom: 10,
    size: "150 M",
    garage: 2,
    poster: "Dr.Drake",
    price: "$45,545",
  },
  {
    image: 'https://i.imgur.com/vGxLSIb.png',
    title: "Mystic Abode | An old colonial house",
    bedroom: 10,
    size: "150 M",
    garage: 2,
    poster: "Dr.Drake",
    price: "$45,545",
  },
  {
    image: 'https://i.imgur.com/1jZ9oYy.png',
    title: "Waking Dream Cottage Bhimtal Lake View",
    bedroom: 10,
    size: "150 M",
    garage: 2,
    poster: "Dr.Drake",
    price: "$45,545",
  },
];

const HotelCard = () => {
  return (
    <section className="px-4 md:px-10 py-12">
      {/* Heading */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            The very best of our <span className="text-black">Selections</span>
          </h2>
          <p className="text-gray-600 mt-1">Take a look at the best homes in the Work</p>
        </div>
        <button className="text-[#831843] font-semibold hover:underline">See all</button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {hotelData.map((hotel, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md border border-[#831843]/20 p-4 flex items-start space-x-4 hover:shadow-lg transition-all"
          >
            <img
              src={hotel.image}
              alt={hotel.title}
              className="w-28 h-28 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{hotel.title}</h3>
              <div className="text-sm text-gray-600 my-2 flex flex-wrap gap-4">
                {hotel.bedroom && <span>{hotel.bedroom} Bedroom{hotel.bedroom > 1 ? 's' : ''}</span>}
                {hotel.bathroom && <span>{hotel.bathroom} Bathroom{hotel.bathroom > 1 ? 's' : ''}</span>}
                {hotel.size && <span>{hotel.size}</span>}
                {hotel.garage && <span>{hotel.garage} Garage</span>}
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-700 text-sm">Posted by {hotel.poster}</p>
                <span className="bg-[#f43f5e] text-white text-sm px-4 py-1.5 rounded-lg font-semibold">
                  {hotel.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HotelCard;
