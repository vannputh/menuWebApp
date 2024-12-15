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
mongoose.connect(process.env.MONGO_URI)
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

const orderSchema = new mongoose.Schema({
  customerEmail: String,
  customerName: String,
  items: [{
    title: String,
    quantity: Number,
    price: Number,
    specialInstructions: String
  }],
  total: Number,
  paymentMethod: String,
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

// Models
const Drink = mongoose.model('Drink', drinkSchema);
const MainDish = mongoose.model('MainDish', mainDishSchema);
const SideDish = mongoose.model('SideDish', sideDishSchema);
const Order = mongoose.model('Order', orderSchema);

// Routes
app.get('/drinks', async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.json(drinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/main-dishes', async (req, res) => {
  try {
    const mainDishes = await MainDish.find();
    res.json(mainDishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/side-dishes', async (req, res) => {
  try {
    const sideDishes = await SideDish.find();
    res.json(sideDishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.patch('/order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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


