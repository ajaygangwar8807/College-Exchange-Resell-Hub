import React from 'react';
import { CATEGORIES, CONDITIONS, LISTING_TYPES, SEMESTERS, COURSES } from '../../utils/constants';
import { Filter, RotateCcw, BookOpen, GraduationCap } from 'lucide-react';

const ProductFilter = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2 text-slate-800 font-bold">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filter Books & Notes</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Semester Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Semester</span>
        </label>
        <select
          value={filters.semester || 'All'}
          onChange={(e) => onFilterChange('semester', e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500"
        >
          {SEMESTERS.map((sem) => (
            <option key={sem} value={sem}>
              {sem === 'All' ? 'All Semesters' : sem}
            </option>
          ))}
        </select>
      </div>

      {/* Course Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Course Degree</span>
        </label>
        <select
          value={filters.course || 'All'}
          onChange={(e) => onFilterChange('course', e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500"
        >
          {COURSES.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'All Courses' : c}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Academic Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`flex items-center space-x-2 text-xs font-medium p-1.5 rounded-lg cursor-pointer transition ${
                filters.category === cat
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => onFilterChange('category', cat)}
                className="text-indigo-600 focus:ring-indigo-500 rounded"
              />
              <span className="truncate">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Listing Type Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Listing Type
        </label>
        <div className="space-y-1">
          {LISTING_TYPES.map((type) => (
            <label
              key={type.value}
              className={`flex items-center space-x-2 text-xs font-medium p-1.5 rounded-lg cursor-pointer transition ${
                filters.listingType === type.value
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="listingType"
                checked={filters.listingType === type.value}
                onChange={() => onFilterChange('listingType', type.value)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Book Condition
        </label>
        <select
          value={filters.condition}
          onChange={(e) => onFilterChange('condition', e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500"
        >
          {CONDITIONS.map((cond) => (
            <option key={cond} value={cond}>
              {cond}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Max Price ($)
        </label>
        <input
          type="number"
          min="0"
          placeholder="e.g. 100"
          value={filters.maxPrice || ''}
          onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default ProductFilter;
