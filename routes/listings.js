const express = require('express');
const router = express.Router();
const db = require('../DB/database.js');

// edited by Bea
// GET all listings columns
router.get('/', (req, res) => {
  const listings = db.prepare(`
    SELECT 
      listings.*,
      categories.name AS category_name,
      subcategories.name AS subcategory_name
    FROM listings
    LEFT JOIN categories 
      ON listings.category_id = categories.id
    LEFT JOIN subcategories 
      ON listings.subcategory_id = subcategories.id
  `).all();

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
