#!/usr/bin/env python3
"""
Thailand Geodata Example in Python
Demonstrates how to work with Thailand provinces, districts, and sub-districts data
"""

import json
import csv
import pandas as pd
from pathlib import Path

class ThailandGeodata:
    def __init__(self, base_path="../../"):
        self.base_path = Path(base_path)
        self.json_path = self.base_path / "json"
        self.csv_path = self.base_path / "csv"

    def load_provinces_json(self):
        """Load provinces data from JSON file"""
        with open(self.json_path / "provinces.json", 'r', encoding='utf-8') as f:
            return json.load(f)

    def load_provinces_csv(self):
        """Load provinces data from CSV file"""
        return pd.read_csv(self.csv_path / "provinces.csv")

    def load_districts_json(self):
        """Load districts data from JSON file"""
        with open(self.json_path / "districts.json", 'r', encoding='utf-8') as f:
            return json.load(f)

    def load_districts_csv(self):
        """Load districts data from CSV file"""
        return pd.read_csv(self.csv_path / "districts.csv")

    def load_sub_districts_json(self):
        """Load sub-districts data from JSON file"""
        with open(self.json_path / "sub_districts.json", 'r', encoding='utf-8') as f:
            return json.load(f)

    def load_sub_districts_csv(self):
        """Load sub-districts data from CSV file"""
        return pd.read_csv(self.csv_path / "sub_districts.csv")

    def get_province_by_code(self, code):
        """Get province information by code"""
        provinces = self.load_provinces_json()
        for province in provinces['provinces']:
            if province['CODE'] == str(code):
                return province
        return None

    def search_provinces_by_name(self, name, language='thai'):
        """Search provinces by name (Thai or English)"""
        provinces = self.load_provinces_json()
        results = []
        name_field = 'PROVINCE_THAI' if language == 'thai' else 'PROVINCE_ENGLISH'

        for province in provinces['provinces']:
            if name.lower() in province[name_field].lower():
                results.append(province)
        return results

    def get_districts_by_province_id(self, province_id):
        """Get all districts in a province"""
        districts_df = self.load_districts_csv()
        return districts_df[districts_df['PROVINCE_ID'] == province_id].to_dict('records')

    def get_statistics(self):
        """Get basic statistics about the data"""
        provinces_df = self.load_provinces_csv()
        districts_df = self.load_districts_csv()
        sub_districts_df = self.load_sub_districts_csv()

        return {
            'total_provinces': len(provinces_df),
            'total_districts': len(districts_df),
            'total_sub_districts': len(sub_districts_df)
        }

def main():
    """Example usage of ThailandGeodata class"""
    print("🇹🇭 Thailand Geodata Python Example")
    print("=" * 40)

    geo = ThailandGeodata()

    # Get statistics
    stats = geo.get_statistics()
    print(f"📊 Data Statistics:")
    print(f"   Provinces: {stats['total_provinces']}")
    print(f"   Districts: {stats['total_districts']}")
    print(f"   Sub-districts: {stats['total_sub_districts']}")
    print()

    # Search for Bangkok
    bangkok = geo.get_province_by_code("10")
    if bangkok:
        print(f"🏛️  Bangkok Information:")
        print(f"   Thai: {bangkok['PROVINCE_THAI']}")
        print(f"   English: {bangkok['PROVINCE_ENGLISH']}")
        print(f"   Code: {bangkok['CODE']}")
        print()

    # Search provinces containing "เชียง"
    chiang_provinces = geo.search_provinces_by_name("เชียง", "thai")
    print(f"🔍 Provinces containing 'เชียง': {len(chiang_provinces)}")
    for province in chiang_provinces[:3]:
        print(f"   - {province['PROVINCE_THAI']} ({province['PROVINCE_ENGLISH']})")
    print()

    # Get districts in Bangkok
    bangkok_districts = geo.get_districts_by_province_id(1)
    print(f"🏙️  Bangkok has {len(bangkok_districts)} districts")
    for district in bangkok_districts[:5]:
        print(f"   - {district['DISTRICT_THAI']} ({district['DISTRICT_ENGLISH']})")
    if len(bangkok_districts) > 5:
        print(f"   ... and {len(bangkok_districts) - 5} more districts")

if __name__ == "__main__":
    main()