const express = require('express');
const router = express.Router();
const OrderModel = require('../models/order');
const LaptopModel = require('../models/laptop');

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const { items } = req.body;
    
    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Items array is required and cannot be empty'
      });
    }

    // Validate each item and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.laptopId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          error: 'Bad request',
          message: 'Each item must have laptopId and positive quantity'
        });
      }

      // Check if laptop exists and is in stock
      const laptop = await LaptopModel.getLaptopById(item.laptopId);
      if (!laptop) {
        return res.status(404).json({
          error: 'Not found',
          message: `Laptop with ID ${item.laptopId} not found`
        });
      }

      if (!laptop.inStock) {
        return res.status(400).json({
          error: 'Out of stock',
          message: `Laptop ${laptop.name} is out of stock`
        });
      }

      const itemTotal = laptop.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        laptopId: item.laptopId,
        quantity: item.quantity,
        price: laptop.price
      });
    }

    // Create order
    const orderData = {
      items: validatedItems,
      totalAmount: totalAmount
    };

    const newOrder = await OrderModel.createOrder(orderData);
    
    res.status(201).json(newOrder);

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create order'
    });
  }
});

// GET /api/orders/:id - Get order details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Order not found'
      });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch order'
    });
  }
});

module.exports = router;
