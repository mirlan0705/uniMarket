const express = require('express');
const router = express.Router();
const db = require('../DB/database.js');

// GET all listings
router.get('/', (req, res) => {
  const listings = db.prepare('SELECT * FROM listings').all();
  res.json(listings);
});

// POST a new listing
router.post('/', (req, res) => {
  const { title, description, price, condition, image_url, category_id, subcategory_id } = req.body;
  const result = db.prepare(
    'INSERT INTO listings (title, description, price, condition, image_url, category_id, subcategory_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description, price, condition, image_url, category_id, subcategory_id);
  res.json({ id: result.lastInsertRowid });
});

module.exports = router;
