const fs = require('fs').promises;
const path = require('path');
// Using built-in method for order ID generation

class OrderModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/orders.json');
  }

  async getAllOrders() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading orders data:', error);
      return [];
    }
  }

  async getOrderById(orderId) {
    try {
      const orders = await this.getAllOrders();
      return orders.find(order => order.orderId === orderId);
    } catch (error) {
      console.error('Error finding order:', error);
      return null;
    }
  }

  async createOrder(orderData) {
    try {
      const orders = await this.getAllOrders();
      
      const newOrder = {
        orderId: this.generateOrderId(),
        orderDate: new Date().toISOString(),
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        status: 'confirmed'
      };

      orders.push(newOrder);
      await fs.writeFile(this.dataPath, JSON.stringify(orders, null, 2));
      
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  generateOrderId() {
    // Generate a simple order ID (timestamp + random)
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
}

module.exports = new OrderModel();
