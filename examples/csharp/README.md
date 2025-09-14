# Thailand Geodata - C# Example

This example demonstrates how to work with Thailand geodata using C# and .NET.

## Requirements

- .NET 6.0+

## Installation

```bash
dotnet restore
```

## Usage

```bash
dotnet run
```

Or build and run:

```bash
dotnet build
dotnet run --no-build
```

## Features

- Load provinces, districts, and sub-districts from JSON files
- Search provinces by name (Thai or English)
- Get province information by code
- Get districts by province ID
- Get complete province hierarchy
- Basic data statistics
- Async/await pattern for better performance
- Strong typing with C# classes
- LINQ queries for data filtering
- JSON caching for better performance

## Architecture

- Uses System.Text.Json for JSON parsing
- Implements async/await pattern throughout
- Strong typing with nullable reference types
- LINQ for data querying and filtering
- Tuple return types for complex data structures
- Exception handling with custom error messages

## Dependencies

- System.Text.Json (included with .NET 6+)