// Initialiseer de Leaflet kaart
const map = L.map('map').setView([51.0, 4.5], 8);

// Voeg de OpenStreetMap laag toe
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Variabelen voor radar animatie
let radarFrames = [];
let radarLayers = [];
let currentFrame = 0;
let animatieInterval = null;

// Haal radar data op van RainViewer API
fetch("https://api.rainviewer.com/public/weather-maps.json")
    .then(response => response.json())
    .then(data => {
        const host = data.host;
        const frames = data.radar.past;
        const color = 3;
        const smooth = 1;
        const snow = 0;
        const size = 256;

        // Maak een Leaflet laag voor elk radar frame
        radarFrames = frames.map(f => {
            const path = f.path;
            return L.tileLayer(`${host}${path}/${size}/{z}/{x}/{y}/${color}/${smooth}_${snow}.png`, {
                tileSize: size,
                opacity: 0.6,
                attribution: 'Radar data © RainViewer'
            });
        });

        // Toon het laatste radar frame standaard
        if (radarFrames.length > 0) {
            radarLayers = radarFrames;
            radarLayers[radarLayers.length - 1].addTo(map);
        }
    });

// Start de animatie van de radar frames
function startAnimatie() {
    if (radarLayers.length === 0) return;

    if (animatieInterval) clearInterval(animatieInterval);

    radarLayers.forEach(layer => map.removeLayer(layer));
    currentFrame = 0;

    animatieInterval = setInterval(() => {
        radarLayers.forEach(layer => map.removeLayer(layer));
        radarLayers[currentFrame].addTo(map);
        currentFrame = (currentFrame + 1) % radarLayers.length;
    }, 800);
}
