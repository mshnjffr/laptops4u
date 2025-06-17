const { ValidationError } = require('../utils/errors');

class OrderValidationService {
  /**
   * Validate order request body
   * @param {Object} orderData - The order data to validate
   * @throws {ValidationError} If validation fails
   */
  validateOrderRequest(orderData) {
    const { items } = orderData;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Items array is required and cannot be empty');
    }

    this.validateOrderItems(items);
  }

  /**
   * Validate individual order items
   * @param {Array} items - Array of order items
   * @throws {ValidationError} If any item is invalid
   */
  validateOrderItems(items) {
    for (const [index, item] of items.entries()) {
      this.validateOrderItem(item, index);
    }
  }

  /**
   * Validate a single order item
   * @param {Object} item - The order item to validate
   * @param {number} index - Item index for error reporting
   * @throws {ValidationError} If item is invalid
   */
  validateOrderItem(item, index) {
    if (!item.laptopId) {
      throw new ValidationError(`Item at index ${index}: laptopId is required`);
    }

    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new ValidationError(`Item at index ${index}: quantity must be a positive number`);
    }

    if (!Number.isInteger(item.quantity)) {
      throw new ValidationError(`Item at index ${index}: quantity must be a whole number`);
    }

    if (item.quantity > 100) {
      throw new ValidationError(`Item at index ${index}: quantity cannot exceed 100 items`);
    }
  }

  /**
   * Validate order ID format
   * @param {string} orderId - The order ID to validate
   * @throws {ValidationError} If order ID is invalid
   */
  validateOrderId(orderId) {
    if (!orderId || typeof orderId !== 'string') {
      throw new ValidationError('Order ID is required and must be a string');
    }

    if (orderId.trim().length === 0) {
      throw new ValidationError('Order ID cannot be empty');
    }
  }
}

module.exports = new OrderValidationService();