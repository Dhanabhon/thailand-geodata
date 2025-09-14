# Thailand Geodata - PHP Example

This example demonstrates how to work with Thailand geodata using PHP.

## Requirements

- PHP 7.4+
- Composer (optional)

## Installation

```bash
composer install
```

## Usage

```bash
php ThailandGeodata.php
```

Or with Composer:

```bash
composer run start
```

## Features

- Load provinces, districts, and sub-districts from JSON files
- Search provinces by name (Thai or English)
- Get province information by code
- Get districts by province ID
- Get complete province hierarchy
- Basic data statistics
- CSV parsing and export support
- JSON export functionality
- Error handling with exceptions
- Caching for better performance

## Class Methods

- `getProvinces()` - Get all provinces
- `getDistricts()` - Get all districts
- `getSubDistricts()` - Get all sub-districts
- `getProvinceByCode($code)` - Get province by code
- `searchProvincesByName($name, $language)` - Search provinces
- `getDistrictsByProvinceId($provinceId)` - Get districts by province
- `getProvinceHierarchy($provinceId)` - Get complete hierarchy
- `getStatistics()` - Get data statistics
- `exportToJson($data, $filename)` - Export data to JSON
- `exportToCsv($data, $filename)` - Export data to CSV