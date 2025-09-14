using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ThailandGeodataExample
{
    public class Province
    {
        public int PROVINCE_ID { get; set; }
        public string CODE { get; set; } = string.Empty;
        public string PROVINCE_THAI { get; set; } = string.Empty;
        public string PROVINCE_ENGLISH { get; set; } = string.Empty;
        public string UPDATED_AT { get; set; } = string.Empty;
        public string CREATED_AT { get; set; } = string.Empty;
    }

    public class District
    {
        public int DISTRICT_ID { get; set; }
        public int PROVINCE_ID { get; set; }
        public string CODE { get; set; } = string.Empty;
        public string DISTRICT_THAI { get; set; } = string.Empty;
        public string DISTRICT_ENGLISH { get; set; } = string.Empty;
        public string UPDATED_AT { get; set; } = string.Empty;
        public string CREATED_AT { get; set; } = string.Empty;
    }

    public class SubDistrict
    {
        public int SUB_DISTRICT_ID { get; set; }
        public int DISTRICT_ID { get; set; }
        public string CODE { get; set; } = string.Empty;
        public string SUB_DISTRICT_THAI { get; set; } = string.Empty;
        public string SUB_DISTRICT_ENGLISH { get; set; } = string.Empty;
        public string UPDATED_AT { get; set; } = string.Empty;
        public string CREATED_AT { get; set; } = string.Empty;
    }

    public class ProvincesData
    {
        public List<Province> provinces { get; set; } = new List<Province>();
    }

    public class DistrictsData
    {
        public List<District> districts { get; set; } = new List<District>();
    }

    public class SubDistrictsData
    {
        public List<SubDistrict> sub_districts { get; set; } = new List<SubDistrict>();
    }

    public class Statistics
    {
        public int TotalProvinces { get; set; }
        public int TotalDistricts { get; set; }
        public int TotalSubDistricts { get; set; }
    }

    public class ThailandGeodata
    {
        private readonly string _basePath;
        private readonly Dictionary<string, object> _cache;
        private readonly JsonSerializerOptions _jsonOptions;

        public ThailandGeodata(string basePath = "../../")
        {
            _basePath = basePath.TrimEnd('/') + "/";
            _cache = new Dictionary<string, object>();
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
        }

        private async Task<T> LoadJsonAsync<T>(string filename) where T : class
        {
            if (_cache.ContainsKey(filename))
            {
                return (T)_cache[filename];
            }

            var filePath = Path.Combine(_basePath, "json", filename);

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"File not found: {filePath}");
            }

            var json = await File.ReadAllTextAsync(filePath);
            var data = JsonSerializer.Deserialize<T>(json, _jsonOptions);

            if (data != null)
            {
                _cache[filename] = data;
            }

            return data ?? throw new InvalidOperationException($"Failed to deserialize {filename}");
        }

        public async Task<List<Province>> GetProvincesAsync()
        {
            var data = await LoadJsonAsync<ProvincesData>("provinces.json");
            return data.provinces;
        }

        public async Task<List<District>> GetDistrictsAsync()
        {
            var data = await LoadJsonAsync<DistrictsData>("districts.json");
            return data.districts;
        }

        public async Task<List<SubDistrict>> GetSubDistrictsAsync()
        {
            var data = await LoadJsonAsync<SubDistrictsData>("sub_districts.json");
            return data.sub_districts;
        }

        public async Task<Province?> GetProvinceByCodeAsync(string code)
        {
            var provinces = await GetProvincesAsync();
            return provinces.FirstOrDefault(p => p.CODE == code);
        }

        public async Task<List<Province>> SearchProvincesByNameAsync(string name, string language = "thai")
        {
            var provinces = await GetProvincesAsync();
            var nameToSearch = name.ToLowerInvariant();

            return provinces.Where(province =>
            {
                var searchText = language == "thai"
                    ? province.PROVINCE_THAI.ToLowerInvariant()
                    : province.PROVINCE_ENGLISH.ToLowerInvariant();

                return searchText.Contains(nameToSearch);
            }).ToList();
        }

        public async Task<List<District>> GetDistrictsByProvinceIdAsync(int provinceId)
        {
            var districts = await GetDistrictsAsync();
            return districts.Where(d => d.PROVINCE_ID == provinceId).ToList();
        }

        public async Task<Statistics> GetStatisticsAsync()
        {
            var provincesTask = GetProvincesAsync();
            var districtsTask = GetDistrictsAsync();
            var subDistrictsTask = GetSubDistrictsAsync();

            await Task.WhenAll(provincesTask, districtsTask, subDistrictsTask);

            return new Statistics
            {
                TotalProvinces = provincesTask.Result.Count,
                TotalDistricts = districtsTask.Result.Count,
                TotalSubDistricts = subDistrictsTask.Result.Count
            };
        }

        public async Task<(Province province, List<District> districts, int subDistrictsCount)?> GetProvinceHierarchyAsync(int provinceId)
        {
            var provinces = await GetProvincesAsync();
            var province = provinces.FirstOrDefault(p => p.PROVINCE_ID == provinceId);

            if (province == null)
                return null;

            var districts = await GetDistrictsByProvinceIdAsync(provinceId);
            var subDistricts = await GetSubDistrictsAsync();

            var provinceSubDistricts = subDistricts
                .Where(sd => districts.Any(d => d.DISTRICT_ID == sd.DISTRICT_ID))
                .ToList();

            return (province, districts, provinceSubDistricts.Count);
        }
    }

    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("🇹🇭 Thailand Geodata C# Example");
            Console.WriteLine(new string('=', 40));

            try
            {
                var geo = new ThailandGeodata();

                // Get statistics
                var stats = await geo.GetStatisticsAsync();
                Console.WriteLine("📊 Data Statistics:");
                Console.WriteLine($"   Provinces: {stats.TotalProvinces}");
                Console.WriteLine($"   Districts: {stats.TotalDistricts}");
                Console.WriteLine($"   Sub-districts: {stats.TotalSubDistricts}");
                Console.WriteLine();

                // Get Bangkok information
                var bangkok = await geo.GetProvinceByCodeAsync("10");
                if (bangkok != null)
                {
                    Console.WriteLine("🏛️  Bangkok Information:");
                    Console.WriteLine($"   Thai: {bangkok.PROVINCE_THAI}");
                    Console.WriteLine($"   English: {bangkok.PROVINCE_ENGLISH}");
                    Console.WriteLine($"   Code: {bangkok.CODE}");
                    Console.WriteLine();
                }

                // Search provinces containing "เชียง"
                var chiangProvinces = await geo.SearchProvincesByNameAsync("เชียง", "thai");
                Console.WriteLine($"🔍 Provinces containing 'เชียง': {chiangProvinces.Count}");
                foreach (var province in chiangProvinces.Take(3))
                {
                    Console.WriteLine($"   - {province.PROVINCE_THAI} ({province.PROVINCE_ENGLISH})");
                }
                Console.WriteLine();

                // Get Bangkok hierarchy
                var bangkokHierarchy = await geo.GetProvinceHierarchyAsync(1);
                if (bangkokHierarchy.HasValue)
                {
                    var (province, districts, subDistrictsCount) = bangkokHierarchy.Value;
                    Console.WriteLine($"🏙️  Bangkok has {districts.Count} districts and {subDistrictsCount} sub-districts");

                    foreach (var district in districts.Take(5))
                    {
                        Console.WriteLine($"   - {district.DISTRICT_THAI} ({district.DISTRICT_ENGLISH})");
                    }

                    if (districts.Count > 5)
                    {
                        Console.WriteLine($"   ... and {districts.Count - 5} more districts");
                    }
                }

                Console.WriteLine("\n✅ Example completed successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
                Environment.Exit(1);
            }
        }
    }
}