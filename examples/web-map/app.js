const GEOJSON_URL = 'https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json';
const THAILAND_BOUNDS = [[5.5, 97.0], [20.6, 105.7]];
const CHOROPLETH_STOPS = [
    { max: 5,  color: '#ede7f6' },
    { max: 10, color: '#d1c4e9' },
    { max: 15, color: '#b39ddb' },
    { max: 20, color: '#9575cd' },
    { max: 30, color: '#7e57c2' },
    { max: Infinity, color: '#5e35b1' }
];

const NAME_ALIASES = {
    'bangkok metropolis': 'bangkok',
    'krung thep maha nakhon': 'bangkok',
    'buri ram': 'buriram',
    'chai nat': 'chainat',
    'chon buri': 'chonburi',
    'kalasin': 'kalasin',
    'lop buri': 'lopburi',
    'nong khai': 'nong khai',
    'phra nakhon si ayutthaya': 'ayutthaya',
    'ayutthaya': 'ayutthaya',
    'prachin buri': 'prachinburi',
    'prachuap khiri khan': 'prachuap khiri khan',
    'samut prakan': 'samut prakan',
    'samut sakhon': 'samut sakhon',
    'samut songkhram': 'samut songkhram',
    'sing buri': 'singburi',
    'si sa ket': 'sisaket',
    'surin': 'surin',
    'tak': 'tak',
    'ubon ratchathani': 'ubon ratchathani',
    'udon thani': 'udon thani'
};

class ThailandMapApp {
    constructor() {
        this.data = { provinces: [], districts: [], subDistricts: [] };
        this.provinceById = new Map();
        this.districtById = new Map();
        this.layerByProvinceId = new Map();
        this.currentLanguage = 'thai';
        this.selectedProvinceId = null;
        this.map = null;
        this.geoLayer = null;

        this.init();
    }

    async init() {
        this.bindEvents();
        try {
            await this.loadData();
            this.updateStats();
            this.renderLegend();
            this.initMap();
        } catch (error) {
            this.showStatus(`Failed to load map data: ${error.message || error}`, true);
        } finally {
            this.hideLoading();
        }
    }

    bindEvents() {
        document.getElementById('lang-thai').addEventListener('click', () => this.setLanguage('thai'));
        document.getElementById('lang-english').addEventListener('click', () => this.setLanguage('english'));
        document.getElementById('reset-view').addEventListener('click', () => this.resetView());
    }

    async loadData() {
        const baseUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? '../../'
            : 'https://raw.githubusercontent.com/dhanabhon/thailand-geodata/main/';

        const [provinces, districts, subDistricts, geojson] = await Promise.all([
            this.fetchJson(`${baseUrl}json/provinces.json`),
            this.fetchJson(`${baseUrl}json/districts.json`),
            this.fetchJson(`${baseUrl}json/sub_districts.json`),
            this.fetchJson(GEOJSON_URL)
        ]);

        this.data.provinces = provinces.provinces || [];
        this.data.districts = districts.districts || [];
        this.data.subDistricts = subDistricts.sub_districts || [];
        this.geojson = geojson;

        this.provinceById = new Map(this.data.provinces.map(p => [p.PROVINCE_ID, p]));
        this.districtById = new Map(this.data.districts.map(d => [d.DISTRICT_ID, d]));

        this.provinceByKey = new Map();
        for (const province of this.data.provinces) {
            for (const key of this.keysFor(province.PROVINCE_ENGLISH)) {
                if (!this.provinceByKey.has(key)) {
                    this.provinceByKey.set(key, province);
                }
            }
        }
    }

    async fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText} (${url})`);
        }
        return response.json();
    }

    keysFor(rawName) {
        if (!rawName) return [];
        const lowered = rawName.toLowerCase().trim();
        const stripped = lowered
            .replace(/^(changwat|จังหวัด)\s+/i, '')
            .replace(/\s+/g, ' ')
            .trim();
        const collapsed = stripped.replace(/\s+/g, '');
        const aliased = NAME_ALIASES[stripped] || NAME_ALIASES[collapsed];
        const set = new Set([stripped, collapsed]);
        if (aliased) {
            set.add(aliased);
            set.add(aliased.replace(/\s+/g, ''));
        }
        return [...set];
    }

    matchProvince(feature) {
        const props = feature.properties || {};
        const candidates = [props.name, props.NAME_1, props.NL_NAME_1, props.pro_en, props.pro_th]
            .filter(Boolean);
        for (const candidate of candidates) {
            for (const key of this.keysFor(candidate)) {
                if (this.provinceByKey.has(key)) {
                    return this.provinceByKey.get(key);
                }
            }
        }
        return null;
    }

    updateStats() {
        document.getElementById('stat-provinces').textContent = this.data.provinces.length.toLocaleString();
        document.getElementById('stat-districts').textContent = this.data.districts.length.toLocaleString();
        document.getElementById('stat-sub-districts').textContent = this.data.subDistricts.length.toLocaleString();
    }

    renderLegend() {
        const bar = document.getElementById('legend-bar');
        bar.innerHTML = CHOROPLETH_STOPS.map((stop, idx) => {
            const prev = idx === 0 ? 0 : CHOROPLETH_STOPS[idx - 1].max;
            const label = stop.max === Infinity ? `${prev}+` : `${prev}–${stop.max}`;
            return `<span class="legend-swatch" style="background:${stop.color}" title="${label}"></span>`;
        }).join('') + `<span class="legend-range">few → many</span>`;
    }

    initMap() {
        this.map = L.map('map', {
            zoomControl: true,
            attributionControl: true,
            minZoom: 4,
            maxZoom: 11
        });
        this.map.fitBounds(THAILAND_BOUNDS);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        this.geoLayer = L.geoJSON(this.geojson, {
            style: feature => this.styleFor(feature),
            onEachFeature: (feature, layer) => this.bindFeature(feature, layer)
        }).addTo(this.map);

        const unmatched = this.geojson.features.filter(f => !this.matchProvince(f));
        if (unmatched.length > 0) {
            console.warn('Unmatched provinces in GeoJSON:', unmatched.map(f => f.properties && f.properties.name));
        }
    }

    districtCountFor(provinceId) {
        let count = 0;
        for (const district of this.data.districts) {
            if (district.PROVINCE_ID === provinceId) count += 1;
        }
        return count;
    }

    subDistrictsFor(provinceId) {
        const districtIds = new Set();
        for (const district of this.data.districts) {
            if (district.PROVINCE_ID === provinceId) districtIds.add(district.DISTRICT_ID);
        }
        return this.data.subDistricts.filter(sd => districtIds.has(sd.DISTRICT_ID));
    }

    colorFor(count) {
        for (const stop of CHOROPLETH_STOPS) {
            if (count <= stop.max) return stop.color;
        }
        return CHOROPLETH_STOPS[CHOROPLETH_STOPS.length - 1].color;
    }

    styleFor(feature) {
        const province = this.matchProvince(feature);
        const count = province ? this.districtCountFor(province.PROVINCE_ID) : 0;
        const isSelected = province && province.PROVINCE_ID === this.selectedProvinceId;
        return {
            fillColor: province ? this.colorFor(count) : '#eceff1',
            weight: isSelected ? 2.5 : 0.7,
            color: isSelected ? '#311b92' : '#ffffff',
            fillOpacity: province ? 0.85 : 0.4
        };
    }

    bindFeature(feature, layer) {
        const province = this.matchProvince(feature);
        if (province) {
            this.layerByProvinceId.set(province.PROVINCE_ID, layer);
            layer.bindTooltip(this.tooltipText(province), { sticky: true, direction: 'top' });
        } else {
            const fallback = (feature.properties && feature.properties.name) || 'Unknown';
            layer.bindTooltip(fallback, { sticky: true, direction: 'top' });
        }

        layer.on({
            mouseover: () => this.onHover(layer, true),
            mouseout: () => this.onHover(layer, false),
            click: () => province && this.selectProvince(province)
        });
    }

    tooltipText(province) {
        const primary = this.currentLanguage === 'thai' ? province.PROVINCE_THAI : province.PROVINCE_ENGLISH;
        const districts = this.districtCountFor(province.PROVINCE_ID);
        return `<strong>${this.escapeHtml(primary)}</strong><br>${districts} districts`;
    }

    onHover(layer, entering) {
        if (entering) {
            layer.setStyle({ weight: 2, color: '#5e35b1', fillOpacity: 0.9 });
            layer.bringToFront();
        } else {
            this.geoLayer.resetStyle(layer);
            const selectedLayer = this.layerByProvinceId.get(this.selectedProvinceId);
            if (selectedLayer) selectedLayer.bringToFront();
        }
    }

    selectProvince(province) {
        this.selectedProvinceId = province.PROVINCE_ID;
        this.geoLayer.eachLayer(layer => this.geoLayer.resetStyle(layer));

        const layer = this.layerByProvinceId.get(province.PROVINCE_ID);
        if (layer) {
            layer.setStyle({ weight: 2.5, color: '#311b92', fillOpacity: 0.95 });
            layer.bringToFront();
            this.map.fitBounds(layer.getBounds(), { padding: [40, 40], maxZoom: 9 });
        }

        this.renderInfoPanel(province);
    }

    renderInfoPanel(province) {
        document.getElementById('info-default').hidden = true;
        document.getElementById('info-detail').hidden = false;

        const primary = this.currentLanguage === 'thai' ? province.PROVINCE_THAI : province.PROVINCE_ENGLISH;
        const alt = this.currentLanguage === 'thai' ? province.PROVINCE_ENGLISH : province.PROVINCE_THAI;

        document.getElementById('info-code').textContent = province.CODE;
        document.getElementById('info-name-primary').textContent = primary;
        document.getElementById('info-name-alt').textContent = alt;

        const districts = this.data.districts.filter(d => d.PROVINCE_ID === province.PROVINCE_ID);
        const subDistricts = this.subDistrictsFor(province.PROVINCE_ID);
        const postalCodes = [...new Set(subDistricts.map(sd => sd.POSTAL_CODE).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b));

        document.getElementById('info-district-count').textContent = districts.length.toLocaleString();
        document.getElementById('info-sub-count').textContent = subDistricts.length.toLocaleString();
        document.getElementById('info-postal-count').textContent = postalCodes.length.toLocaleString();

        const postalList = document.getElementById('info-postal-list');
        postalList.innerHTML = postalCodes.length > 0
            ? postalCodes.map(code => `<span class="postal-chip">${this.escapeHtml(code)}</span>`).join('')
            : '<span class="empty-text">No postal codes available</span>';

        const districtList = document.getElementById('info-district-list');
        districtList.innerHTML = districts
            .map(district => {
                const name = this.currentLanguage === 'thai' ? district.DISTRICT_THAI : district.DISTRICT_ENGLISH;
                const subCount = this.data.subDistricts.filter(sd => sd.DISTRICT_ID === district.DISTRICT_ID).length;
                return `
                    <li>
                        <span class="district-name">${this.escapeHtml(name)}</span>
                        <span class="district-count">${subCount} sub-districts</span>
                    </li>
                `;
            })
            .join('');
    }

    setLanguage(lang) {
        if (this.currentLanguage === lang) return;
        this.currentLanguage = lang;
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`lang-${lang}`).classList.add('active');

        this.layerByProvinceId.forEach((layer, provinceId) => {
            const province = this.provinceById.get(provinceId);
            if (province) layer.setTooltipContent(this.tooltipText(province));
        });

        if (this.selectedProvinceId) {
            const province = this.provinceById.get(this.selectedProvinceId);
            if (province) this.renderInfoPanel(province);
        }
    }

    resetView() {
        this.selectedProvinceId = null;
        if (this.geoLayer) {
            this.geoLayer.eachLayer(layer => this.geoLayer.resetStyle(layer));
        }
        if (this.map) {
            this.map.fitBounds(THAILAND_BOUNDS);
        }
        document.getElementById('info-default').hidden = false;
        document.getElementById('info-detail').hidden = true;
    }

    showStatus(message, isError = false) {
        const el = document.getElementById('map-status');
        el.textContent = message;
        el.classList.toggle('error', isError);
        el.hidden = false;
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }

    escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThailandMapApp();
});
