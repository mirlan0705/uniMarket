// edited by mrln
const express = require('express');
const router = express.Router();
const db = require('../DB/database.js');

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
        db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, password);
        res.json({ success: true });
    } catch {
        res.status(400).json({ error: 'Email already in use' });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
    if (!user) return res.status(401).json({ error: 'Wrong email or password' });
    res.json({ success: true, name: user.name, email: user.email });
});

module.exports = router;
