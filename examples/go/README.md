# Thailand Geodata - Go Example

This example demonstrates how to work with Thailand geodata using Go.

## Requirements

- Go 1.19+

## Installation

```bash
go mod tidy
```

## Usage

```bash
go run main.go
```

Or build and run:

```bash
go build -o thailand-geodata
./thailand-geodata
```

## Features

- Load provinces, districts, and sub-districts from JSON files
- Search provinces by name (Thai or English)
- Get province information by code
- Get districts by province ID
- Basic data statistics
- CSV parsing support
- JSON caching for better performance
- Type-safe struct definitions

## Architecture

- Uses Go structs with JSON tags for type safety
- Implements caching to avoid repeated file reads
- Standard library only (no external dependencies)
- Error handling following Go idioms