package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type Province struct {
	ProvinceID      int    `json:"PROVINCE_ID"`
	Code            string `json:"CODE"`
	ProvinceThai    string `json:"PROVINCE_THAI"`
	ProvinceEnglish string `json:"PROVINCE_ENGLISH"`
	UpdatedAt       string `json:"UPDATED_AT"`
	CreatedAt       string `json:"CREATED_AT"`
}

type District struct {
	DistrictID      int    `json:"DISTRICT_ID"`
	ProvinceID      int    `json:"PROVINCE_ID"`
	Code            string `json:"CODE"`
	DistrictThai    string `json:"DISTRICT_THAI"`
	DistrictEnglish string `json:"DISTRICT_ENGLISH"`
	UpdatedAt       string `json:"UPDATED_AT"`
	CreatedAt       string `json:"CREATED_AT"`
}

type SubDistrict struct {
	SubDistrictID      int    `json:"SUB_DISTRICT_ID"`
	DistrictID         int    `json:"DISTRICT_ID"`
	Code               string `json:"CODE"`
	SubDistrictThai    string `json:"SUB_DISTRICT_THAI"`
	SubDistrictEnglish string `json:"SUB_DISTRICT_ENGLISH"`
	UpdatedAt          string `json:"UPDATED_AT"`
	CreatedAt          string `json:"CREATED_AT"`
}

type ProvincesData struct {
	Provinces []Province `json:"provinces"`
}

type DistrictsData struct {
	Districts []District `json:"districts"`
}

type SubDistrictsData struct {
	SubDistricts []SubDistrict `json:"sub_districts"`
}

type ThailandGeodata struct {
	basePath string
	cache    map[string]interface{}
}

func NewThailandGeodata(basePath string) *ThailandGeodata {
	if basePath == "" {
		basePath = "../../"
	}
	return &ThailandGeodata{
		basePath: basePath,
		cache:    make(map[string]interface{}),
	}
}

func (tg *ThailandGeodata) loadJSON(filename string, target interface{}) error {
	if cached, exists := tg.cache[filename]; exists {
		switch t := target.(type) {
		case *ProvincesData:
			*t = cached.(ProvincesData)
		case *DistrictsData:
			*t = cached.(DistrictsData)
		case *SubDistrictsData:
			*t = cached.(SubDistrictsData)
		}
		return nil
	}

	filePath := filepath.Join(tg.basePath, "json", filename)
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	if err := decoder.Decode(target); err != nil {
		return err
	}

	tg.cache[filename] = target
	return nil
}

func (tg *ThailandGeodata) loadCSV(filename string) ([]map[string]string, error) {
	filePath := filepath.Join(tg.basePath, "csv", filename)
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	if len(records) == 0 {
		return []map[string]string{}, nil
	}

	headers := records[0]
	result := make([]map[string]string, 0, len(records)-1)

	for i := 1; i < len(records); i++ {
		row := make(map[string]string)
		for j, header := range headers {
			if j < len(records[i]) {
				row[header] = records[i][j]
			} else {
				row[header] = ""
			}
		}
		result = append(result, row)
	}

	return result, nil
}

func (tg *ThailandGeodata) GetProvinces() ([]Province, error) {
	var data ProvincesData
	err := tg.loadJSON("provinces.json", &data)
	return data.Provinces, err
}

func (tg *ThailandGeodata) GetDistricts() ([]District, error) {
	var data DistrictsData
	err := tg.loadJSON("districts.json", &data)
	return data.Districts, err
}

func (tg *ThailandGeodata) GetSubDistricts() ([]SubDistrict, error) {
	var data SubDistrictsData
	err := tg.loadJSON("sub_districts.json", &data)
	return data.SubDistricts, err
}

func (tg *ThailandGeodata) GetProvinceByCode(code string) (*Province, error) {
	provinces, err := tg.GetProvinces()
	if err != nil {
		return nil, err
	}

	for _, province := range provinces {
		if province.Code == code {
			return &province, nil
		}
	}
	return nil, nil
}

func (tg *ThailandGeodata) SearchProvincesByName(name, language string) ([]Province, error) {
	provinces, err := tg.GetProvinces()
	if err != nil {
		return nil, err
	}

	var results []Province
	name = strings.ToLower(name)

	for _, province := range provinces {
		var searchText string
		if language == "thai" {
			searchText = strings.ToLower(province.ProvinceThai)
		} else {
			searchText = strings.ToLower(province.ProvinceEnglish)
		}

		if strings.Contains(searchText, name) {
			results = append(results, province)
		}
	}

	return results, nil
}

func (tg *ThailandGeodata) GetDistrictsByProvinceID(provinceID int) ([]District, error) {
	districts, err := tg.GetDistricts()
	if err != nil {
		return nil, err
	}

	var results []District
	for _, district := range districts {
		if district.ProvinceID == provinceID {
			results = append(results, district)
		}
	}

	return results, nil
}

type Statistics struct {
	TotalProvinces    int
	TotalDistricts    int
	TotalSubDistricts int
}

func (tg *ThailandGeodata) GetStatistics() (*Statistics, error) {
	provinces, err := tg.GetProvinces()
	if err != nil {
		return nil, err
	}

	districts, err := tg.GetDistricts()
	if err != nil {
		return nil, err
	}

	subDistricts, err := tg.GetSubDistricts()
	if err != nil {
		return nil, err
	}

	return &Statistics{
		TotalProvinces:    len(provinces),
		TotalDistricts:    len(districts),
		TotalSubDistricts: len(subDistricts),
	}, nil
}

func main() {
	fmt.Println("🇹🇭 Thailand Geodata Go Example")
	fmt.Println(strings.Repeat("=", 38))

	geo := NewThailandGeodata("")

	// Get statistics
	stats, err := geo.GetStatistics()
	if err != nil {
		fmt.Printf("Error getting statistics: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("📊 Data Statistics:")
	fmt.Printf("   Provinces: %d\n", stats.TotalProvinces)
	fmt.Printf("   Districts: %d\n", stats.TotalDistricts)
	fmt.Printf("   Sub-districts: %d\n", stats.TotalSubDistricts)
	fmt.Println()

	// Get Bangkok information
	bangkok, err := geo.GetProvinceByCode("10")
	if err != nil {
		fmt.Printf("Error getting Bangkok: %v\n", err)
		os.Exit(1)
	}

	if bangkok != nil {
		fmt.Println("🏛️  Bangkok Information:")
		fmt.Printf("   Thai: %s\n", bangkok.ProvinceThai)
		fmt.Printf("   English: %s\n", bangkok.ProvinceEnglish)
		fmt.Printf("   Code: %s\n", bangkok.Code)
		fmt.Println()
	}

	// Search provinces containing "เชียง"
	chiangProvinces, err := geo.SearchProvincesByName("เชียง", "thai")
	if err != nil {
		fmt.Printf("Error searching provinces: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("🔍 Provinces containing 'เชียง': %d\n", len(chiangProvinces))
	for i, province := range chiangProvinces {
		if i >= 3 {
			break
		}
		fmt.Printf("   - %s (%s)\n", province.ProvinceThai, province.ProvinceEnglish)
	}
	fmt.Println()

	// Get districts in Bangkok
	bangkokDistricts, err := geo.GetDistrictsByProvinceID(1)
	if err != nil {
		fmt.Printf("Error getting Bangkok districts: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("🏙️  Bangkok has %d districts\n", len(bangkokDistricts))
	for i, district := range bangkokDistricts {
		if i >= 5 {
			break
		}
		fmt.Printf("   - %s (%s)\n", district.DistrictThai, district.DistrictEnglish)
	}
	if len(bangkokDistricts) > 5 {
		fmt.Printf("   ... and %d more districts\n", len(bangkokDistricts)-5)
	}
}