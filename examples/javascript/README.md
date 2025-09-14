# Thailand Geodata - JavaScript/Node.js Example

This example demonstrates how to work with Thailand geodata using JavaScript and Node.js.

## Requirements

- Node.js 12.0.0+

## Installation

```bash
npm install
```

## Usage

```bash
npm start
# or
node thailand-geodata.js
```

## Features

- Load provinces, districts, and sub-districts from JSON files
- Search provinces by name (Thai or English)
- Get province information by code
- Get districts by province ID
- Get complete province hierarchy
- Basic data statistics
- CSV parsing support
- Caching for better performance

## API

The `ThailandGeodata` class can also be used as a module:

```javascript
const ThailandGeodata = require('./thailand-geodata');

const geo = new ThailandGeodata();
const bangkok = await geo.getProvinceByCode('10');
console.log(bangkok);
```