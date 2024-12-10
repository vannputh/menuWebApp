const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
require('dotenv').config(); // For managing environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/restaurant')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Existing Schemas (kept from your original code)
const drinkSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String
});

const mainDishSchema = new mongoose.Schema({
  title: String,
  price: Number,
  imageSrc: String
});

const sideDishSchema = new mongoose.Schema({
  title: String,
  price: Number,
  imageSrc: String
});

// Order Schema (new)
const orderSchema = new mongoose.Schema({
  customerEmail: String,
  items: [
    {
      title: String,
      quantity: Number,
      price: Number,
      specialInstructions: String
    }
  ],
  total: Number,
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now }
});

// Models
const Drink = mongoose.model('Drink', drinkSchema);
const MainDish = mongoose.model('MainDish', mainDishSchema);
const SideDish = mongoose.model('SideDish', sideDishSchema);
const Order = mongoose.model('Order', orderSchema);

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('Only PDFs are allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Existing routes (kept from your original code)
app.get('/api/drinks', async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.json(drinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/main-dishes', async (req, res) => {
  try {
    const mainDishes = await MainDish.find();
    res.json(mainDishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/side-dishes', async (req, res) => {
  try {
    const sideDishes = await SideDish.find();
    res.json(sideDishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// New route for sending order confirmation email
app.post('/api/send-order-email', upload.single('pdf'), async (req, res) => {
  try {
    const {
      customerEmail,
      items,
      total,
      paymentMethod
    } = req.body;

    // Validate input
    if (!customerEmail || !req.file) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Save order to database
    const newOrder = new Order({
      customerEmail,
      items: JSON.parse(items),
      total: parseFloat(total),
      paymentMethod
    });
    await newOrder.save();

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Your Order Confirmation from MaLoveTang',
      html: `
        <h1>Order Confirmation</h1>
        <p>Thank you for your purchase!</p>
        <p>Total Amount: $${total}</p>
        <p>Payment Method: ${paymentMethod}</p>
      `,
      attachments: [{
        filename: 'Receipt.pdf',
        content: req.file.buffer
      }]
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Order saved and email sent successfully',
      orderId: newOrder._id
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      message: 'Failed to send order email',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
