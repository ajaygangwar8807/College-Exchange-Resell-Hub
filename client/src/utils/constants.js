export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CATEGORIES = [
  'All',
  'BCA Textbooks',
  'Programming Books',
  'DSA & Computer Science',
  'DBMS & Operating Systems',
  'Networking & Web Development',
  'BCA Notes & Lab Manuals',
  'Exam Preparation & Reference Books',
  'NIMCET / Entrance Preparation',
  'Other Academic Books',
];

export const SEMESTERS = ['All', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'All Semesters'];

export const COURSES = ['All', 'BCA', 'MCA', 'B.Tech CS/IT', 'B.Sc Computer Science'];

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
