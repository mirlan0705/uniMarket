const express = require('express');
const app = express();
const db = require('./database');

app.use(express.json());

app.use(express.static('Coursework'));
app.get('/', (req, res) => res.sendFile(__dirname + '/Coursework/html/unimarket.html'));

app.get('/listings', (req, res) => {
    const listings = db.get('listings').value();
    res.json(listings);
});

app.post('/listings', (req, res) => {
    const { title, price, description, category, image } = req.body;
    const newItem = { id: Date.now(), title, price, description, category, image };
    db.get('listings').push(newItem).write();
    res.json({ id: newItem.id });
});

app.listen(3000, () => console.log('Running on http://localhost:3000'));
