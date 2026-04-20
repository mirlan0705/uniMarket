const express = require('express');
const app = express();

app.use(express.static('Coursework'));
app.get('/', (req, res) => res.sendFile(__dirname + '/Coursework/unimarket.html'));

app.listen(3000, () => console.log('Running on http://localhost:3000'));
