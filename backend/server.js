const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/restaurant')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

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

const Drink = mongoose.model('Drink', drinkSchema);
const MainDish = mongoose.model('MainDish', mainDishSchema);
const SideDish = mongoose.model('SideDish', sideDishSchema);

app.get('/api/drinks', async (req, res) => {
  try {
    const drinks = await Drink.find();
    console.log('Fetched drinks:', drinks);
    res.json(drinks);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/main-dishes', async (req, res) => {
  try {
    const mainDishes = await MainDish.find();
    console.log('Fetched main dishes:', mainDishes);
    res.json(mainDishes);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/side-dishes', async (req, res) => {
  try {
    const sideDishes = await SideDish.find();
    console.log('Fetched side dishes:', sideDishes);
    res.json(sideDishes);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
