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

### 📮 **Postal Code Lookup**
- Find the postal code of any sub-district by Thai or English name
- Reverse-lookup: enter a 5-digit postal code (or prefix) to list all matching sub-districts
- Results show the full hierarchy: sub-district → district → province
- Click a result to jump straight to its province + district details and highlight the row
- Postal code is also displayed inline on every sub-district in the explorer
- Debounced input, capped result list with overflow note for fast feedback

### 🗺️ **Interactive Province Explorer**
- Click any province to view detailed information
- See all districts within a selected province
- Drill down further to view all sub-districts (with postal codes) for any district
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
    constructor()                    // Initialize app
    async loadData()                 // Fetch JSON data
    handleSearch(query)              // Filter provinces
    renderProvinces()                // Display province grid
    showProvinceDetails(province)    // Show selected province info
    showSubDistrictsForDistrict(d)   // Drill down into a district
    schedulePostalSearch(query)      // Debounce postal lookup
    runPostalSearch(query)           // Match by name or postal code
    findSubDistricts(query)          // Lookup helper
    openHierarchyForSubDistrict(id)  // Jump to result in main panel
    setLanguage(lang)                // Switch Thai/English
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

### **Sub-districts** (`/json/sub_districts.json`)
```json
{
  "sub_districts": [
    {
      "SUB_DISTRICT_ID": 1,
      "DISTRICT_ID": 1,
      "CODE": "01",
      "SUB_DISTRICT_CODE": "100101",
      "SUB_DISTRICT_THAI": "พระบรมมหาราชวัง",
      "SUB_DISTRICT_ENGLISH": "Phra Borom Maha Ratchawang",
      "LATITUDE": "13.751",
      "LONGITUDE": "100.492",
      "POSTAL_CODE": "10200"
    }
  ]
}
```

## 🎯 Usage Examples

### **Basic Search**
1. Type in the search box: "เชียง" or "Chiang"
2. See filtered results in real-time
3. Toggle between Thai/English names

### **Postal Code Lookup**
1. Scroll to the "Find Postal Code" section near the top
2. Type a sub-district name in Thai (e.g. `บางรัก`) or English (e.g. `Bang Rak`)
3. Or enter a 5-digit postal code such as `10500` to list every matching sub-district
4. Each result shows the postal code, district, and province
5. Click any result to jump to the full hierarchy in the explorer panel

### **Province Details**
1. Click any province card
2. View detailed information in the sidebar
3. See all districts for that province
4. Click a district to see its sub-districts with postal codes
5. Province gets highlighted across all sections

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