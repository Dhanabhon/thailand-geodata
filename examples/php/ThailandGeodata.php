<?php

class ThailandGeodata
{
    private string $basePath;
    private array $cache = [];

    public function __construct(string $basePath = '../../')
    {
        $this->basePath = rtrim($basePath, '/') . '/';
    }

    private function loadJson(string $filename): array
    {
        if (isset($this->cache[$filename])) {
            return $this->cache[$filename];
        }

        $filePath = $this->basePath . 'json/' . $filename;

        if (!file_exists($filePath)) {
            throw new Exception("File not found: $filePath");
        }

        $content = file_get_contents($filePath);
        $data = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("JSON decode error: " . json_last_error_msg());
        }

        $this->cache[$filename] = $data;
        return $data;
    }

    private function loadCsv(string $filename): array
    {
        $filePath = $this->basePath . 'csv/' . $filename;

        if (!file_exists($filePath)) {
            throw new Exception("File not found: $filePath");
        }

        $handle = fopen($filePath, 'r');
        if ($handle === false) {
            throw new Exception("Cannot open CSV file: $filePath");
        }

        $headers = fgetcsv($handle);
        $result = [];

        while (($row = fgetcsv($handle)) !== false) {
            $assoc = [];
            foreach ($headers as $index => $header) {
                $assoc[trim($header, '"')] = isset($row[$index]) ? trim($row[$index], '"') : '';
            }
            $result[] = $assoc;
        }

        fclose($handle);
        return $result;
    }

    public function getProvinces(): array
    {
        $data = $this->loadJson('provinces.json');
        return $data['provinces'] ?? [];
    }

    public function getDistricts(): array
    {
        $data = $this->loadJson('districts.json');
        return $data['districts'] ?? [];
    }

    public function getSubDistricts(): array
    {
        $data = $this->loadJson('sub_districts.json');
        return $data['sub_districts'] ?? [];
    }

    public function getProvinceByCode(string $code): ?array
    {
        $provinces = $this->getProvinces();

        foreach ($provinces as $province) {
            if ($province['CODE'] === $code) {
                return $province;
            }
        }

        return null;
    }

    public function searchProvincesByName(string $name, string $language = 'thai'): array
    {
        $provinces = $this->getProvinces();
        $nameField = $language === 'thai' ? 'PROVINCE_THAI' : 'PROVINCE_ENGLISH';
        $results = [];

        foreach ($provinces as $province) {
            if (stripos($province[$nameField], $name) !== false) {
                $results[] = $province;
            }
        }

        return $results;
    }

    public function getDistrictsByProvinceId(int $provinceId): array
    {
        $districts = $this->getDistricts();
        $results = [];

        foreach ($districts as $district) {
            if ((int)$district['PROVINCE_ID'] === $provinceId) {
                $results[] = $district;
            }
        }

        return $results;
    }

    public function getStatistics(): array
    {
        $provinces = $this->getProvinces();
        $districts = $this->getDistricts();
        $subDistricts = $this->getSubDistricts();

        return [
            'total_provinces' => count($provinces),
            'total_districts' => count($districts),
            'total_sub_districts' => count($subDistricts)
        ];
    }

    public function getProvinceHierarchy(int $provinceId): ?array
    {
        $provinces = $this->getProvinces();
        $province = null;

        foreach ($provinces as $p) {
            if ((int)$p['PROVINCE_ID'] === $provinceId) {
                $province = $p;
                break;
            }
        }

        if (!$province) {
            return null;
        }

        $districts = $this->getDistrictsByProvinceId($provinceId);
        $subDistricts = $this->getSubDistricts();

        $provinceSubDistricts = array_filter($subDistricts, function($sd) use ($districts) {
            foreach ($districts as $district) {
                if ((int)$district['DISTRICT_ID'] === (int)$sd['DISTRICT_ID']) {
                    return true;
                }
            }
            return false;
        });

        return [
            'province' => $province,
            'districts' => $districts,
            'sub_districts_count' => count($provinceSubDistricts)
        ];
    }

    public function exportToJson(array $data, string $filename): void
    {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents($filename, $json);
    }

    public function exportToCsv(array $data, string $filename): void
    {
        if (empty($data)) {
            return;
        }

        $handle = fopen($filename, 'w');

        // Write headers
        $headers = array_keys($data[0]);
        fputcsv($handle, $headers);

        // Write data
        foreach ($data as $row) {
            fputcsv($handle, $row);
        }

        fclose($handle);
    }
}

function main(): void
{
    echo "🇹🇭 Thailand Geodata PHP Example\n";
    echo str_repeat("=", 40) . "\n";

    try {
        $geo = new ThailandGeodata();

        // Get statistics
        $stats = $geo->getStatistics();
        echo "📊 Data Statistics:\n";
        echo "   Provinces: {$stats['total_provinces']}\n";
        echo "   Districts: {$stats['total_districts']}\n";
        echo "   Sub-districts: {$stats['total_sub_districts']}\n";
        echo "\n";

        // Get Bangkok information
        $bangkok = $geo->getProvinceByCode('10');
        if ($bangkok) {
            echo "🏛️  Bangkok Information:\n";
            echo "   Thai: {$bangkok['PROVINCE_THAI']}\n";
            echo "   English: {$bangkok['PROVINCE_ENGLISH']}\n";
            echo "   Code: {$bangkok['CODE']}\n";
            echo "\n";
        }

        // Search provinces containing "เชียง"
        $chiangProvinces = $geo->searchProvincesByName('เชียง', 'thai');
        echo "🔍 Provinces containing 'เชียง': " . count($chiangProvinces) . "\n";
        for ($i = 0; $i < min(3, count($chiangProvinces)); $i++) {
            $province = $chiangProvinces[$i];
            echo "   - {$province['PROVINCE_THAI']} ({$province['PROVINCE_ENGLISH']})\n";
        }
        echo "\n";

        // Get Bangkok hierarchy
        $bangkokHierarchy = $geo->getProvinceHierarchy(1);
        if ($bangkokHierarchy) {
            $districtsCount = count($bangkokHierarchy['districts']);
            $subDistrictsCount = $bangkokHierarchy['sub_districts_count'];
            echo "🏙️  Bangkok has $districtsCount districts and $subDistrictsCount sub-districts\n";

            for ($i = 0; $i < min(5, $districtsCount); $i++) {
                $district = $bangkokHierarchy['districts'][$i];
                echo "   - {$district['DISTRICT_THAI']} ({$district['DISTRICT_ENGLISH']})\n";
            }

            if ($districtsCount > 5) {
                $remaining = $districtsCount - 5;
                echo "   ... and $remaining more districts\n";
            }
        }

        // Example: Export Bangkok districts to CSV
        if ($bangkokHierarchy) {
            $geo->exportToCsv($bangkokHierarchy['districts'], 'bangkok_districts.csv');
            echo "\n📄 Exported Bangkok districts to bangkok_districts.csv\n";
        }

    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
        exit(1);
    }
}

// Run the example if this file is executed directly
if (basename(__FILE__) === basename($_SERVER['SCRIPT_NAME'] ?? '')) {
    main();
}