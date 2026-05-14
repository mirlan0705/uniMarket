
// dummy data for testing purposes only
const db = require('./DB/database.js');

const listings = [
  { title: 'MacBook Pro 2021', description: 'Great condition, barely used', price: 800, condition: 'Used - Like New', image_url: '/images/macbookpro.jpg', category_id: 1, subcategory_id: 7 },
  { title: 'iPhone 13', description: 'Cracked screen but works fine', price: 250, condition: 'Used - Good', image_url: '/images/iphone-13.avif', category_id: 1, subcategory_id: 7 },
  { title: 'Calculus Textbook', description: 'James Stewart 8th edition', price: 20, condition: 'Used - Good', image_url: '/images/calculus-textbook.jpg', category_id: 2, subcategory_id: 11 },
  { title: 'Desk Lamp', description: 'LED, adjustable brightness', price: 15, condition: 'Used - Like New', image_url: '/images/desk-lamp.avif', category_id: 4, subcategory_id: 20 },
  { title: 'PS5 ', description: 'DualSense, white', price: 560, condition: 'Used - Good', image_url: '/images/ps5.webp', category_id: 5, subcategory_id: 24 },
  { title: 'IKEA Desk Chair', description: 'Black, some wear on armrests', price: 30, condition: 'Used - Fair', image_url: '/images/ikea-desk-chair.avif', category_id: 4, subcategory_id: 20 },
  { title: 'Python Programming Book', description: 'Automate the Boring Stuff', price: 10, condition: 'Used - Good', image_url: null, category_id: 2, subcategory_id: 11 },
  { title: 'Acoustic Guitar', description: 'Yamaha F310, comes with case', price: 120, condition: 'Used - Good', image_url: '/images/electricguitar.jpg', category_id: 5, subcategory_id: 26 },
];

const insert = db.prepare(
  'INSERT INTO listings (title, description, price, condition, image_url, category_id, subcategory_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
);

const insertMany = db.transaction((rows) => {
  for (const row of rows) {
    insert.run(row.title, row.description, row.price, row.condition, row.image_url, row.category_id, row.subcategory_id);
  }
});

insertMany(listings);
console.log(`Inserted ${listings.length} listings.`);