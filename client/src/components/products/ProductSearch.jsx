import React from 'react';
import { SORT_OPTIONS } from '../../utils/constants';
import { Search, ArrowUpDown } from 'lucide-react';

const ProductSearch = ({ keyword, onSearchChange, sortBy, onSortChange }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search textbooks, calculators, lab gear..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Sort Select */}
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
          Sort:
        </span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full sm:w-48 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductSearch;
