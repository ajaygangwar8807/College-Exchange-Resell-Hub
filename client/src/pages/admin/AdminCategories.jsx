import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { FolderTree, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminService.getProducts(); // fetch categories endpoint or getCategories
      const catRes = await fetch('/api/categories').then((r) => r.json());
      if (catRes.success) setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      setIsSubmitting(true);
      setError('');
      const res = await adminService.createCategory({ name, description });
      if (res.success) {
        setName('');
        setDescription('');
        fetchCategories();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await adminService.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate category');
    }
  };

  if (loading) return <Loader text="Loading marketplace categories..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Campus Category Management</h1>
        <p className="text-xs text-slate-400 mt-1">Configure item classification categories for campus marketplace</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base">Add New Category</h3>
          {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sports Equipment"
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of items in this category..."
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md"
            >
              {isSubmitting ? 'Creating...' : '+ Create Category'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-4">Slug</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-medium">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-900/50 transition">
                  <td className="py-4 px-6 font-bold text-white">{cat.name}</td>
                  <td className="py-4 px-4 text-slate-400">{cat.slug}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      cat.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {cat.isActive && (
                      <button
                        onClick={() => handleDeactivate(cat._id)}
                        className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold rounded-lg text-[10px]"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
