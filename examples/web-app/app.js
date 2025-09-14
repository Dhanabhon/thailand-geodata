class ThailandGeodataApp {
    constructor() {
        this.data = {
            provinces: [],
            districts: [],
            subDistricts: []
        };
        this.currentLanguage = 'thai';
        this.selectedProvince = null;
        this.filteredProvinces = [];

        this.init();
    }

    async init() {
        this.showLoading(true);
        this.setupEventListeners();

        try {
            await this.loadData();
            this.updateStatistics();
            this.renderProvinces();
            this.renderFeaturedProvinces();
            this.showToast('Data loaded successfully!');
        } catch (error) {
            console.error('Error loading data:', error);
            this.showToast('Error loading data. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadData() {
        const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '../../'
            : 'https://raw.githubusercontent.com/dhanabhon/thailand-geodata/main/';

        const [provincesResponse, districtsResponse, subDistrictsResponse] = await Promise.all([
            fetch(`${baseUrl}json/provinces.json`),
            fetch(`${baseUrl}json/districts.json`),
            fetch(`${baseUrl}json/sub_districts.json`)
        ]);

        const [provincesData, districtsData, subDistrictsData] = await Promise.all([
            provincesResponse.json(),
            districtsResponse.json(),
            subDistrictsResponse.json()
        ]);

        this.data.provinces = provincesData.provinces || [];
        this.data.districts = districtsData.districts || [];
        this.data.subDistricts = subDistrictsData.sub_districts || [];

        this.filteredProvinces = [...this.data.provinces];
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        const langThai = document.getElementById('lang-thai');
        const langEnglish = document.getElementById('lang-english');

        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        langThai.addEventListener('click', () => {
            this.setLanguage('thai');
        });

        langEnglish.addEventListener('click', () => {
            this.setLanguage('english');
        });

        // Close districts section when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.province-card') && !e.target.closest('#districts-section')) {
                this.closeDistrictsSection();
            }
        });
    }

    setLanguage(language) {
        this.currentLanguage = language;

        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`lang-${language}`).classList.add('active');

        this.renderProvinces();
        if (this.selectedProvince) {
            this.showProvinceDetails(this.selectedProvince);
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.filteredProvinces = [...this.data.provinces];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredProvinces = this.data.provinces.filter(province => {
                const thaiName = province.PROVINCE_THAI.toLowerCase();
                const englishName = province.PROVINCE_ENGLISH.toLowerCase();
                return thaiName.includes(searchTerm) || englishName.includes(searchTerm);
            });
        }
        this.renderProvinces();
    }

    updateStatistics() {
        document.getElementById('provinces-count').textContent = this.data.provinces.length.toLocaleString();
        document.getElementById('districts-count').textContent = this.data.districts.length.toLocaleString();
        document.getElementById('sub-districts-count').textContent = this.data.subDistricts.length.toLocaleString();
    }

    renderProvinces() {
        const provincesContainer = document.getElementById('provinces-list');

        if (this.filteredProvinces.length === 0) {
            provincesContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No provinces found matching your search.</p>
                </div>
            `;
            return;
        }

        provincesContainer.innerHTML = this.filteredProvinces.map(province => {
            const name = this.currentLanguage === 'thai' ? province.PROVINCE_THAI : province.PROVINCE_ENGLISH;
            const altName = this.currentLanguage === 'thai' ? province.PROVINCE_ENGLISH : province.PROVINCE_THAI;

            return `
                <div class="province-card" data-province-id="${province.PROVINCE_ID}">
                    <div class="province-code">${province.CODE}</div>
                    <div class="province-name">${name}</div>
                    <div class="province-alt-name">${altName}</div>
                    <div class="province-stats">
                        <i class="fas fa-map"></i>
                        <span id="district-count-${province.PROVINCE_ID}">-</span> districts
                    </div>
                </div>
            `;
        }).join('');

        // Update district counts for visible provinces
        this.updateDistrictCounts();

        // Add click event listeners
        document.querySelectorAll('.province-card').forEach(card => {
            card.addEventListener('click', () => {
                const provinceId = parseInt(card.dataset.provinceId);
                const province = this.data.provinces.find(p => p.PROVINCE_ID === provinceId);
                this.showProvinceDetails(province);
            });
        });
    }

    updateDistrictCounts() {
        this.filteredProvinces.forEach(province => {
            const districtCount = this.data.districts.filter(d => d.PROVINCE_ID === province.PROVINCE_ID).length;
            const countElement = document.getElementById(`district-count-${province.PROVINCE_ID}`);
            if (countElement) {
                countElement.textContent = districtCount;
            }
        });
    }

    renderFeaturedProvinces() {
        const featuredCodes = ['10', '50', '80', '30']; // Bangkok, Chiang Mai, Phuket, Nakhon Ratchasima
        const featuredProvinces = this.data.provinces.filter(p => featuredCodes.includes(p.CODE));

        const featuredContainer = document.getElementById('featured-provinces');
        featuredContainer.innerHTML = featuredProvinces.map(province => {
            const districts = this.data.districts.filter(d => d.PROVINCE_ID === province.PROVINCE_ID);
            const subDistrictsCount = this.data.subDistricts.filter(sd =>
                districts.some(d => d.DISTRICT_ID === sd.DISTRICT_ID)
            ).length;

            return `
                <div class="featured-card" data-province-id="${province.PROVINCE_ID}">
                    <div class="featured-header">
                        <h4>${province.PROVINCE_THAI}</h4>
                        <span class="featured-code">${province.CODE}</span>
                    </div>
                    <p class="featured-english">${province.PROVINCE_ENGLISH}</p>
                    <div class="featured-stats">
                        <div class="featured-stat">
                            <i class="fas fa-map"></i>
                            <span>${districts.length} districts</span>
                        </div>
                        <div class="featured-stat">
                            <i class="fas fa-location-dot"></i>
                            <span>${subDistrictsCount} sub-districts</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click event listeners for featured provinces
        document.querySelectorAll('.featured-card').forEach(card => {
            card.addEventListener('click', () => {
                const provinceId = parseInt(card.dataset.provinceId);
                const province = this.data.provinces.find(p => p.PROVINCE_ID === provinceId);
                this.showProvinceDetails(province);
            });
        });
    }

    showProvinceDetails(province) {
        this.selectedProvince = province;

        // Highlight selected province
        document.querySelectorAll('.province-card, .featured-card').forEach(card => {
            card.classList.remove('selected');
        });

        document.querySelectorAll(`[data-province-id="${province.PROVINCE_ID}"]`).forEach(card => {
            card.classList.add('selected');
        });

        // Show province details
        const detailsContainer = document.getElementById('province-details');
        const name = this.currentLanguage === 'thai' ? province.PROVINCE_THAI : province.PROVINCE_ENGLISH;
        const altName = this.currentLanguage === 'thai' ? province.PROVINCE_ENGLISH : province.PROVINCE_THAI;

        detailsContainer.innerHTML = `
            <h3><i class="fas fa-info-circle"></i> Province Details</h3>
            <div class="province-info">
                <div class="info-row">
                    <strong>Name:</strong> ${name}
                </div>
                <div class="info-row">
                    <strong>Alternative:</strong> ${altName}
                </div>
                <div class="info-row">
                    <strong>Code:</strong> ${province.CODE}
                </div>
                <div class="info-row">
                    <strong>Province ID:</strong> ${province.PROVINCE_ID}
                </div>
            </div>
        `;

        // Show districts
        this.showDistrictsForProvince(province.PROVINCE_ID);

        // Scroll to details section on mobile
        if (window.innerWidth <= 768) {
            detailsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showDistrictsForProvince(provinceId) {
        const districts = this.data.districts.filter(d => d.PROVINCE_ID === provinceId);
        const districtsSection = document.getElementById('districts-section');
        const districtsList = document.getElementById('districts-list');

        if (districts.length === 0) {
            districtsSection.style.display = 'none';
            return;
        }

        districtsList.innerHTML = districts.map(district => {
            const name = this.currentLanguage === 'thai' ? district.DISTRICT_THAI : district.DISTRICT_ENGLISH;
            const altName = this.currentLanguage === 'thai' ? district.DISTRICT_ENGLISH : district.DISTRICT_THAI;

            return `
                <div class="district-item">
                    <div class="district-name">${name}</div>
                    <div class="district-alt-name">${altName}</div>
                    <div class="district-code">Code: ${district.CODE}</div>
                </div>
            `;
        }).join('');

        districtsSection.style.display = 'block';
    }

    closeDistrictsSection() {
        document.getElementById('districts-section').style.display = 'none';
        document.querySelectorAll('.province-card, .featured-card').forEach(card => {
            card.classList.remove('selected');
        });
        this.selectedProvince = null;
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        loading.style.display = show ? 'flex' : 'none';
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        const icon = toast.querySelector('i');

        toastMessage.textContent = message;

        // Update icon based on type
        icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';

        toast.classList.remove('success', 'error');
        toast.classList.add(type, 'show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThailandGeodataApp();
});

// Handle responsive behavior
window.addEventListener('resize', () => {
    // Add any responsive adjustments here if needed
});