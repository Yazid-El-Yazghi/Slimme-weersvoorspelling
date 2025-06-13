const gemeenten = [
    { naam: "Antwerpen", lat: 51.2194, lon: 4.4025, kleur: "#1976d2" },
    { naam: "Gent", lat: 51.0536, lon: 3.7304, kleur: "#43a047" },
    { naam: "Brugge", lat: 51.2093, lon: 3.2247, kleur: "#fbc02d" },
    { naam: "Leuven", lat: 50.8798, lon: 4.7005, kleur: "#e64a19" },
    { naam: "Mechelen", lat: 51.0257, lon: 4.4776, kleur: "#8e24aa" },
    { naam: "Hasselt", lat: 50.9307, lon: 5.3378, kleur: "#0097a7" },
    { naam: "Kortrijk", lat: 50.8266, lon: 3.2649, kleur: "#c62828" },
    { naam: "Oostende", lat: 51.2300, lon: 2.9126, kleur: "#388e3c" },
    { naam: "Aalst", lat: 50.9360, lon: 4.0355, kleur: "#966dca" },
    { naam: "Sint-Niklaas", lat: 51.1651, lon: 4.1431, kleur: "#0288d1" }
];

let voorspellingGrafiek = null;

function getDatumString(offsetDagen) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDagen);
    return d.toISOString().slice(0, 10);
}

function haalVoorspellingOp(lat, lon) {
    const startDatum = getDatumString(0);
    const eindDatum = getDatumString(7);
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
        + `&daily=precipitation_sum,precipitation_probability_max,windspeed_10m_max,temperature_2m_max,temperature_2m_min`
        + `&timezone=Europe%2FBerlin&start_date=${startDatum}&end_date=${eindDatum}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const dagen = data.daily.time;
            return {
                dagen: dagen,
                neerslag: data.daily.precipitation_sum,
                neerslagkans: data.daily.precipitation_probability_max,
                windsnelheid: data.daily.windspeed_10m_max,
                temp_max: data.daily.temperature_2m_max,
                temp_min: data.daily.temperature_2m_min
            };
        });
}

const seizoenDefinities = [
    { naam: "Winter", maanden: [11, 0, 1], drempel: 300 },
    { naam: "Lente", maanden: [2, 3, 4], drempel: 250 },
    { naam: "Zomer", maanden: [5, 6, 7], drempel: 260 },
    { naam: "Herfst", maanden: [8, 9, 10], drempel: 280 }
];

function bepaalSeizoen(maandIndex) {
    if ([11, 0, 1].includes(maandIndex)) return "Winter";
    if ([2, 3, 4].includes(maandIndex)) return "Lente";
    if ([5, 6, 7].includes(maandIndex)) return "Zomer";
    if ([8, 9, 10].includes(maandIndex)) return "Herfst";
    return null;
}

function controleerOverstromingsgevaarHuidigeMaand(dagen, neerslag) {
    const nu = new Date();
    const huidigeMaand = nu.getMonth();
    const huidigSeizoen = bepaalSeizoen(huidigeMaand);

    let totaal = 0;
    for (let i = 0; i < dagen.length; i++) {
        const datum = new Date(dagen[i]);
        if (datum.getMonth() === huidigeMaand) {
            totaal += neerslag[i] || 0;
        }
    }

    const seizoen = seizoenDefinities.find(s => s.naam === huidigSeizoen);
    if (seizoen && totaal >= seizoen.drempel) {
        return [`⚠️ Gevaar voor overstroming in <b>${huidigSeizoen}</b> (totaal: ${totaal.toFixed(1)} mm, drempel: ${seizoen.drempel} mm)`];
    }
    return [];
}

function haalEnToonAllesOp() {
    const aangevinkt = Array.from(document.querySelectorAll('#gemeente-checkboxes input[type=checkbox]:checked'));
    if (aangevinkt.length === 0) {
        if (voorspellingGrafiek) voorspellingGrafiek.destroy();
        document.getElementById('voorspellingGrafiek').getContext('2d').clearRect(0,0,800,400);
        return;
    }
    const geselecteerd = aangevinkt.map(cb => cb.value);
    const gemeenteObjecten = geselecteerd.map(val => {
        const [lat, lon] = val.split(',');
        return gemeenten.find(g => g.lat == lat && g.lon == lon);
    });

    Promise.all(
        gemeenteObjecten.map(g =>
            haalVoorspellingOp(g.lat, g.lon).then(res => ({
                naam: g.naam,
                kleur: g.kleur,
                lat: g.lat,
                lon: g.lon,
                ...res
            }))
        )
    ).then(resultaten => {
        const dagen = resultaten[0].dagen;
        const datasets = resultaten.map((g, idx) => ({
            label: g.naam,
            data: g.neerslag,
            backgroundColor: g.kleur + "99",
            borderColor: g.kleur,
            borderWidth: 2,
            fill: false,
            type: 'line',
            tension: 0.2,
            pointRadius: 4
        }));

        const ctx = document.getElementById('voorspellingGrafiek').getContext('2d');
        if (voorspellingGrafiek) voorspellingGrafiek.destroy();
        voorspellingGrafiek = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dagen,
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y} mm`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Neerslag (mm)' }
                    }
                }
            }
        });
    });
}

haalEnToonAllesOp();

document.getElementById('gemeente-checkboxes').addEventListener('change', haalEnToonAllesOp);
