const OrderModel = require('../models/order');
const orderValidationService = require('./orderValidationService');
const inventoryService = require('./inventoryService');
const orderCalculationService = require('./orderCalculationService');
const { InternalServerError, NotFoundError } = require('../utils/errors');

class OrderService {
  /**
   * Create a new order
   * @param {Object} orderData - Order data from request
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    try {
      // Step 1: Validate order request
      orderValidationService.validateOrderRequest(orderData);

      // Step 2: Validate inventory availability
      const validatedLaptops = await inventoryService.validateMultipleLaptopsAvailability(orderData.items);

      // Step 3: Calculate order totals
      const calculations = orderCalculationService.calculateOrderTotal(validatedLaptops);

      // Step 4: Prepare order data for database
      const processedOrderData = this.prepareOrderData(orderData, calculations);

      // Step 5: Reserve inventory (if implemented)
      await inventoryService.reserveInventory(orderData.items);

      // Step 6: Create order in database
      const newOrder = await OrderModel.createOrder(processedOrderData);
      
      if (!newOrder) {
        throw new InternalServerError('Failed to create order in database');
      }

      // Step 7: Return enriched order data
      return this.enrichOrderResponse(newOrder, calculations);

    } catch (error) {
      // Rollback inventory reservation on failure
      try {
        await inventoryService.releaseInventory(orderData.items);
      } catch (rollbackError) {
        console.error('Failed to rollback inventory reservation:', rollbackError);
      }
      
      // Re-throw the original error
      throw error;
    }
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order data
   */
  async getOrderById(orderId) {
    orderValidationService.validateOrderId(orderId);
    
    const order = await OrderModel.getOrderById(orderId);
    
    if (!order) {
      throw new NotFoundError(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  /**
   * Get orders by user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of orders
   */
  async getOrdersByUser(userId) {
    if (!userId || typeof userId !== 'string') {
      throw new ValidationError('User ID is required and must be a string');
    }

    const orders = await OrderModel.getOrdersByUser(userId);
    return orders || [];
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(orderId, status) {
    orderValidationService.validateOrderId(orderId);
    
    if (!status || typeof status !== 'string') {
      throw new ValidationError('Status is required and must be a string');
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Check if order exists
    await this.getOrderById(orderId);
    
    const updatedOrder = await OrderModel.updateOrderStatus(orderId, status.toLowerCase());
    
    if (!updatedOrder) {
      throw new InternalServerError('Failed to update order status');
    }

    return updatedOrder;
  }

  /**
   * Cancel order
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Cancelled order
   */
  async cancelOrder(orderId) {
    orderValidationService.validateOrderId(orderId);
    
    const order = await this.getOrderById(orderId);
    
    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.status)) {
      throw new ConflictError(`Cannot cancel order with status: ${order.status}`);
    }

    try {
      // Release inventory
      await inventoryService.releaseInventory(order.items);
      
      // Cancel order in database
      const cancelledOrder = await OrderModel.cancelOrder(orderId);
      
      if (!cancelledOrder) {
        throw new InternalServerError('Failed to cancel order');
      }

      return cancelledOrder;
    } catch (error) {
      console.error('Error during order cancellation:', error);
      throw error;
    }
  }

  /**
   * Prepare order data for database storage
   * @param {Object} originalOrderData - Original order data
   * @param {Object} calculations - Order calculations
   * @returns {Object} Processed order data
   */
  prepareOrderData(originalOrderData, calculations) {
    return {
      items: calculations.itemCalculations.map(calc => ({
        laptopId: calc.laptopId,
        quantity: calc.quantity,
        unitPrice: calc.unitPrice,
        itemTotal: calc.itemTotal
      })),
      subtotal: calculations.subtotal,
      taxAmount: calculations.taxAmount,
      shippingCost: calculations.shippingCost,
      totalAmount: calculations.totalAmount,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      // Add any additional fields from originalOrderData if needed
      ...this.extractAdditionalOrderFields(originalOrderData)
    };
  }

  /**
   * Extract additional order fields (customer info, shipping address, etc.)
   * @param {Object} orderData - Original order data
   * @returns {Object} Additional fields
   */
  extractAdditionalOrderFields(orderData) {
    const additionalFields = {};
    
    // Extract customer information if provided
    if (orderData.customerInfo) {
      additionalFields.customerInfo = orderData.customerInfo;
    }
    
    // Extract shipping information if provided
    if (orderData.shippingAddress) {
      additionalFields.shippingAddress = orderData.shippingAddress;
    }
    
    // Extract payment information if provided
    if (orderData.paymentMethod) {
      additionalFields.paymentMethod = orderData.paymentMethod;
    }

    // Extract notes if provided
    if (orderData.notes) {
      additionalFields.notes = orderData.notes;
    }

    return additionalFields;
  }

  /**
   * Enrich order response with additional data
   * @param {Object} order - Order from database
   * @param {Object} calculations - Order calculations
   * @returns {Object} Enriched order response
   */
  enrichOrderResponse(order, calculations) {
    return {
      ...order,
      calculationDetails: {
        itemBreakdown: calculations.itemCalculations,
        taxRate: calculations.taxRate,
        shippingDetails: {
          cost: calculations.shippingCost,
          freeShippingThreshold: 1000
        }
      },
      metadata: {
        createdAt: order.createdAt,
        updatedAt: order.updatedAt || order.createdAt,
        version: '1.0'
      }
    };
  }
}

module.exports = new OrderService();