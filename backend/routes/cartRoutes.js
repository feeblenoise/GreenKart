// routes/cartRoute.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/CartModel');
const Product = require('../models/productModel');
const isLoggedIn = require('../middleware/auth');

// Add to cart
router.post('/add-to-cart/:productId', isLoggedIn, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.session.userId;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    let cart = await Cart.findOne({ userId });

    const item = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: parseInt(quantity),
      imageUrl: product.imageUrl
    };

    if (!cart) {
      cart = new Cart({
        userId,
        items: [item],
        totalPrice: item.price * item.quantity
      });
    } else {
      const existingItem = cart.items.find(i => i.productId.equals(product._id));
      if (existingItem) {
        existingItem.quantity += parseInt(quantity);
        existingItem.price += product.price * quantity;
      } else {
        cart.items.push(item);
      }

      cart.totalPrice = cart.items.reduce((sum, i) => sum + i.price, 0);
    }

    await cart.save();
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// View cart
router.get('/cart', isLoggedIn, async (req, res) => {
  const userId = req.session.userId;

  try {
    const cart = await Cart.findOne({ userId });
    res.render('carts.html', { cart });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
