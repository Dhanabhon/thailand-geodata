# Thailand Geodata - Java Example

This example demonstrates how to work with Thailand geodata using Java and Maven.

## Requirements

- Java 11+
- Maven 3.6+

## Installation

```bash
mvn clean compile
```

## Usage

```bash
mvn exec:java
```

Or compile and run manually:

```bash
mvn clean compile
java -cp target/classes:~/.m2/repository/com/fasterxml/jackson/core/jackson-databind/2.15.2/jackson-databind-2.15.2.jar:~/.m2/repository/com/fasterxml/jackson/core/jackson-core/2.15.2/jackson-core-2.15.2.jar:~/.m2/repository/com/fasterxml/jackson/core/jackson-annotations/2.15.2/jackson-annotations-2.15.2.jar ThailandGeodata
```

## Features

- Load provinces, districts, and sub-districts from JSON files
- Search provinces by name (Thai or English)
- Get province information by code
- Get districts by province ID
- Basic data statistics
- CSV parsing support
- JSON caching for better performance

## Dependencies

- Jackson Databind for JSON processing