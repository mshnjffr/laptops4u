# Laptops4U E-commerce Store

A simple, elegant laptop e-commerce application built with Angular and Express.js. Browse premium laptops, add them to your cart, and place orders seamlessly.

## 🚀 Features

- **Browse Laptops** - View detailed laptop specifications and pricing
- **Shopping Cart** - Add/remove items with real-time cart updates
- **Order Placement** - Simple checkout process with order confirmation
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **No Authentication Required** - Quick and easy shopping experience

## 🏗️ Architecture

### Frontend (Angular 18+)
- **Framework**: Angular with TypeScript
- **Styling**: SCSS with responsive design
- **State Management**: Services with RxJS observables
- **Routing**: Angular Router for SPA navigation
- **HTTP Client**: Angular HttpClient for API communication

### Backend (Express.js)
- **Framework**: Node.js with Express.js
- **Database**: JSON file storage (development)
- **API**: RESTful endpoints
- **CORS**: Enabled for frontend communication

### Data Models
- **Laptops**: 5 premium laptop models with detailed specifications
- **Orders**: Order tracking with unique IDs and timestamps
- **Cart**: Local state management with persistence

## 📋 Sample Laptop Inventory

1. **MacBook Pro 14" M4** - $1,999
   - Apple M4 chip, 16GB memory, 512GB SSD, Liquid Retina XDR display

2. **Dell XPS 15 (2024)** - $1,799
   - Intel i7-13700H, 16GB DDR5, 1TB SSD, OLED 4K display, RTX 4060

3. **Lenovo ThinkPad X1 Carbon Gen 12** - $1,649
   - Intel i7-1365U, 16GB LPDDR5, 512GB SSD, WUXGA display

4. **ASUS ZenBook S16 (2024)** - $1,399
   - AMD Ryzen 7 8845HS, 16GB DDR5, 1TB SSD, OLED 3K touchscreen

5. **HP Spectre x360 14"** - $1,299
   - Intel i7-1355U, 16GB LPDDR5, 512GB SSD, OLED 2.8K convertible

**Images**: High-quality laptop photos from Unsplash (see [docs/IMAGE-SOURCES.md](docs/IMAGE-SOURCES.md))

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup
```bash
cd backend
npm install
npm start
```
Backend runs on: http://localhost:3000

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```
Frontend runs on: http://localhost:4200

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/laptops` | Get all laptops |
| GET | `/api/laptops/:id` | Get specific laptop |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/:id` | Get order details |

### Sample API Usage

**Get All Laptops:**
```bash
curl http://localhost:3000/api/laptops
```

**Create Order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"laptopId": "macbook-pro-14-m4", "quantity": 1, "price": 1999}
    ],
    "totalAmount": 1999
  }'
```

## 🎯 User Journey

1. **Browse** - User visits homepage and sees laptop grid
2. **Select** - User clicks on laptops to view details
3. **Add to Cart** - User adds desired laptops to cart
4. **Review Cart** - User reviews cart contents and quantities
5. **Place Order** - User clicks "Place Order" to complete purchase
6. **Confirmation** - User sees order success page with order ID

## 📱 Responsive Design

The application is fully responsive with:
- **Desktop**: Full grid layout with detailed laptop cards
- **Tablet**: Responsive grid with optimized card sizes
- **Mobile**: Stacked layout with touch-friendly interactions

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
ng test          # Unit tests
ng e2e           # End-to-end tests
ng build         # Production build test
```

### Backend Testing
```bash
cd backend
npm test         # Run test suite
npm run dev      # Development mode with nodemon
```

### Manual Testing Checklist
- [ ] Laptops load correctly from API
- [ ] Add to cart functionality works
- [ ] Cart counter updates in navigation
- [ ] Cart page shows correct items and totals
- [ ] Order placement creates order successfully
- [ ] Order success page displays order details
- [ ] Responsive design works on mobile/tablet

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend
ng build --configuration production

# Backend
cd backend
npm run build
```

### Environment Variables
Set these environment variables for production:

**Backend (.env):**
```
NODE_ENV=production
PORT=3000
API_URL=http://localhost:3000
```

**Frontend (environment.prod.ts):**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

## 📁 Project Structure

```
laptops4u/
├── frontend/                 # Angular application
│   ├── src/app/
│   │   ├── components/       # UI components
│   │   ├── services/         # Business logic
│   │   ├── models/           # TypeScript interfaces
│   │   └── app.routes.ts     # Route configuration
│   └── package.json
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   ├── models/           # Data models
│   │   └── data/             # JSON storage
│   └── package.json
├── docs/                     # Documentation
│   ├── Laptops4U-PRD.md     # Product Requirements
│   └── IMAGE-SOURCES.md      # Image sources info
└── README.md                 # This file
```

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start backend server |
| `npm run dev` | Start backend with nodemon |
| `ng serve` | Start frontend dev server |
| `ng build` | Build frontend for production |
| `ng test` | Run frontend unit tests |
---------------------------------------

**Happy Shopping with Laptops4U! 💻✨**
