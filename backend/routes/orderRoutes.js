// routes/orderRoutes.js
const express = require('express');

module.exports = function(db) {
  const router = express.Router();

  // GET all orders
  router.get('/', async (req, res) => {
    try {
      const orders = await db.collection('orders').find().toArray();
      const formattedOrders = orders.map(order => ({
        orderId: order.orderId,
        items: order.items || [],
        status: order.status || 'Pending'
      }));
      res.json(formattedOrders);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // POST a new order
  router.post('/add', async (req, res) => {
    const { items, status } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array' });
    }

    try {
      const newOrder = {
        items,
        status: status || 'Pending',
        createdAt: new Date()
      };
      const result = await db.collection('orders').insertOne(newOrder);
      res.status(201).json({ message: 'Order added', id: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add order' });
    }
  });

  return router;
};
