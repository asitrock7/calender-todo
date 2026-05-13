const express = require('express');
const { getPanchangam, Observer, tithiNames, getFestivals } = require('@ishubhamx/panchangam-js');
const app = express();
const path = require('path');

app.use(express.json());

// API to get Panchang data for a specific month
app.get('/api/panchang', (req, res) => {
    const { year, month } = req.query;
    const obs = new Observer(23.2599, 77.4126, 500); // Default for India
    const daysInMonth = new Date(year, parseInt(month) + 1, 0).getDate();
    let data = [];

    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const p = getPanchangam(dateObj, obs, { timezoneOffset: 330 });
        const f = getFestivals({ date: dateObj, observer: obs, timezoneOffset: 330 });
        
        data.push({
            day: d,
            weekday: dateObj.getDay(),
            tithi: tithiNames[p.tithi],
            festivals: f.map(fest => fest.name)
        });
    }
    res.json(data);
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
