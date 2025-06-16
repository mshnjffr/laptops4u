# Image Sources for Laptops4U

## Laptop Images Used

All laptop images in the Laptops4U application are sourced from **Unsplash**, a platform providing high-quality, free-to-use photos. These images are used under Unsplash's license which allows free commercial and non-commercial use.

### Primary Laptop Images

1. **Main Laptop Image**: `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&crop=center`
   - **Description**: Modern silver laptop on a clean desk setup
   - **Photographer**: Ales Nesetril
   - **Original**: https://unsplash.com/photos/Im7lZjxeLhg

2. **Secondary Laptop Image**: `https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop&crop=center`
   - **Description**: Professional laptop workspace with coffee
   - **Used for**: Alternative angle views

3. **Tertiary Laptop Image**: `https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop&crop=center`
   - **Description**: Clean minimalist laptop setup
   - **Used for**: Additional product views

### Image Specifications

- **Dimensions**: 800x600 pixels
- **Format**: JPEG
- **Optimization**: Cropped and resized via Unsplash's URL parameters
- **Quality**: High-resolution, professional photography
- **Loading**: Fast CDN delivery via Unsplash's Imgix integration

### URL Parameters Used

- `w=800` - Width of 800 pixels
- `h=600` - Height of 600 pixels  
- `fit=crop` - Crop to exact dimensions
- `crop=center` - Center the crop area

### License Information

All images are used under the **Unsplash License**:
- ✅ Free for commercial and non-commercial use
- ✅ No attribution required (but appreciated)
- ✅ Can be modified and distributed
- ✅ Suitable for web applications

### Fallback Strategy

The application implements a fallback strategy where if any laptop image fails to load, it will default to the main laptop image URL. This ensures consistent user experience even if individual image URLs become unavailable.

### Performance Benefits

- **CDN Delivery**: Fast loading via Unsplash's global CDN
- **Optimized Size**: Automatically compressed and sized
- **Browser Caching**: Long cache headers for improved performance
- **Responsive**: URL parameters allow for different sizes if needed

### Usage in Application

```javascript
// Primary image usage in components
const laptopImage = laptop.images[0] || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&crop=center';
```

All laptops use the same set of professional laptop images to maintain visual consistency across the store while still providing variety through multiple angles and views.
