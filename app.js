const express = require('express');
const app = express();
const db = require('./database');

app.use(express.json());

app.use(express.static('Coursework'));
app.get('/', (req, res) => res.sendFile(__dirname + '/Coursework/html/unimarket.html'));

app.get('/listings', (req, res) => {
    const listings = db.prepare('SELECT * FROM listings').all();
    res.json(listings);
});

app.post('/listings', (req, res) => {
    const { title, price, description, category, image } = req.body;
    const result = db.prepare('INSERT INTO listings (title, price, description, category, image) VALUES (?, ?, ?, ?, ?)').run(title, price, description, category, image);
    res.json({ id: result.lastInsertRowid });
});

app.listen(3000, () => console.log('Running on http://localhost:3000'));
