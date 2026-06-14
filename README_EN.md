# Database of Thailand Geodata with Province, District, Sub-district, Postal code, and Geo
An open dataset of Thailand's administrative divisions and postal codes, available for research, analysis, and application development.

## Overview
Thailand Geodata is an open dataset covering Thailand's administrative divisions: provinces, districts, sub-districts, and postal codes. It comes in CSV, JSON, and SQL formats.

This dataset includes:

- Provinces: names and codes for all provinces in Thailand
- Districts and sub-districts: names and codes, organized hierarchically
- Postal codes: standardized codes for each sub-district

Data formats:

- CSV: for spreadsheet applications and data analysis
- JSON: for web applications and APIs
- SQL: for direct database import

## Examples and live demo

### Interactive web app
[GitHub Pages Demo](https://dhanabhon.github.io/thailand-geodata/examples/web-app/)

- Real-time statistics and search
- Province, district, and sub-district drill-down
- Postal code lookup by sub-district name (Thai or English) or by 5-digit code
- Mobile-responsive
- Runs on GitHub Pages with no installation

### Interactive map
[GitHub Pages Demo](https://dhanabhon.github.io/thailand-geodata/examples/web-map/)

- Choropleth map of all 77 provinces, colored by district count
- Click any province to see its districts, sub-districts, and all postal codes
- Thai/English tooltips with a language toggle
- Built with Leaflet and `apisit/thailand.json` province boundaries

### Postal code lookup
[GitHub Pages Demo](https://dhanabhon.github.io/thailand-geodata/examples/postal-lookup/)

- Select province, district, and sub-district to find the postal code
- Copy to clipboard with one click
- Mobile-responsive
- Runs on GitHub Pages with no installation

### Code examples
Working examples in [examples/](./examples/):

- **Python** - data analysis with pandas
- **JavaScript/Node.js** - web apps and APIs
- **Java** - Maven with JSON processing
- **Go** - built-in JSON handling
- **PHP** - websites with CSV export
- **C#** - .NET 6 with async/await

Each example has setup instructions, error handling, and basic search and filter functionality.

## File structure and data fields
The dataset comes in CSV, JSON, and SQL formats, each with structured fields:

**CSV files**

Key fields:
- `PROVINCE_ID`: unique ID for each province
- `CODE`: unique code for each province
- `PROVINCE_THAI` and `PROVINCE_ENGLISH`: province names in Thai and English
- `UPDATED_AT`: when the record was last updated
- `CREATED_AT`: when the record was created

**JSON files**

The JSON structure is hierarchical:

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

**SQL files**

The SQL file creates and populates three tables:

- `Provinces`
- `Districts`
- `Sub_Districts` (includes postal codes)

Key fields:
- `PROVINCE_ID`, `CODE`, `PROVINCE_THAI`, `PROVINCE_ENGLISH`, `UPDATED_AT`, `CREATED_AT`
- `DISTRICT_ID`, `PROVINCE_ID`, `CODE`, `DISTRICT_CODE`, `DISTRICT_THAI`, `PROVINCE_ENGLISH`, `UPDATED_AT`, `CREATED_AT`
- `SUB_DISTRICT_ID`, `DISTRICT_ID`, `CODE`, `SUB_DISTRICT_CODE`, `SUB_DISTRICT_THAI`, `SUB_DISTRICT_ENGLISH`, `LATITUDE`, `LONGITUDE`, `POSTAL_CODE`, `UPDATED_AT`, `CREATED_AT`

The `CREATED_AT` and `UPDATED_AT` fields track when records were added or modified.

## ER Diagram
![ER Diagram](/er-diagram/er-diagram.png)

## Contribution guidelines
To contribute:

1. **Report issues**: if you find errors or have suggestions, open an issue with details.
2. **Make changes**: fork the repo, create a branch, make your updates, and open a pull request to the main branch. Follow the existing data formats.

By contributing, you agree to license your contributions under the same terms as this project.
