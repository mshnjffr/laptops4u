const LaptopModel = require('../models/laptop');
const { NotFoundError, ConflictError } = require('../utils/errors');

class InventoryService {
  /**
   * Check if laptop exists and is available
   * @param {string} laptopId - The laptop ID to check
   * @returns {Promise<Object>} The laptop data
   * @throws {NotFoundError} If laptop doesn't exist
   * @throws {ConflictError} If laptop is out of stock
   */
  async validateLaptopAvailability(laptopId) {
    const laptop = await LaptopModel.getLaptopById(laptopId);
    
    if (!laptop) {
      throw new NotFoundError(`Laptop with ID ${laptopId} not found`);
    }

    if (!laptop.inStock) {
      throw new ConflictError(`Laptop ${laptop.name} is out of stock`);
    }

    return laptop;
  }

  /**
   * Validate availability for multiple laptops
   * @param {Array} items - Array of order items with laptopId and quantity
   * @returns {Promise<Array>} Array of validated laptops with their data
   */
  async validateMultipleLaptopsAvailability(items) {
    const validatedLaptops = [];

    for (const item of items) {
      const laptop = await this.validateLaptopAvailability(item.laptopId);
      
      // Additional stock quantity check if laptop model supports it
      if (laptop.stockQuantity !== undefined && laptop.stockQuantity < item.quantity) {
        throw new ConflictError(
          `Insufficient stock for ${laptop.name}. Available: ${laptop.stockQuantity}, Requested: ${item.quantity}`
        );
      }

      validatedLaptops.push({
        ...laptop,
        requestedQuantity: item.quantity
      });
    }

    return validatedLaptops;
  }

  /**
   * Reserve inventory for order (placeholder for future implementation)
   * @param {Array} items - Array of order items
   * @returns {Promise<boolean>} Success status
   */
  async reserveInventory(items) {
    // TODO: Implement inventory reservation logic
    // This would typically involve:
    // 1. Creating inventory reservations
    // 2. Updating stock quantities
    // 3. Setting expiration times for reservations
    
    console.log('Inventory reserved for items:', items.map(item => ({
      laptopId: item.laptopId,
      quantity: item.quantity
    })));
    
    return true;
  }

  /**
   * Release reserved inventory (placeholder for future implementation)
   * @param {Array} items - Array of order items to release
   * @returns {Promise<boolean>} Success status
   */
  async releaseInventory(items) {
    // TODO: Implement inventory release logic
    console.log('Inventory released for items:', items);
    return true;
  }
}

module.exports = new InventoryService();