const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Laptops4U API Server is running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💻 Laptops API: http://localhost:${PORT}/api/laptops`);
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`🌐 CORS enabled for: http://localhost:4200`);
});
