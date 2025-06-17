class OrderCalculationService {
  /**
   * Calculate total amount for order items
   * @param {Array} items - Array of items with laptop data and quantities
   * @returns {Object} Calculation results
   */
  calculateOrderTotal(items) {
    let subtotal = 0;
    const itemCalculations = [];

    for (const item of items) {
      const itemTotal = this.calculateItemTotal(item.laptop.price, item.requestedQuantity);
      subtotal += itemTotal;

      itemCalculations.push({
        laptopId: item.laptop.id,
        laptopName: item.laptop.name,
        unitPrice: item.laptop.price,
        quantity: item.requestedQuantity,
        itemTotal: itemTotal
      });
    }

    const taxRate = this.getTaxRate();
    const taxAmount = this.calculateTax(subtotal, taxRate);
    const shippingCost = this.calculateShipping(items);
    const totalAmount = subtotal + taxAmount + shippingCost;

    return {
      itemCalculations,
      subtotal: this.roundToTwoDecimals(subtotal),
      taxRate,
      taxAmount: this.roundToTwoDecimals(taxAmount),
      shippingCost: this.roundToTwoDecimals(shippingCost),
      totalAmount: this.roundToTwoDecimals(totalAmount)
    };
  }

  /**
   * Calculate total for a single item
   * @param {number} unitPrice - Price per unit
   * @param {number} quantity - Quantity ordered
   * @returns {number} Item total
   */
  calculateItemTotal(unitPrice, quantity) {
    return unitPrice * quantity;
  }

  /**
   * Calculate tax amount
   * @param {number} subtotal - Subtotal before tax
   * @param {number} taxRate - Tax rate (e.g., 0.08 for 8%)
   * @returns {number} Tax amount
   */
  calculateTax(subtotal, taxRate) {
    return subtotal * taxRate;
  }

  /**
   * Calculate shipping cost based on order items
   * @param {Array} items - Array of order items
   * @returns {number} Shipping cost
   */
  calculateShipping(items) {
    const totalQuantity = items.reduce((sum, item) => sum + item.requestedQuantity, 0);
    const subtotal = items.reduce((sum, item) => 
      sum + (item.laptop.price * item.requestedQuantity), 0
    );

    // Free shipping for orders over $1000
    if (subtotal >= 1000) {
      return 0;
    }

    // Base shipping cost
    let shippingCost = 15;

    // Additional cost for multiple items
    if (totalQuantity > 1) {
      shippingCost += (totalQuantity - 1) * 5;
    }

    // Cap maximum shipping cost
    return Math.min(shippingCost, 50);
  }

  /**
   * Get current tax rate
   * @returns {number} Tax rate
   */
  getTaxRate() {
    // This could be configurable or location-based
    return 0.08; // 8% tax rate
  }

  /**
   * Round number to two decimal places
   * @param {number} number - Number to round
   * @returns {number} Rounded number
   */
  roundToTwoDecimals(number) {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  }

  /**
   * Apply discount to order (placeholder for future implementation)
   * @param {number} subtotal - Order subtotal
   * @param {string} discountCode - Discount code
   * @returns {Object} Discount information
   */
  applyDiscount(subtotal, discountCode) {
    // TODO: Implement discount logic
    return {
      discountCode: null,
      discountAmount: 0,
      discountPercentage: 0
    };
  }
}

module.exports = new OrderCalculationService();