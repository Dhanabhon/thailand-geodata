import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

public class ThailandGeodata {
    private final String basePath;
    private final ObjectMapper objectMapper;
    private Map<String, JsonNode> cache;

    public ThailandGeodata() {
        this("../../");
    }

    public ThailandGeodata(String basePath) {
        this.basePath = basePath;
        this.objectMapper = new ObjectMapper();
        this.cache = new HashMap<>();
    }

    public JsonNode loadJson(String filename) throws IOException {
        if (cache.containsKey(filename)) {
            return cache.get(filename);
        }

        Path filePath = Paths.get(basePath, "json", filename);
        String content = Files.readString(filePath);
        JsonNode data = objectMapper.readTree(content);
        cache.put(filename, data);
        return data;
    }

    public List<Map<String, String>> loadCsv(String filename) throws IOException {
        Path filePath = Paths.get(basePath, "csv", filename);
        List<String> lines = Files.readAllLines(filePath);

        if (lines.isEmpty()) return new ArrayList<>();

        String[] headers = parseCsvLine(lines.get(0));
        List<Map<String, String>> result = new ArrayList<>();

        for (int i = 1; i < lines.size(); i++) {
            String[] values = parseCsvLine(lines.get(i));
            Map<String, String> row = new HashMap<>();
            for (int j = 0; j < headers.length && j < values.length; j++) {
                row.put(headers[j], values[j]);
            }
            result.add(row);
        }

        return result;
    }

    private String[] parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (char c : line.toCharArray()) {
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                result.add(current.toString().trim().replaceAll("^\"|\"$", ""));
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        result.add(current.toString().trim().replaceAll("^\"|\"$", ""));

        return result.toArray(new String[0]);
    }

    public List<JsonNode> getProvinces() throws IOException {
        JsonNode data = loadJson("provinces.json");
        List<JsonNode> provinces = new ArrayList<>();
        data.get("provinces").forEach(provinces::add);
        return provinces;
    }

    public List<JsonNode> getDistricts() throws IOException {
        JsonNode data = loadJson("districts.json");
        List<JsonNode> districts = new ArrayList<>();
        data.get("districts").forEach(districts::add);
        return districts;
    }

    public List<JsonNode> getSubDistricts() throws IOException {
        JsonNode data = loadJson("sub_districts.json");
        List<JsonNode> subDistricts = new ArrayList<>();
        data.get("sub_districts").forEach(subDistricts::add);
        return subDistricts;
    }

    public Optional<JsonNode> getProvinceByCode(String code) throws IOException {
        List<JsonNode> provinces = getProvinces();
        return provinces.stream()
                .filter(province -> code.equals(province.get("CODE").asText()))
                .findFirst();
    }

    public List<JsonNode> searchProvincesByName(String name, String language) throws IOException {
        List<JsonNode> provinces = getProvinces();
        String nameField = "thai".equals(language) ? "PROVINCE_THAI" : "PROVINCE_ENGLISH";

        return provinces.stream()
                .filter(province -> province.get(nameField).asText().toLowerCase()
                        .contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<JsonNode> getDistrictsByProvinceId(int provinceId) throws IOException {
        List<JsonNode> districts = getDistricts();
        return districts.stream()
                .filter(district -> district.get("PROVINCE_ID").asInt() == provinceId)
                .collect(Collectors.toList());
    }

    public Statistics getStatistics() throws IOException {
        List<JsonNode> provinces = getProvinces();
        List<JsonNode> districts = getDistricts();
        List<JsonNode> subDistricts = getSubDistricts();

        return new Statistics(provinces.size(), districts.size(), subDistricts.size());
    }

    public static class Statistics {
        public final int totalProvinces;
        public final int totalDistricts;
        public final int totalSubDistricts;

        public Statistics(int totalProvinces, int totalDistricts, int totalSubDistricts) {
            this.totalProvinces = totalProvinces;
            this.totalDistricts = totalDistricts;
            this.totalSubDistricts = totalSubDistricts;
        }
    }

    public static void main(String[] args) {
        System.out.println("🇹🇭 Thailand Geodata Java Example");
        System.out.println("=".repeat(40));

        try {
            ThailandGeodata geo = new ThailandGeodata();

            // Get statistics
            Statistics stats = geo.getStatistics();
            System.out.println("📊 Data Statistics:");
            System.out.println("   Provinces: " + stats.totalProvinces);
            System.out.println("   Districts: " + stats.totalDistricts);
            System.out.println("   Sub-districts: " + stats.totalSubDistricts);
            System.out.println();

            // Get Bangkok information
            Optional<JsonNode> bangkok = geo.getProvinceByCode("10");
            if (bangkok.isPresent()) {
                JsonNode bangkokNode = bangkok.get();
                System.out.println("🏛️  Bangkok Information:");
                System.out.println("   Thai: " + bangkokNode.get("PROVINCE_THAI").asText());
                System.out.println("   English: " + bangkokNode.get("PROVINCE_ENGLISH").asText());
                System.out.println("   Code: " + bangkokNode.get("CODE").asText());
                System.out.println();
            }

            // Search provinces containing "เชียง"
            List<JsonNode> chiangProvinces = geo.searchProvincesByName("เชียง", "thai");
            System.out.println("🔍 Provinces containing 'เชียง': " + chiangProvinces.size());
            chiangProvinces.stream().limit(3).forEach(province -> {
                System.out.println("   - " + province.get("PROVINCE_THAI").asText() +
                        " (" + province.get("PROVINCE_ENGLISH").asText() + ")");
            });
            System.out.println();

            // Get districts in Bangkok
            List<JsonNode> bangkokDistricts = geo.getDistrictsByProvinceId(1);
            System.out.println("🏙️  Bangkok has " + bangkokDistricts.size() + " districts");
            bangkokDistricts.stream().limit(5).forEach(district -> {
                System.out.println("   - " + district.get("DISTRICT_THAI").asText() +
                        " (" + district.get("DISTRICT_ENGLISH").asText() + ")");
            });
            if (bangkokDistricts.size() > 5) {
                System.out.println("   ... and " + (bangkokDistricts.size() - 5) + " more districts");
            }

        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
            System.exit(1);
        }
    }
}