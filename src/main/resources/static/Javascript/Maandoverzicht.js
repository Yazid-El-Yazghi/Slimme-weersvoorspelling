// Gemeentenlijst met naam, lat, lon
const gemeenten = [
    { naam: "Antwerpen", lat: 51.2194, lon: 4.4025 },
    { naam: "Gent", lat: 51.0536, lon: 3.7304 },
    { naam: "Brugge", lat: 51.2093, lon: 3.2247 },
    { naam: "Leuven", lat: 50.8798, lon: 4.7005 },
    { naam: "Mechelen", lat: 51.0257, lon: 4.4776 },
    { naam: "Hasselt", lat: 50.9307, lon: 5.3378 },
    { naam: "Kortrijk", lat: 50.8266, lon: 3.2649 },
    { naam: "Oostende", lat: 51.2300, lon: 2.9126 },
    { naam: "Aalst", lat: 50.9360, lon: 4.0355 },
    { naam: "Sint-Niklaas", lat: 51.1651, lon: 4.1431 }
];

const maandNamen = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
];

let maandChart = null;

function getMaandData(lat, lon, jaar, maand) {
    // maand: 0-based (0 = januari)
    const start = new Date(jaar, maand, 1);
    const eind = new Date(jaar, maand + 1, 0);
    const startStr = start.toISOString().slice(0, 10);
    const eindStr = eind.toISOString().slice(0, 10);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation&start_date=${startStr}&end_date=${eindStr}&timezone=Europe%2FBerlin`;

    return fetch(url)
        .then(res => res.json())
        .then(data => {
            // Sommeer per dag
            const dagen = [];
            const neerslagPerDag = [];
            if (!data.hourly || !data.hourly.time) return { dagen, neerslagPerDag };
            const uren = data.hourly.time;
            const neerslag = data.hourly.precipitation;
            let dagIndex = -1;
            let huidigeDag = "";
            let som = 0;
            for (let i = 0; i < uren.length; i++) {
                const dag = uren[i].slice(0, 10);
                if (dag !== huidigeDag) {
                    if (dagIndex >= 0) {
                        neerslagPerDag.push(Number(som.toFixed(2)));
                    }
                    dagen.push(dag);
                    huidigeDag = dag;
                    som = 0;
                    dagIndex++;
                }
                som += neerslag[i] || 0;
            }
            // Voeg laatste dag toe
            if (dagIndex >= 0) {
                neerslagPerDag.push(Number(som.toFixed(2)));
            }
            return { dagen, neerslagPerDag };
        });
}

function renderMaandGrafiek(lat, lon, naam, jaar, maand) {
    document.getElementById('maand-naam').textContent = maandNamen[maand];
    document.getElementById('jaar').textContent = jaar;
    getMaandData(lat, lon, jaar, maand).then(({ dagen, neerslagPerDag }) => {
        const ctx = document.getElementById('maandGrafiek').getContext('2d');
        if (maandChart) maandChart.destroy();
        maandChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dagen,
                datasets: [{
                    label: `Neerslag per dag (${naam})`,
                    data: neerslagPerDag,
                    backgroundColor: '#4BB8F4',
                    borderRadius: 8,
                    borderSkipped: false,
                    maxBarThickness: 30
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Neerslag (mm)'
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Optioneel: waarschuwing tonen bij veel neerslag
        const totaal = neerslagPerDag.reduce((a, b) => a + b, 0);
        const waarschuwingDiv = document.getElementById('maand-waarschuwing');
        waarschuwingDiv.innerHTML = '';
        if (totaal >= 100) {
            waarschuwingDiv.innerHTML = `<div class="flood-warning-label"><span class="flood-icon">⚠️</span> Veel neerslag deze maand (${totaal.toFixed(1)} mm)</div>`;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const gemeenteSelect = document.getElementById('gemeente-select');
    const vandaag = new Date();
    let jaar = vandaag.getFullYear();
    let maand = vandaag.getMonth();

    // Initieel tonen voor geselecteerde gemeente
    const [lat, lon] = gemeenteSelect.value.split(',');
    const gemeente = gemeenten.find(g => g.lat == lat && g.lon == lon);
    renderMaandGrafiek(gemeente.lat, gemeente.lon, gemeente.naam, jaar, maand);

    gemeenteSelect.addEventListener('change', function() {
        const [lat, lon] = this.value.split(',');
        const gemeente = gemeenten.find(g => g.lat == lat && g.lon == lon);
        renderMaandGrafiek(gemeente.lat, gemeente.lon, gemeente.naam, jaar, maand);
    });
});
