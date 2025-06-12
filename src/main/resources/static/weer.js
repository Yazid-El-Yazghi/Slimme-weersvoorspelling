// Lijst van gemeenten met naam, coördinaten en kleur voor de grafiek
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

// Chart.js grafiek object
let voorspellingGrafiek = null;

// Geeft een datumstring terug voor vandaag + offsetDagen
function getDatumString(offsetDagen) {
    // Berekent de datum als string voor de API
    const d = new Date();
    d.setDate(d.getDate() + offsetDagen);
    return d.toISOString().slice(0, 10);
}

// Haalt de voorspelling op voor een gemeente via de Open-Meteo API
function haalVoorspellingOp(lat, lon) {
    //Bouwt de API-url en haalt de data op
    const startDatum = getDatumString(0);
    const eindDatum = getDatumString(7);
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
        + `&daily=precipitation_sum,precipitation_probability_max,windspeed_10m_max,temperature_2m_max,temperature_2m_min`
        + `&timezone=Europe%2FBerlin&start_date=${startDatum}&end_date=${eindDatum}`;

    // Voert de fetch uit en retourneert de data voor de grafiek
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Retourneert alle relevante data voor de grafiek en tooltip
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

//arary seizoenen en hun overstromingsgevaar maximum drempels
const seizoenDefinities = [
    { naam: "Winter", maanden: [11, 0, 1], drempel: 300 },
    { naam: "Lente", maanden: [2, 3, 4], drempel: 250 },
    { naam: "Zomer", maanden: [5, 6, 7], drempel: 260 },
    { naam: "Herfst", maanden: [8, 9, 10], drempel: 280 }
];

//Bepaalt het seizoen op basis van maandindex
function bepaalSeizoen(maandIndex) {
    //Geeft de seizoensnaam terug voor een maandindex
    if ([11, 0, 1].includes(maandIndex)) return "Winter";
    if ([2, 3, 4].includes(maandIndex)) return "Lente";
    if ([5, 6, 7].includes(maandIndex)) return "Zomer";
    if ([8, 9, 10].includes(maandIndex)) return "Herfst";
    return null;
}

// Controleert of er overstromingsgevaar is in de huidige maand
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

    //Zoekt het seizoen dat past bij de huidige maand
    const seizoen = seizoenDefinities.find(s => s.naam === huidigSeizoen);
    if (seizoen && totaal >= seizoen.drempel) {
        return [`⚠️ Gevaar voor overstroming in <b>${huidigSeizoen}</b> (totaal: ${totaal.toFixed(1)} mm, drempel: ${seizoen.drempel} mm)`];
    }
    return [];
}

//Haalt het overstromingsgevaar op via de backend endpoint
function haalOverstromingsgevaarOp(lat, lon) {
    // Vraagt flood-risk endpoint aan voor deze locatie
    return fetch(`/flood-risk?latitude=${lat}&longitude=${lon}`)
        .then(res => res.text());
}

//haalt alle data op en tekent de grafiek + waarschuwingen
function haalEnToonAllesOp() {
    //haalt de aangevinkte gemeenten op
    const aangevinkt = Array.from(document.querySelectorAll('#gemeente-checkboxes input[type=checkbox]:checked'));
    if (aangevinkt.length === 0) {
        // Leegt de grafiek en waarschuwingen als niets geselecteerd
        if (voorspellingGrafiek) voorspellingGrafiek.destroy();
        document.getElementById('voorspellingGrafiek').getContext('2d').clearRect(0,0,800,400);
        document.getElementById('api-seizoen-waarschuwingen').innerHTML = '';
        return;
    }
    //zet de geselecteerde gemeenten om naar objecten
    const geselecteerd = aangevinkt.map(cb => cb.value);
    const gemeenteObjecten = geselecteerd.map(val => {
        const [lat, lon] = val.split(',');
        return gemeenten.find(g => g.lat == lat && g.lon == lon);
    });

    //haal voor elke gemeente de voorspelling op
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
        // Zet de data om naar datasets voor Chart.js
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

        // Teken de grafiek
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
                            // Tooltip toont gemeente en neerslag
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

        //Haal waarschuwingen op via backend en toon ze
        const waarschuwingenDiv = document.getElementById('api-seizoen-waarschuwingen');
        waarschuwingenDiv.innerHTML = '';
        waarschuwingenDiv.style.display = "none";
        Promise.all(
            resultaten.map(g =>
                haalOverstromingsgevaarOp(g.lat, g.lon).then(bericht => ({ naam: g.naam, bericht }))
            )
        ).then(waarschuwingen => {
            waarschuwingen.forEach(w => {
                const div = document.createElement('div');
                //toont groene of rode waarschuwing afhankelijk van het resultaat
                if (w.bericht.trim().toLowerCase().includes('geen overstromingsgevaar')) {
                    div.className = 'overstroming-veilig-label';
                    div.innerHTML = `Geen overstromingsgevaar gedetecteerd in <b>${w.naam}</b>.`;
                } else {
                    div.className = 'overstromings-waarschuwing-label';
                    div.innerHTML = `<span class="overstroming-icoon">⚠️</span> <b>${w.naam}</b>: ${w.bericht.replace(/\n/g, "<br>")}`;
                }
                waarschuwingenDiv.appendChild(div);
            });
        });
    });
}


haalEnToonAllesOp();

//Voeg de checkboxen toe aan de pagina
document.getElementById('gemeente-checkboxes').addEventListener('change', haalEnToonAllesOp);
