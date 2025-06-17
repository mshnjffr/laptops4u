const LaptopModel = require('../models/laptop');
const { NotFoundError, InternalServerError, ValidationError } = require('../utils/errors');

class LaptopService {
  /**
   * Get all laptops with optional filtering
   * @param {Object} filters - Optional filters (category, brand, price range, etc.)
   * @returns {Promise<Array>} Array of laptops
   */
  async getAllLaptops(filters = {}) {
    const laptops = await LaptopModel.getAllLaptops(filters);
    
    if (!laptops) {
      throw new InternalServerError('Failed to fetch laptops');
    }
    
    return laptops;
  }

  /**
   * Get laptop by ID
   * @param {string} laptopId - Laptop ID
   * @returns {Promise<Object>} Laptop data
   * @throws {ValidationError} If laptop ID is invalid
   * @throws {NotFoundError} If laptop doesn't exist
   */
  async getLaptopById(laptopId) {
    this.validateLaptopId(laptopId);
    
    const laptop = await LaptopModel.getLaptopById(laptopId);
    
    if (!laptop) {
      throw new NotFoundError('Laptop not found');
    }
    
    return laptop;
  }

  /**
   * Search laptops by criteria
   * @param {Object} searchCriteria - Search parameters
   * @returns {Promise<Array>} Array of matching laptops
   */
  async searchLaptops(searchCriteria) {
    const { query, category, brand, minPrice, maxPrice, inStock } = searchCriteria;
    
    const filters = {};
    
    if (query) filters.query = query;
    if (category) filters.category = category;
    if (brand) filters.brand = brand;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (inStock !== undefined) filters.inStock = inStock === 'true';
    
    return await this.getAllLaptops(filters);
  }

  /**
   * Get laptops by category
   * @param {string} category - Laptop category
   * @returns {Promise<Array>} Array of laptops in category
   */
  async getLaptopsByCategory(category) {
    if (!category || typeof category !== 'string') {
      throw new ValidationError('Category is required and must be a string');
    }
    
    return await this.getAllLaptops({ category });
  }

  /**
   * Get laptops by brand
   * @param {string} brand - Laptop brand
   * @returns {Promise<Array>} Array of laptops from brand
   */
  async getLaptopsByBrand(brand) {
    if (!brand || typeof brand !== 'string') {
      throw new ValidationError('Brand is required and must be a string');
    }
    
    return await this.getAllLaptops({ brand });
  }

  /**
   * Get available brands
   * @returns {Promise<Array>} Array of available brands
   */
  async getAvailableBrands() {
    const brands = await LaptopModel.getAvailableBrands();
    return brands || [];
  }

  /**
   * Get available categories
   * @returns {Promise<Array>} Array of available categories
   */
  async getAvailableCategories() {
    const categories = await LaptopModel.getAvailableCategories();
    return categories || [];
  }

  /**
   * Validate laptop ID format
   * @param {string} laptopId - Laptop ID to validate
   * @throws {ValidationError} If laptop ID is invalid
   */
  validateLaptopId(laptopId) {
    if (!laptopId || typeof laptopId !== 'string') {
      throw new ValidationError('Laptop ID is required and must be a string');
    }
    
    if (laptopId.trim().length === 0) {
      throw new ValidationError('Laptop ID cannot be empty');
    }
  }
}

module.exports = new LaptopService();