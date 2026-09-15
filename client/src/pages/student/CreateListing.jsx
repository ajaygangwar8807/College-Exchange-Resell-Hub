import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductContext } from '../../context/ProductContext';
import { AuthContext } from '../../context/AuthContext';
import { PlusCircle, Upload, AlertCircle, ArrowLeft } from 'lucide-react';

const CreateListing = () => {
  const navigate = useNavigate();
  const { categories } = useContext(ProductContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Books',
    price: '',
    condition: 'Good',
    listingType: 'sell',
    location: user?.college || 'Campus Library / Canteen',
    imagesText: '',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.condition) {
      setError('Please fill in title, description, category, and condition.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Prepare form data for Multer / backend
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price ? formData.price : '0');
      data.append('condition', formData.condition);
      data.append('listingType', formData.listingType);
      data.append('location', formData.location);

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => data.append('images', file));
      } else if (formData.imagesText.trim()) {
        const urls = formData.imagesText.split('\n').map((u) => u.trim()).filter(Boolean);
        urls.forEach((url) => data.append('images', url));
      }

      const res = await productService.createProduct(data);
      if (res.success) {
        navigate(`/products/${res.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Post a Campus Listing</h1>
          <p className="text-xs text-slate-500">Sell or exchange your textbooks, lab gear, and accessories</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Item Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Database System Concepts (Silberschatz 7th Ed)"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              {categories.map((cat) => (
                <option key={cat._id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Item Condition *
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Used">Used</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Listing Type *
            </label>
            <select
              name="listingType"
              value={formData.listingType}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="sell">For Sale Only</option>
              <option value="exchange">For Item Exchange Only</option>
              <option value="both">Open to Sale & Exchange</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Asking Price ($)
            </label>
            <input
              type="number"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 25 (Set 0 for exchange only)"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Campus Pickup Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Central Library 2nd Floor / Computer Lab 3"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Detailed Description *
          </label>
          <textarea
            name="description"
            required
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Include condition details, edition year, included accessories, or topics covered..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        {/* Product Image Upload Options */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Product Images
          </label>
          <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
            <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">Upload image files from computer</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>

          <div className="text-center text-xs text-slate-400 font-semibold uppercase">Or provide image URL link</div>
          <input
            type="url"
            name="imagesText"
            value={formData.imagesText}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl transition shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              <span>Publish Listing to Marketplace</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
