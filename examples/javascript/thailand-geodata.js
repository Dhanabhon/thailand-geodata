#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class ThailandGeodata {
    constructor(basePath = '../../') {
        this.basePath = basePath;
        this.jsonPath = path.join(basePath, 'json');
        this.csvPath = path.join(basePath, 'csv');
        this.cache = {};
    }

    async loadJSON(filename) {
        if (this.cache[filename]) {
            return this.cache[filename];
        }

        const filePath = path.join(this.jsonPath, filename);
        const data = await fs.readFile(filePath, 'utf8');
        this.cache[filename] = JSON.parse(data);
        return this.cache[filename];
    }

    async loadCSV(filename) {
        const filePath = path.join(this.csvPath, filename);
        const data = await fs.readFile(filePath, 'utf8');
        const lines = data.trim().split('\n');
        const headers = this.parseCSVLine(lines[0]);

        return lines.slice(1).map(line => {
            const values = this.parseCSVLine(line);
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            return obj;
        });
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim().replace(/^"|"$/g, ''));
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim().replace(/^"|"$/g, ''));
        return result;
    }

    async getProvinces() {
        const data = await this.loadJSON('provinces.json');
        return data.provinces;
    }

    async getDistricts() {
        const data = await this.loadJSON('districts.json');
        return data.districts;
    }

    async getSubDistricts() {
        const data = await this.loadJSON('sub_districts.json');
        return data.sub_districts;
    }

    async getProvinceByCode(code) {
        const provinces = await this.getProvinces();
        return provinces.find(province => province.CODE === String(code));
    }

    async searchProvincesByName(name, language = 'thai') {
        const provinces = await this.getProvinces();
        const nameField = language === 'thai' ? 'PROVINCE_THAI' : 'PROVINCE_ENGLISH';

        return provinces.filter(province =>
            province[nameField].toLowerCase().includes(name.toLowerCase())
        );
    }

    async getDistrictsByProvinceId(provinceId) {
        const districts = await this.getDistricts();
        return districts.filter(district => district.PROVINCE_ID === provinceId);
    }

    async getStatistics() {
        const [provinces, districts, subDistricts] = await Promise.all([
            this.getProvinces(),
            this.getDistricts(),
            this.getSubDistricts()
        ]);

        return {
            totalProvinces: provinces.length,
            totalDistricts: districts.length,
            totalSubDistricts: subDistricts.length
        };
    }

    async getProvinceHierarchy(provinceId) {
        const [province, districts] = await Promise.all([
            this.getProvinces().then(provinces => provinces.find(p => p.PROVINCE_ID === provinceId)),
            this.getDistrictsByProvinceId(provinceId)
        ]);

        if (!province) return null;

        const subDistricts = await this.getSubDistricts();
        const provinceSubDistricts = subDistricts.filter(sd =>
            districts.some(d => d.DISTRICT_ID === sd.DISTRICT_ID)
        );

        return {
            province,
            districts,
            subDistrictsCount: provinceSubDistricts.length
        };
    }
}

async function main() {
    console.log('🇹🇭 Thailand Geodata JavaScript Example');
    console.log('=' .repeat(42));

    try {
        const geo = new ThailandGeodata();

        // Get statistics
        const stats = await geo.getStatistics();
        console.log('📊 Data Statistics:');
        console.log(`   Provinces: ${stats.totalProvinces}`);
        console.log(`   Districts: ${stats.totalDistricts}`);
        console.log(`   Sub-districts: ${stats.totalSubDistricts}`);
        console.log();

        // Get Bangkok information
        const bangkok = await geo.getProvinceByCode('10');
        if (bangkok) {
            console.log('🏛️  Bangkok Information:');
            console.log(`   Thai: ${bangkok.PROVINCE_THAI}`);
            console.log(`   English: ${bangkok.PROVINCE_ENGLISH}`);
            console.log(`   Code: ${bangkok.CODE}`);
            console.log();
        }

        // Search provinces containing "เชียง"
        const chiangProvinces = await geo.searchProvincesByName('เชียง', 'thai');
        console.log(`🔍 Provinces containing 'เชียง': ${chiangProvinces.length}`);
        chiangProvinces.slice(0, 3).forEach(province => {
            console.log(`   - ${province.PROVINCE_THAI} (${province.PROVINCE_ENGLISH})`);
        });
        console.log();

        // Get Bangkok hierarchy
        const bangkokHierarchy = await geo.getProvinceHierarchy(1);
        if (bangkokHierarchy) {
            console.log(`🏙️  Bangkok has ${bangkokHierarchy.districts.length} districts and ${bangkokHierarchy.subDistrictsCount} sub-districts`);
            bangkokHierarchy.districts.slice(0, 5).forEach(district => {
                console.log(`   - ${district.DISTRICT_THAI} (${district.DISTRICT_ENGLISH})`);
            });
            if (bangkokHierarchy.districts.length > 5) {
                console.log(`   ... and ${bangkokHierarchy.districts.length - 5} more districts`);
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = ThailandGeodata;