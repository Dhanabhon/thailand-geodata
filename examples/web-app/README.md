# Thailand Geodata Web App

A modern, interactive web application for exploring Thailand's geodata including provinces, districts, and sub-districts. This app can run directly on GitHub Pages without any server setup.

## 🌐 Live Demo

**GitHub Pages URL:** `https://[username].github.io/thailand-geodata/examples/web-app/`

Replace `[username]` with your GitHub username.

## ✨ Features

### 📊 **Real-time Statistics**
- Live counts of provinces, districts, and sub-districts
- Animated counters and visual indicators

### 🔍 **Smart Search**
- Search provinces by Thai or English names
- Real-time filtering as you type
- Language toggle (Thai/English)
- Case-insensitive search

### 🗺️ **Interactive Province Explorer**
- Click any province to view detailed information
- See all districts within a selected province
- Visual highlighting of selected items
- Responsive grid layout

### ⭐ **Featured Provinces**
- Highlights major provinces (Bangkok, Chiang Mai, Phuket, Nakhon Ratchasima)
- Quick access to popular destinations
- Statistical overview for each featured province

### 📱 **Responsive Design**
- Works perfectly on desktop, tablet, and mobile
- Touch-friendly interface
- Optimized layouts for all screen sizes
- Progressive enhancement

### 🎨 **Modern UI/UX**
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Icon-rich interface with FontAwesome
- Loading indicators and toast notifications
- Clean, professional design

## 🚀 Setup Instructions

### Option 1: GitHub Pages (Recommended)

1. **Fork or clone this repository**
2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Set Source to "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder
   - Click Save

3. **Access your app:**
   - Visit: `https://[your-username].github.io/thailand-geodata/examples/web-app/`
   - It may take a few minutes to deploy

### Option 2: Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/[username]/thailand-geodata.git
   cd thailand-geodata/examples/web-app
   ```

2. **Serve locally:**
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. **Open browser:**
   - Visit: `http://localhost:8000`

## 🏗️ Architecture

### **Frontend Technologies**
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with Grid, Flexbox, and animations
- **Vanilla JavaScript**: ES6+ features, async/await, classes
- **FontAwesome**: Beautiful icons throughout the UI

### **Data Handling**
- **JSON API**: Loads data from repository's JSON files
- **Caching**: Client-side caching for better performance
- **Error Handling**: Graceful fallbacks and user feedback
- **Responsive Loading**: Adapts to different connection speeds

### **Key Components**

#### `ThailandGeodataApp` Class
```javascript
class ThailandGeodataApp {
    constructor()           // Initialize app
    async loadData()        // Fetch JSON data
    handleSearch(query)     // Filter provinces
    renderProvinces()       // Display province grid
    showProvinceDetails()   // Show selected province info
    setLanguage(lang)       // Switch Thai/English
}
```

#### **Data Flow**
1. App initializes and shows loading screen
2. Fetches provinces, districts, and sub-districts JSON
3. Renders statistics and province grid
4. User interactions trigger real-time updates
5. Selected data shows in details panel

## 📊 Data Structure

The app consumes the following JSON endpoints:

### **Provinces** (`/json/provinces.json`)
```json
{
  "provinces": [
    {
      "PROVINCE_ID": 1,
      "CODE": "10",
      "PROVINCE_THAI": "กรุงเทพมหานคร",
      "PROVINCE_ENGLISH": "Bangkok",
      "UPDATED_AT": "2024-10-22T08:21:23.000Z",
      "CREATED_AT": "2024-10-22T08:21:23.000Z"
    }
  ]
}
```

### **Districts** (`/json/districts.json`)
```json
{
  "districts": [
    {
      "DISTRICT_ID": 1,
      "PROVINCE_ID": 1,
      "CODE": "1001",
      "DISTRICT_THAI": "เขตพระนคร",
      "DISTRICT_ENGLISH": "Phra Nakhon"
    }
  ]
}
```

## 🎯 Usage Examples

### **Basic Search**
1. Type in the search box: "เชียง" or "Chiang"
2. See filtered results in real-time
3. Toggle between Thai/English names

### **Province Details**
1. Click any province card
2. View detailed information in the sidebar
3. See all districts for that province
4. Province gets highlighted across all sections

### **Featured Exploration**
1. Scroll to "Featured Provinces" section
2. Click on Bangkok, Chiang Mai, etc.
3. Instantly see their statistics and details

## 🔧 Customization

### **Adding More Featured Provinces**
Edit `app.js` line with `featuredCodes`:
```javascript
const featuredCodes = ['10', '50', '80', '30', '77']; // Add province codes
```

### **Changing Colors**
Edit `styles.css` CSS variables:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #ffd700;
}
```

### **Modifying Data Source**
Edit `app.js` `loadData()` method:
```javascript
const baseUrl = 'https://your-custom-api-endpoint.com/';
```

## 🌍 Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **Mobile Browsers**: iOS Safari 12+, Chrome Mobile 60+
- **Features Used**: ES6 Classes, Fetch API, CSS Grid, Flexbox

## 📈 Performance

### **Optimization Features**
- **Data Caching**: Prevents repeated API calls
- **Lazy Rendering**: Only renders visible content
- **Debounced Search**: Optimizes search performance
- **Compressed Assets**: Minified CSS/JS for production

### **Loading Times**
- **Initial Load**: ~2-3 seconds (depending on connection)
- **Search Results**: Instant (cached data)
- **Province Details**: Instant (cached data)

## 🔍 SEO & Accessibility

### **SEO Optimized**
- Semantic HTML structure
- Meta tags and descriptions
- Structured data for provinces
- Fast loading times

### **Accessibility Features**
- ARIA labels and roles
- Keyboard navigation support
- High contrast color ratios
- Screen reader friendly
- Focus management

## 🚀 Deployment Options

### **GitHub Pages** (Free)
- Automatic deployment from repository
- Custom domain support
- SSL certificate included
- Global CDN

### **Netlify** (Free tier)
- Drag & drop deployment
- Form handling capabilities
- Edge functions support
- Branch previews

### **Vercel** (Free tier)
- Instant deployments
- Automatic HTTPS
- Global edge network
- Analytics included

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test locally
4. Commit changes: `git commit -m "Add new feature"`
5. Push to branch: `git push origin feature/new-feature`
6. Submit a Pull Request

## 📝 License

This project is part of the Thailand Geodata repository. Please refer to the main repository's license.