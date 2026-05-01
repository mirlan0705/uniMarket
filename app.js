// edited by mrln
const path = require('path');
const express = require('express');
const cors = require('cors');
const listingsRouter = require('./routes/listings');
const authRouter = require('./routes/auth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('Coursework'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.redirect('/html/unimarket.html'));

app.use('/api/listings', listingsRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
