const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ExchangeRequest = require('../models/ExchangeRequest');
const Inquiry = require('../models/Inquiry');
const Wishlist = require('../models/Wishlist');
const Review = require('../models/Review');
const Report = require('../models/Report');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const categoriesData = [
  { name: 'Books', slug: 'books', description: 'Academic textbooks, novels, and reference materials', icon: 'BookOpen' },
  { name: 'Notes', slug: 'notes', description: 'Handwritten notes, exam prep guides, and lab manuals', icon: 'FileText' },
  { name: 'Electronics', slug: 'electronics', description: 'Laptops, tablets, headphones, chargers, and accessories', icon: 'Laptop' },
  { name: 'Calculators', slug: 'calculators', description: 'Scientific & graphic calculators (Casio, TI-84, etc.)', icon: 'Calculator' },
  { name: 'Lab Equipment', slug: 'lab-equipment', description: 'Lab coats, safety goggles, dissecting kits, drawing instruments', icon: 'FlaskConical' },
  { name: 'Bags', slug: 'bags', description: 'Backpacks, laptop sleeves, and tote bags', icon: 'ShoppingBag' },
  { name: 'Furniture', slug: 'furniture', description: 'Dorm study chairs, foldable desks, desk lamps, organizers', icon: 'Armchair' },
  { name: 'Stationery', slug: 'stationery', description: 'Drafting tools, binders, highlighters, notebook packs', icon: 'PenTool' },
  { name: 'Other', slug: 'other', description: 'General college essentials, sports equipment, and miscellaneous', icon: 'Grid' },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed Data]: Clearing existing collection data...');
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await ExchangeRequest.deleteMany();
    await Inquiry.deleteMany();
    await Wishlist.deleteMany();
    await Review.deleteMany();
    await Report.deleteMany();
    // Keep admin users, delete test students
    await User.deleteMany({ role: 'student' });

    console.log('[Seed Data]: Inserting Categories...');
    await Category.insertMany(categoriesData);

    console.log('[Seed Data]: Creating Demo Student Users...');
    const user1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@college.edu',
      password: 'StudentPass123!',
      phone: '+1 555-0192',
      college: 'School of Computer Science',
      course: 'BCA',
      year: '3rd Year',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    });

    const user2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@college.edu',
      password: 'StudentPass123!',
      phone: '+1 555-0184',
      college: 'Institute of Information Technology',
      course: 'BCA',
      year: '2nd Year',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    });

    const user3 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus@college.edu',
      password: 'StudentPass123!',
      phone: '+1 555-0143',
      college: 'Department of Electronics',
      course: 'BCA',
      year: '3rd Year',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    });

    console.log('[Seed Data]: Creating Sample Products...');
    const p1 = await Product.create({
      seller: user1._id,
      title: 'Database System Concepts (7th Edition) - Silberschatz',
      description: 'Used for BCA Semester 4 DBMS course. Clean pages, no highlighting, contains complete SQL exercises section.',
      category: 'Books',
      price: 45,
      condition: 'Like New',
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'],
      listingType: 'sell',
      location: 'Central Campus Library',
      status: 'available',
    });

    const p2 = await Product.create({
      seller: user1._id,
      title: 'Casio FX-991EX ClassWiz Scientific Calculator',
      description: 'Solar powered, 552 functions. Essential for Discrete Mathematics & Statistics labs. Works perfectly with fresh backup battery.',
      category: 'Calculators',
      price: 25,
      condition: 'Good',
      images: ['https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?auto=format&fit=crop&q=80&w=800'],
      listingType: 'both',
      location: 'Computer Lab 3 Block B',
      status: 'available',
    });

    const p3 = await Product.create({
      seller: user2._id,
      title: 'Complete Java Data Structures & Algorithms Notes Bundle',
      description: 'Complete handwritten and typed notes with code snippets for BCA 3rd sem DSA exam prep. Includes solved previous year questions.',
      category: 'Notes',
      price: 15,
      condition: 'New',
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800'],
      listingType: 'sell',
      location: 'Student Activity Center',
      status: 'available',
    });

    const p4 = await Product.create({
      seller: user2._id,
      title: 'Logitech MX Master 3S Wireless Mouse',
      description: 'Ultra-fast quiet scrolling mouse. Great for coding and graphic work. Includes USB dongle and charging cable.',
      category: 'Electronics',
      price: 65,
      condition: 'Like New',
      images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800'],
      listingType: 'both',
      location: 'Dorm Block 4 Quad',
      status: 'available',
    });

    const p5 = await Product.create({
      seller: user3._id,
      title: 'Ergonomic Mesh Study Chair with Lumbar Support',
      description: 'Black breathable mesh chair with adjustable height and tilt lock. Perfect for long programming sessions in campus dorms.',
      category: 'Furniture',
      price: 50,
      condition: 'Good',
      images: ['https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&q=80&w=800'],
      listingType: 'sell',
      location: 'Boy Dorm Hostel 2',
      status: 'available',
    });

    const p6 = await Product.create({
      seller: user3._id,
      title: 'White Cotton Lab Coat (Size L) & Safety Glasses Set',
      description: 'Standard white chemistry/physics lab coat with front pockets. Used only for one semester practical exam.',
      category: 'Lab Equipment',
      price: 18,
      condition: 'Good',
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'],
      listingType: 'exchange',
      location: 'Science Block C Ground Floor',
      status: 'available',
    });

    console.log('[Seed Data]: Creating Sample Wishlist & Inquiries...');
    await Wishlist.create({
      user: user2._id,
      products: [p1._id, p2._id],
    });

    await Inquiry.create({
      buyer: user2._id,
      seller: user1._id,
      product: p1._id,
      message: 'Hi Alex! Is the Silberschatz Database book available for pickup near the library tomorrow afternoon?',
      status: 'pending',
    });

    console.log('[Seed Data]: Creating Sample Exchange Request...');
    await ExchangeRequest.create({
      requester: user1._id,
      owner: user3._id,
      requestedProduct: p6._id,
      offeredProduct: p2._id,
      message: 'Hey Marcus, I would like to exchange my Casio FX-991EX calculator for your lab coat set if you are interested!',
      status: 'pending',
    });

    console.log('[Seed Data Success]: Demo data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Data Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
