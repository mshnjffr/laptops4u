# Laptops4U E-commerce Store - Product Requirements Document

## Overview
Laptops4U is a simple, streamlined laptop e-commerce web application built with Angular frontend and Express.js backend. The store focuses on a minimal user experience without authentication requirements.

## Business Requirements

### Core Features
1. **Browse Laptops** - Display all available laptops with details
2. **Shopping Cart** - Add/remove items and view cart contents
3. **Order Placement** - Complete purchase with order confirmation

### Non-Requirements
- User registration/login system
- Payment processing integration
- User profiles or order history
- Complex inventory management

## Technical Architecture

### Frontend (Angular 18+)
**Technology Stack:**
- Angular 18+ with TypeScript
- Angular Router for navigation
- Angular HttpClient for API communication
- Angular Material or Bootstrap for UI components
- RxJS for reactive programming

**Components Structure:**
```
src/app/
├── components/
│   ├── laptop-list/          # Browse all laptops
│   ├── laptop-card/          # Individual laptop display
│   ├── cart/                 # Shopping cart view
│   ├── cart-item/            # Individual cart item
│   └── order-success/        # Order confirmation
├── services/
│   ├── laptop.service.ts     # Laptop data management
│   ├── cart.service.ts       # Cart state management
│   └── order.service.ts      # Order processing
├── models/
│   ├── laptop.model.ts       # Laptop interface
│   ├── cart-item.model.ts    # Cart item interface
│   └── order.model.ts        # Order interface
└── app-routing.module.ts     # Route configuration
```

**Routing:**
- `/` - Home/Laptop listing page
- `/laptops` - Laptop browse page (alternative route)
- `/cart` - Shopping cart page
- `/order-success` - Order confirmation page

### Backend (Express.js)
**Technology Stack:**
- Node.js with Express.js framework
- JSON file or SQLite for simple data storage
- CORS middleware for frontend communication
- Express.json middleware for request parsing

**API Endpoints:**
```
GET    /api/laptops           # Get all laptops
GET    /api/laptops/:id       # Get specific laptop
POST   /api/orders            # Create new order
GET    /api/orders/:id        # Get order details (optional)
```

**Project Structure:**
```
backend/
├── src/
│   ├── routes/
│   │   ├── laptops.js        # Laptop routes
│   │   └── orders.js         # Order routes
│   ├── models/
│   │   ├── laptop.js         # Laptop data model
│   │   └── order.js          # Order data model
│   ├── data/
│   │   ├── laptops.json      # Laptop inventory
│   │   └── orders.json       # Orders storage
│   └── app.js                # Express app configuration
├── package.json
└── server.js                 # Server entry point
```

### Database (Simple File Storage)
**Data Storage:**
- JSON files for development simplicity
- `laptops.json` - Static laptop inventory
- `orders.json` - Order records

**Laptop Data Model:**
```json
{
  "id": "string",
  "name": "string",
  "brand": "string",
  "model": "string",
  "price": "number",
  "currency": "string",
  "description": "string",
  "specifications": {
    "processor": "string",
    "memory": "string",
    "storage": "string",
    "display": "string",
    "graphics": "string",
    "os": "string"
  },
  "images": ["string"],
  "inStock": "boolean",
  "category": "string"
}
```

**Order Data Model:**
```json
{
  "orderId": "string",
  "orderDate": "string",
  "items": [
    {
      "laptopId": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "totalAmount": "number",
  "status": "string"
}
```

## User Experience Flow

### 1. Browse Laptops
- **User Action:** Visits homepage
- **System Response:** Displays grid of available laptops
- **Data Flow:** Frontend → GET /api/laptops → Backend → Display laptops

### 2. Add to Cart
- **User Action:** Clicks "Add to Cart" on laptop
- **System Response:** Updates cart counter, shows confirmation
- **Data Flow:** Frontend cart service updates local state

### 3. View Cart
- **User Action:** Clicks cart icon/link
- **System Response:** Shows cart items with quantities and total
- **Data Flow:** Frontend displays local cart state

### 4. Place Order
- **User Action:** Clicks "Place Order" from cart
- **System Response:** Processes order, shows confirmation
- **Data Flow:** Frontend → POST /api/orders → Backend → Order confirmation

## Sample Data

### Laptop Inventory (Initial Dataset)
Based on current market research, include popular 2024-2025 models:

1. **MacBook Pro 14" M4** - $1,999
   - Processor: Apple M4 chip
   - Memory: 16GB unified memory
   - Storage: 512GB SSD
   - Display: 14.2" Liquid Retina XDR

2. **Dell XPS 15 (2024)** - $1,799
   - Processor: Intel Core i7-13700H
   - Memory: 16GB DDR5
   - Storage: 1TB SSD
   - Display: 15.6" OLED 4K

3. **Lenovo ThinkPad X1 Carbon Gen 12** - $1,649
   - Processor: Intel Core i7-1365U
   - Memory: 16GB LPDDR5
   - Storage: 512GB SSD
   - Display: 14" WUXGA

4. **ASUS ZenBook S16 (2024)** - $1,399
   - Processor: AMD Ryzen 7 8845HS
   - Memory: 16GB DDR5
   - Storage: 1TB SSD
   - Display: 16" OLED 3K

5. **HP Spectre x360 14"** - $1,299
   - Processor: Intel Core i7-1355U
   - Memory: 16GB LPDDR5
   - Storage: 512GB SSD
   - Display: 14" OLED touchscreen

## Implementation Plan

### Phase 1: Setup and Basic Structure
1. Initialize Angular project with routing
2. Set up Express.js backend with basic API
3. Create laptop data model and sample data
4. Implement laptop listing functionality

### Phase 2: Core Features
1. Build laptop browsing component
2. Implement cart service and cart component
3. Create order processing API endpoint
4. Build order confirmation page

### Phase 3: Integration and Polish
1. Connect frontend to backend APIs
2. Add error handling and loading states
3. Implement responsive design
4. Add basic styling and UX improvements

### Phase 4: Testing and Deployment
1. Add unit tests for core functionality
2. Test end-to-end user flows
3. Optimize performance
4. Prepare for deployment

## Success Criteria
- Users can browse available laptops
- Users can add/remove items from cart
- Users can place orders successfully
- Orders are stored and can be retrieved
- Application is responsive and user-friendly
- No authentication barriers for basic shopping

## Development Guidelines
- Use Angular best practices (services, components, routing)
- Follow Express.js conventions for API design
- Implement proper error handling
- Use TypeScript for type safety
- Keep code modular and maintainable
- Focus on simplicity over complexity

## Future Enhancements (Out of Scope)
- User authentication system
- Payment integration
- Product reviews and ratings
- Advanced search and filtering
- Admin panel for inventory management
- Order tracking system
