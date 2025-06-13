const years = [
    2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
    2015,2016,2017,2018,2019,2020,2021,2022,2023,2024
];
const months = [
    "Januari", "Februari", "Maart", "April", "Mei",
    "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"
];
const allData = [
    [67,54,73,68,74,79,98,89,68,98,98,108],
    [66,45,61,57,70,82,85,78,77,94,100,103],
    [62,56,64,62,72,79,87,94,70,90,104,104],
    [66,45,63,61,79,81,89,83,63,91,98,115],
    [67,46,72,58,72,83,95,90,66,93,102,115],
    [63,54,64,54,79,87,90,90,72,92,102,118],
    [65,63,57,64,75,79,90,75,69,97,107,107],
    [61,52,75,62,72,83,90,90,66,93,98,103],
    [66,56,70,59,68,78,88,81,69,97,109,111],
    [66,55,60,60,75,92,89,87,70,89,106,114],
    [69,50,77,53,78,91,85,82,70,92,92,110],
    [60,57,65,68,71,78,94,79,71,102,92,111],
    [66,59,64,53,78,81,91,87,67,96,101,106],
    [74,57,64,63,70,84,96,81,75,97,104,119],
    [64,51,66,56,75,82,91,89,70,102,99,124],
    [68,51,65,62,74,84,92,85,66,87,98,114],
    [66,49,71,62,71,81,90,79,72,98,105,115],
    [58,50,73,63,78,99,93,91,75,98,98,114],
    [61,54,68,60,87,71,93,77,68,100,100,105],
    [61,58,66,61,75,77,101,88,60,96,97,114]
];

let data2025 = [];

const yearSelect = document.getElementById('year-select');
years.forEach((year, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = year;
    if (year === 2024) opt.selected = true;
    yearSelect.appendChild(opt);
});

function renderTable(data) {
    const tbody = document.querySelector('#rain-table tbody');
    tbody.innerHTML = '';
    let lastFilledMonth = data.length;
    for (let i = 0; i < lastFilledMonth; i++) {
        if (data[i] == null) break;
        const tr = document.createElement('tr');
        const maandTd = document.createElement('td');
        maandTd.textContent = months[i];
        const valTd = document.createElement('td');
        valTd.textContent = data[i];
        tr.appendChild(maandTd);
        tr.appendChild(valTd);
        tbody.appendChild(tr);
    }
}

let rainChart = null;
const seasons = [
    { name: "Winter", months: [11, 0, 1], threshold: 300 },
    { name: "Lente", months: [2, 3, 4], threshold: 250 },
    { name: "Zomer", months: [5, 6, 7], threshold: 260 },
    { name: "Herfst", months: [8, 9, 10], threshold: 280 }
];

function renderChart(yearIdx) {
    let data;
    if (years[yearIdx] === 2025) {
        data = data2025.length > 0 ? data2025 : Array(12).fill(null);
    } else {
        data = allData[yearIdx];
    }
    const bgColors = data.map(val => '#4BB8F4');
    const ctx = document.getElementById('rainChart').getContext('2d');
    if (rainChart) rainChart.destroy();
    const maxValue = Math.max(...data.filter(v => v !== null));
    const yMax = Math.ceil((maxValue || 100) / 10) * 10;
    rainChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Neerslag (mm)',
                data: data,
                backgroundColor: bgColors,
                borderRadius: 8,
                borderSkipped: false,
                maxBarThickness: 60
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: yMax,
                    title: {
                        display: true,
                        text: 'Neerslag (mm)'
                    },
                    ticks: {
                        stepSize: 10
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
    const warningsDiv = document.getElementById('season-warnings');
    warningsDiv.innerHTML = '';
    seasons.forEach(season => {
        const sum = season.months.reduce((acc, idx) => acc + (data[idx] || 0), 0);
        if (sum >= season.threshold) {
            const warning = document.createElement('div');
            warning.className = 'flood-warning-label';
            warning.innerHTML = `<span class="flood-icon">⚠️</span> Gevaar voor overstroming in <b>${season.name}</b> (totaal: ${sum.toFixed(2)} mm, drempel: ${season.threshold} mm)`;
            warningsDiv.appendChild(warning);
        }
    });
    document.getElementById('selected-year').textContent = years[yearIdx];
    renderTable(data);
}

if (!years.includes(2025)) {
    years.push(2025);
    const opt = document.createElement('option');
    opt.value = years.length - 1;
    opt.textContent = 2025;
    yearSelect.appendChild(opt);
}

window.onload = function() {
    const index2024 = years.indexOf(2024);
    if (index2024 !== -1) {
        yearSelect.value = index2024;
        renderChart(index2024);
    }
};

yearSelect.onchange = function() {
    const idx = Number(this.value);
    if (years[idx] === 2025) {
        fetch('/api/neerslag/2025')
            .then(resp => resp.json())
            .then(json => {
                data2025 = json.data;
                while (data2025.length < 12) data2025.push(null);
                renderChart(idx);
            });
    } else {
        renderChart(idx);
    }
};
