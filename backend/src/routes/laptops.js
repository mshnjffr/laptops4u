const express = require('express');
const router = express.Router();
const LaptopModel = require('../models/laptop');

// GET /api/laptops - Get all laptops
router.get('/', async (req, res) => {
  try {
    const laptops = await LaptopModel.getAllLaptops();
    res.json(laptops);
  } catch (error) {
    console.error('Error fetching laptops:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch laptops'
    });
  }
});

// GET /api/laptops/:id - Get specific laptop
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const laptop = await LaptopModel.getLaptopById(id);
    
    if (!laptop) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Laptop not found'
      });
    }
    
    res.json(laptop);
  } catch (error) {
    console.error('Error fetching laptop:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch laptop'
    });
  }
});

module.exports = router;
