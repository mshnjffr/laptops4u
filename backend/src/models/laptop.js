const fs = require('fs').promises;
const path = require('path');

class LaptopModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/laptops.json');
  }

  async getAllLaptops() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading laptops data:', error);
      return [];
    }
  }

  async getLaptopById(id) {
    try {
      const laptops = await this.getAllLaptops();
      return laptops.find(laptop => laptop.id === id);
    } catch (error) {
      console.error('Error finding laptop:', error);
      return null;
    }
  }

  async isLaptopInStock(id) {
    try {
      const laptop = await this.getLaptopById(id);
      return laptop ? laptop.inStock : false;
    } catch (error) {
      console.error('Error checking stock:', error);
      return false;
    }
  }
}

module.exports = new LaptopModel();
