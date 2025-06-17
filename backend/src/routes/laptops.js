const express = require('express');
const router = express.Router();
const laptopService = require('../services/laptopService');
const asyncWrapper = require('../middleware/asyncWrapper');

// GET /api/laptops - Get all laptops or search
router.get('/', asyncWrapper(async (req, res) => {
  const laptops = await laptopService.searchLaptops(req.query);
  res.json(laptops);
}));

// GET /api/laptops/brands - Get available brands
router.get('/brands', asyncWrapper(async (req, res) => {
  const brands = await laptopService.getAvailableBrands();
  res.json(brands);
}));

// GET /api/laptops/categories - Get available categories
router.get('/categories', asyncWrapper(async (req, res) => {
  const categories = await laptopService.getAvailableCategories();
  res.json(categories);
}));

// GET /api/laptops/category/:category - Get laptops by category
router.get('/category/:category', asyncWrapper(async (req, res) => {
  const laptops = await laptopService.getLaptopsByCategory(req.params.category);
  res.json(laptops);
}));

// GET /api/laptops/brand/:brand - Get laptops by brand
router.get('/brand/:brand', asyncWrapper(async (req, res) => {
  const laptops = await laptopService.getLaptopsByBrand(req.params.brand);
  res.json(laptops);
}));

// GET /api/laptops/:id - Get specific laptop
router.get('/:id', asyncWrapper(async (req, res) => {
  const laptop = await laptopService.getLaptopById(req.params.id);
  res.json(laptop);
}));

module.exports = router;
