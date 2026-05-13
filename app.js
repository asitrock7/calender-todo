const express = require('express');
const { getPanchangam, Observer, tithiNames, getFestivals } = require('@ishubhamx/panchangam-js');
const path = require('path');
const app = express();

app.use(express.json());

// API route
app.get('/api/panchang', (req, res) => {
    try {
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);
        
        const obs = new Observer(23.2599, 77.4126, 500); 
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let monthData = [];

        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const p = getPanchangam(dateObj, obs, { timezoneOffset: 330 });
            const f = getFestivals({ date: dateObj, observer: obs, timezoneOffset: 330 });
            
            monthData.push({
                day: d,
                tithi: tithiNames[p.tithi],
                festivals: f.map(fest => fest.name)
            });
        }
        res.json(monthData);
    } catch (err) {
        res.status(500).json({ error: "Failed to calculate Panchang" });
    }
});

// Serve the index.html from the same directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Hostinger uses environment variables for Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
