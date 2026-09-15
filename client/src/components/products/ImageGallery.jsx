import React, { useState } from 'react';

const ImageGallery = ({ images = [] }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800';
  const gallery = images.length > 0 ? images : [defaultImage];
  const [selectedImage, setSelectedImage] = useState(gallery[0]);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="aspect-4/3 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative">
        <img
          src={selectedImage}
          alt="Product detail"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                selectedImage === img
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
