# Thailand Geodata Examples

This directory contains example projects demonstrating how to use the Thailand geodata in various popular programming languages. Each example shows how to load, search, and manipulate the province, district, and sub-district data.

## Available Examples

### 🌐 [Interactive Web App](./web-app/)
**Live Demo:** [GitHub Pages](https://dhanabhon.github.io/thailand-geodata/examples/web-app/)
**Requirements:** Modern web browser (no installation needed)
- 📊 Real-time statistics and search
- 🗺️ Interactive province → district → sub-district drill-down
- 📮 Postal code lookup (by sub-district name or postal code)
- 📱 Mobile-responsive design
- ⚡ Runs directly on GitHub Pages

### 🗺️ [Interactive Map](./web-map/) ⭐ **NEW!**
**Live Demo:** [GitHub Pages](https://dhanabhon.github.io/thailand-geodata/examples/web-map/)
**Requirements:** Modern web browser (no installation needed)
- 🎨 Choropleth map of all 77 provinces, colored by district count
- 🖱️ Click a province to see districts, sub-districts, and every postal code
- 🌐 Thai/English tooltips and labels
- 🧭 Powered by Leaflet + `apisit/thailand.json` boundaries

### 🐍 [Python](./python/)
**Requirements:** Python 3.6+, pandas
```bash
cd python
pip install -r requirements.txt
python thailand_geodata.py
```

### 🟨 [JavaScript/Node.js](./javascript/)
**Requirements:** Node.js 12.0.0+
```bash
cd javascript
npm start
```

### ☕ [Java](./java/)
**Requirements:** Java 11+, Maven 3.6+
```bash
cd java
mvn exec:java
```

### 🐹 [Go](./go/)
**Requirements:** Go 1.19+
```bash
cd go
go run main.go
```

### 🐘 [PHP](./php/)
**Requirements:** PHP 7.4+
```bash
cd php
php ThailandGeodata.php
```

### 🔷 [C#](./csharp/)
**Requirements:** .NET 6.0+
```bash
cd csharp
dotnet run
```

## Common Features

All examples demonstrate the following functionality:

- ✅ **Load Data**: Read provinces, districts, and sub-districts from JSON/CSV files
- ✅ **Search by Name**: Find provinces by Thai or English names
- ✅ **Get by Code**: Retrieve province information by code
- ✅ **Hierarchical Data**: Get districts by province ID
- ✅ **Statistics**: Basic data statistics (counts)
- ✅ **Error Handling**: Proper error handling and validation
- ✅ **Performance**: Caching mechanisms for better performance

## Dataset Overview

The Thailand geodata contains:
- **77 Provinces** (จังหวัด)
- **900+ Districts** (อำเภอ/เขต)
- **7,000+ Sub-districts** (ตำบล/แขวง)

### Data Structure

#### Provinces
```json
{
  "PROVINCE_ID": 1,
  "CODE": "10",
  "PROVINCE_THAI": "กรุงเทพมหานคร",
  "PROVINCE_ENGLISH": "Bangkok",
  "UPDATED_AT": "2024-10-22T08:21:23.000Z",
  "CREATED_AT": "2024-10-22T08:21:23.000Z"
}
```

#### Districts
```json
{
  "DISTRICT_ID": 1,
  "PROVINCE_ID": 1,
  "CODE": "1001",
  "DISTRICT_THAI": "เขตพระนคร",
  "DISTRICT_ENGLISH": "Phra Nakhon",
  "UPDATED_AT": "2024-10-22T08:21:23.000Z",
  "CREATED_AT": "2024-10-22T08:21:23.000Z"
}
```

#### Sub-districts
```json
{
  "SUB_DISTRICT_ID": 1,
  "DISTRICT_ID": 1,
  "CODE": "100101",
  "SUB_DISTRICT_THAI": "แขวงพระบรมมหาราชวัง",
  "SUB_DISTRICT_ENGLISH": "Phra Borom Maha Ratchawang",
  "UPDATED_AT": "2024-10-22T08:21:23.000Z",
  "CREATED_AT": "2024-10-22T08:21:23.000Z"
}
```

## Example Output

All examples produce similar output:

```
🇹🇭 Thailand Geodata [Language] Example
========================================
📊 Data Statistics:
   Provinces: 77
   Districts: 928
   Sub-districts: 7,436

🏛️  Bangkok Information:
   Thai: กรุงเทพมหานคร
   English: Bangkok
   Code: 10

🔍 Provinces containing 'เชียง': 2
   - เชียงใหม่ (Chiang Mai)
   - เชียงราย (Chiang Rai)

🏙️  Bangkok has 50 districts
   - เขตพระนคร (Phra Nakhon)
   - เขตดุสิต (Dusit)
   - เขตหนองจอก (Nong Chok)
   - เขตบางรัก (Bang Rak)
   - เขตบางเขน (Bang Khen)
   ... and 45 more districts
```

## Usage Patterns

### Basic Data Loading
```python
# Python example
geo = ThailandGeodata()
provinces = geo.load_provinces_json()
```

### Search and Filter
```javascript
// JavaScript example
const chiangProvinces = await geo.searchProvincesByName('เชียง', 'thai');
```

### Hierarchical Queries
```java
// Java example
List<JsonNode> bangkokDistricts = geo.getDistrictsByProvinceId(1);
```

## Performance Considerations

- **Caching**: All examples implement caching to avoid repeated file reads
- **Lazy Loading**: Data is loaded only when needed
- **Memory Efficiency**: Efficient data structures for large datasets
- **Error Handling**: Robust error handling for missing files or invalid data

## Contributing

To add a new language example:

1. Create a new directory under `examples/[language]/`
2. Implement the common features listed above
3. Follow the naming conventions and output format
4. Add appropriate build/dependency files
5. Create a README.md with setup and usage instructions
6. Update this main README with the new example

## Data Source

The geodata is sourced from official Thai government databases and is regularly updated. Each record includes timestamps for tracking changes.