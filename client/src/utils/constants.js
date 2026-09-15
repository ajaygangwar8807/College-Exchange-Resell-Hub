export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CATEGORIES = [
  'All',
  'Books',
  'Notes',
  'Electronics',
  'Calculators',
  'Lab Equipment',
  'Bags',
  'Furniture',
  'Stationery',
  'Other',
];

export const CONDITIONS = ['All', 'New', 'Like New', 'Good', 'Fair', 'Used'];

export const LISTING_TYPES = [
  { label: 'All Types', value: 'All' },
  { label: 'For Sale', value: 'sell' },
  { label: 'For Exchange', value: 'exchange' },
  { label: 'Sale & Exchange', value: 'both' },
];

export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Oldest First', value: 'oldest' },
];
