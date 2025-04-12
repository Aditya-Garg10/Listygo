import React from 'react';

const images = [
  'https://picsum.photos/id/1011/400/400',
  'https://picsum.photos/id/1015/400/400',
  'https://picsum.photos/id/1016/400/400',
  'https://picsum.photos/id/1021/400/400',
  'https://picsum.photos/id/1035/400/400',
  'https://picsum.photos/id/1043/400/400',
  'https://picsum.photos/id/1041/400/400',
  'https://picsum.photos/id/1056/400/400',
];

const GallerySection = () => {
  return (
    <section className="px-4 md:px-10 py-12 bg-blue-50 text-blue-900">
      {/* Heading */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold">
          From <span className="bg-blue-600 text-white px-2 py-1 rounded">The Gallery</span>
        </h2>
        <p className="mt-3 text-blue-700 max-w-xl">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`gallery-${idx}`}
            className="rounded-lg object-cover w-full h-[250px] transition-transform hover:scale-105 duration-300 shadow-md"
          />
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
