# Thailand Geodata examples

Example projects showing how to use the Thailand geodata in several languages. Each one loads, searches, and displays province, district, and sub-district data.

## Examples

### [Postal code lookup](./postal-lookup/)
[Live demo](https://dhanabhon.github.io/thailand-geodata/examples/postal-lookup/) — no installation needed

- Select province, district, and sub-district to look up a postal code
- Copy to clipboard with one click
- Mobile-responsive

### [Interactive web app](./web-app/)
[Live demo](https://dhanabhon.github.io/thailand-geodata/examples/web-app/) — no installation needed

- Real-time statistics and search
- Province, district, and sub-district drill-down
- Postal code lookup by sub-district name or by 5-digit code
- Mobile-responsive

### [Interactive map](./web-map/)
[Live demo](https://dhanabhon.github.io/thailand-geodata/examples/web-map/) — no installation needed

- Choropleth map of all 77 provinces, colored by district count
- Click a province to see its districts, sub-districts, and postal codes
- Thai/English tooltips with a language toggle

### [Python](./python/)
Requirements: Python 3.6+, pandas
```bash
cd python
pip install -r requirements.txt
python thailand_geodata.py
```

### [JavaScript/Node.js](./javascript/)
Requirements: Node.js 12.0.0+
```bash
cd javascript
npm start
```

### [Java](./java/)
Requirements: Java 11+, Maven 3.6+
```bash
cd java
mvn exec:java
```

### [Go](./go/)
Requirements: Go 1.19+
```bash
cd go
go run main.go
```

### [PHP](./php/)
Requirements: PHP 7.4+
```bash
cd php
php ThailandGeodata.php
```

### [C#](./csharp/)
Requirements: .NET 6.0+
```bash
cd csharp
dotnet run
```

## What each code example covers

All code examples (Python, JS, Java, Go, PHP, C#) demonstrate:

- Loading provinces, districts, and sub-districts from JSON/CSV
- Searching by Thai or English name
- Looking up a province by code
- Getting districts by province ID
- Basic counts and statistics
- Error handling

## Dataset

The dataset has 77 provinces, 928 districts, and 7,436 sub-districts.

### Data structure

Provinces:
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

Districts:
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

Sub-districts:
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

## Usage patterns

Loading data:
```python
# Python
geo = ThailandGeodata()
provinces = geo.load_provinces_json()
```

Searching:
```javascript
// JavaScript
const chiangProvinces = await geo.searchProvincesByName('เชียง', 'thai');
```

Hierarchical queries:
```java
// Java
List<JsonNode> bangkokDistricts = geo.getDistrictsByProvinceId(1);
```

## Contributing

To add a new language example:

1. Create a directory under `examples/[language]/`
2. Implement the features listed under "What each code example covers" above
3. Add build/dependency files
4. Create a README.md with setup and usage instructions
5. Update this file with the new entry

## Data source

Sourced from official Thai government databases. Each record has `CREATED_AT` and `UPDATED_AT` timestamps.
