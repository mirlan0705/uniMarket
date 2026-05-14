const express = require('express');
const router = express.Router();
const db = require('../DB/database.js');
const path = require('path');
const multer = require('multer');

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

//edited by serine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// GET all categories
router.get('/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories').all();
  res.json(categories);
});

// GET subcategories by category
router.get('/subcategories', (req, res) => {
  const { category_id } = req.query;

  const subcategories = db.prepare(
    'SELECT * FROM subcategories WHERE category_id = ?'
  ).all(category_id);

  res.json(subcategories);
});

// POST a new listing
router.post('/', upload.array('images', 8), (req, res) => {

  const { title, description, price, condition, category_id, subcategory_id } = req.body;

  const image_url = req.files && req.files.length > 0
        ? JSON.stringify(req.files.map(f => `/uploads/${f.filename}`))
        : null;

  const result = db.prepare(
    'INSERT INTO listings (title, description, price, condition, image_url, category_id, subcategory_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description, price, condition, image_url, category_id, subcategory_id);

  res.json({ id: result.lastInsertRowid });
});

module.exports = router;
