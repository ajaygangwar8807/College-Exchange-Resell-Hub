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
  { name: 'BCA Textbooks', slug: 'bca-textbooks', description: 'Core standard textbooks for BCA syllabus semesters', icon: 'BookOpen' },
  { name: 'Programming Books', slug: 'programming-books', description: 'C, C++, Java, Python, and C# programming references', icon: 'Code' },
  { name: 'DSA & Computer Science', slug: 'dsa-computer-science', description: 'Data Structures, Algorithms, Theory of Computation, and Discrete Math', icon: 'Cpu' },
  { name: 'DBMS & Operating Systems', slug: 'dbms-operating-systems', description: 'Database System Concepts, SQL, Linux, and OS Architecture', icon: 'Database' },
  { name: 'Networking & Web Development', slug: 'networking-web-development', description: 'Computer Networks, HTML/CSS/JS, React, and Web Technologies', icon: 'Globe' },
  { name: 'BCA Notes & Lab Manuals', slug: 'bca-notes-lab-manuals', description: 'Handwritten notes, practical lab manuals, and solved question papers', icon: 'FileText' },
  { name: 'Exam Preparation & Reference Books', slug: 'exam-prep-reference', description: 'University exam guides, solved papers, and reference handbooks', icon: 'GraduationCap' },
  { name: 'NIMCET / Entrance Preparation', slug: 'nimcet-entrance-prep', description: 'NIMCET, MCA entrance guides, and quantitative aptitude books', icon: 'Award' },
  { name: 'Other Academic Books', slug: 'other-academic-books', description: 'General academic books, science guides, and calculators', icon: 'BookMarked' },
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

    console.log('[Seed Data]: Inserting Academic Categories...');
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

    console.log('[Seed Data]: Creating Sample BCA Textbooks...');
    const p1 = await Product.create({
      seller: user1._id,
      title: 'Database System Concepts (7th Edition)',
      description: 'Standard textbook for BCA Semester 4 DBMS course. Clean pages, no highlighting, contains complete SQL & Relational Algebra exercises.',
      category: 'DBMS & Operating Systems',
      price: 45,
      condition: 'Like New',
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'],
      listingType: 'sell',
      location: 'Central Campus Library',
      author: 'Silberschatz, Korth & Sudarshan',
      edition: '7th Edition',
      publisher: 'McGraw-Hill Education',
      subject: 'Database Management Systems (DBMS)',
      semester: 'Sem 4',
      course: 'BCA',
      isbn: '978-0078022159',
      status: 'available',
    });

    const p2 = await Product.create({
      seller: user1._id,
      title: 'Data Structures Using C (2nd Edition)',
      description: 'Essential reference book for BCA Semester 3 Data Structures course. Covers Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs with C code.',
      category: 'DSA & Computer Science',
      price: 35,
      condition: 'Good',
      images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800'],
      listingType: 'both',
      location: 'Computer Lab 3 Block B',
      author: 'Reema Thareja / Aaron M. Tenenbaum',
      edition: '2nd Edition',
      publisher: 'Oxford University Press',
      subject: 'Data Structures & Algorithms',
      semester: 'Sem 3',
      course: 'BCA',
      isbn: '978-0198099307',
      status: 'available',
    });

    const p3 = await Product.create({
      seller: user2._id,
      title: 'Complete BCA Sem 3 Java Programming Notes & Lab Solved Manual',
      description: 'Complete handwritten and typed notes with code snippets for BCA 3rd sem Object Oriented Programming using Java. Includes solved lab assignments.',
      category: 'BCA Notes & Lab Manuals',
      price: 15,
      condition: 'New',
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800'],
      listingType: 'sell',
      location: 'Student Activity Center',
      author: 'Priya Sharma (Top Scorer Notes)',
      edition: '2025/2026 Batch',
      publisher: 'Self Notes',
      subject: 'Java OOP & Event Driven Programming',
      semester: 'Sem 3',
      course: 'BCA',
      isbn: 'N/A',
      status: 'available',
    });

    const p4 = await Product.create({
      seller: user2._id,
      title: 'Operating System Concepts (10th Edition)',
      description: 'The dinosaur book for OS. Covers process scheduling, memory management, file systems, and concurrency control. Clean condition.',
      category: 'DBMS & Operating Systems',
      price: 50,
      condition: 'Like New',
      images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800'],
      listingType: 'both',
      location: 'Dorm Block 4 Quad',
      author: 'Silberschatz, Galvin & Gagne',
      edition: '10th Edition',
      publisher: 'Wiley',
      subject: 'Operating Systems Architecture',
      semester: 'Sem 4',
      course: 'BCA',
      isbn: '978-1119800361',
      status: 'available',
    });

    const p5 = await Product.create({
      seller: user3._id,
      title: 'Computer Networking: A Top-Down Approach (8th Edition)',
      description: 'BCA Semester 5 Networking textbook. Covers TCP/IP, OSI layers, HTTP/DNS protocols, and Wireshark lab exercises.',
      category: 'Networking & Web Development',
      price: 40,
      condition: 'Good',
      images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800'],
      listingType: 'sell',
      location: 'Boy Dorm Hostel 2',
      author: 'James F. Kurose & Keith W. Ross',
      edition: '8th Edition',
      publisher: 'Pearson',
      subject: 'Computer Networks & Security',
      semester: 'Sem 5',
      course: 'BCA',
      isbn: '978-0136681557',
      status: 'available',
    });

    const p6 = await Product.create({
      seller: user3._id,
      title: 'NIMCET Computer Awareness & Mathematics Guide',
      description: 'Comprehensive entrance preparation book for NIMCET MCA entrance exams with previous 10 years solved papers and short tricks.',
      category: 'NIMCET / Entrance Preparation',
      price: 25,
      condition: 'Good',
      images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800'],
      listingType: 'exchange',
      location: 'Science Block C Ground Floor',
      author: 'Arihant Experts',
      edition: '2025 Edition',
      publisher: 'Arihant Publications',
      subject: 'Computer Fundamentals & MCA Entrance Math',
      semester: 'Sem 6',
      course: 'BCA',
      isbn: '978-9325791242',
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
