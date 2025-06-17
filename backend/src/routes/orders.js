const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const asyncWrapper = require('../middleware/asyncWrapper');

// POST /api/orders - Create new order
router.post('/', asyncWrapper(async (req, res) => {
  const newOrder = await orderService.createOrder(req.body);
  res.status(201).json(newOrder);
}));

// GET /api/orders/:id - Get order details
router.get('/:id', asyncWrapper(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  res.json(order);
}));

// GET /api/orders/user/:userId - Get orders by user
router.get('/user/:userId', asyncWrapper(async (req, res) => {
  const orders = await orderService.getOrdersByUser(req.params.userId);
  res.json(orders);
}));

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', asyncWrapper(async (req, res) => {
  const updatedOrder = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.json(updatedOrder);
}));

// DELETE /api/orders/:id - Cancel order
router.delete('/:id', asyncWrapper(async (req, res) => {
  const cancelledOrder = await orderService.cancelOrder(req.params.id);
  res.json(cancelledOrder);
}));

module.exports = router;
