# Database of Thailand Geodata with Province, District, Sub-district, Postal code, and Geo
An open dataset of Thailand's administrative divisions and postal codes is freely available for research, analysis, and application development.

## Overview
Thailand Geodata is an open dataset that provides comprehensive geographic information on Thailand’s administrative divisions, including provinces, districts, sub-districts, and postal codes. This dataset is available in CSV, JSON, and SQL formats to facilitate a wide range of applications, including research, application development, geographic analysis, and public data services.

**This dataset includes:**

- Provinces: Names and codes for all provinces in Thailand.
- Districts and Sub-districts: Names and codes for districts and sub-districts, enabling easy hierarchical organization.
- Postal Codes: Standardized postal codes for each sub-district.

**Data Formats:**

- CSV: Ideal for spreadsheet applications and data analysis.
- JSON: Suitable for web applications and APIs.
- SQL: Ready to be imported directly into databases for system integration.

Thailand Geodata is designed to support developers, researchers, and the general public, enabling diverse uses such as application development, regional mapping, and spatial analysis of Thailand.

## 🚀 Examples and Live Demo

### 🌐 **Interactive Web App** ⭐ **NEW!**
**Try it now:** [GitHub Pages Demo](https://[username].github.io/thailand-geodata/examples/web-app/)

- 📊 Real-time statistics and search functionality
- 🗺️ Interactive province explorer with detailed information
- 📱 Mobile-responsive design for all devices
- ⚡ Runs directly on GitHub Pages - no installation required

### 💻 **Multi-Language Code Examples**
Ready-to-use examples in [examples/](./examples/):
- **Python** - Data analysis with pandas
- **JavaScript/Node.js** - For web apps and APIs
- **Java** - With Maven and JSON processing
- **Go** - High performance with built-in JSON handling
- **PHP** - For websites with CSV export functionality
- **C#** - .NET 6 with async/await patterns

Each example includes:
- ✅ Detailed setup and usage documentation
- ✅ Ready-to-run code with proper error handling
- ✅ Search, filtering, and data display features

## File Structure and Data Fields
The Thailand Geodata dataset includes multiple formats: CSV, JSON, and SQL, each with structured fields to facilitate easy use and integration. Here’s an overview of the main fields in each file format:

**1. CSV Files**
   - Key Fields:
     - `PROVINCE_ID`: Unique ID for each province
     - `CODE`: Unique code for each province
     - `PROVINCE_THAI` and `PROVINCE_ENGLISH`: Province names in Thai and English
     - `UPDATED_AT`: Timestamp indicating when the record was last updated
     - `CREATED_AT`: Timestamp indicating when the record was created
  
**2. JSON Files**
  - The JSON structure is hierarchical, making it easy to access data at each level:

```json
{
    "PROVINCE_ID": "Province unique ID",
    "CODE": "Province unique code",
    "PROVINCE_THAI": "Province name in Thai",
    "PROVINCE_ENGLISH": "Province name in English",
    "UPDATED_AT": "Last update timestamp",
    "CREATED_AT": "Creation timestamp"
}
```

**3. SQL Files**

- The SQL file includes commands for creating and populating database tables:
  
  - Table Structure:
    - `Provinces`: Stores province data
    - `Districts`: Stores district data
    - `Sub_Districts`: Stores sub-district data with postal codes

  - Key Fields:
    - `PROVINCE_ID`, `CODE`, `PROVINCE_THAI`, `PROVINCE_ENGLISH`, `UPDATED_AT`, `CREATED_AT`
    - `DISTRICT_ID`, `PROVINCE_ID`, `CODE`, `DISTRICT_CODE`, `DISTRICT_THAI`, `PROVINCE_ENGLISH`, `UPDATED_AT`, `CREATED_AT`
    - `SUB_DISTRICT_ID`, `DISTRICT_ID`, `CODE`, `SUB_DISTRICT_CODE`, `SUB_DISTRICT_THAI`, `SUB_DISTRICT_ENGLISH`, `LATITUDE`, `LONGITUDE`, `POSTAL_CODE`, `UPDATED_AT`, `CREATED_AT`
   
Including the `CREATED_AT` and `UPDATED_AT` fields helps track changes and manage data updates effectively.

## ER Diagram
![ER Diagram](/er-diagram/er-diagram.png)

## Contribution Guidelines
Thank you for being so interested in contributing to Thailand Geodata! Here’s how to get involved:

1. **Report Issues**: If you find any errors or have suggestions, open an issue with details.
2. **Make Changes**: Fork the repo, create a branch, make your updates, and open a pull request (PR) to the main branch. Please follow existing data formats.

By contributing, you agree to license your contributions under the same terms as this project.

We appreciate your help in making this dataset a valuable public resource!
