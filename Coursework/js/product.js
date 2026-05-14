
function toggleCategory(element) {
    const currentCategory = element.parentElement;
    const allCategories = document.querySelectorAll(".category");

    allCategories.forEach(category => {
        const arrow = category.querySelector(".arrowicon");
        if (category !== currentCategory) {
            category.classList.remove("active");
            if (arrow) arrow.src = "/images/arrowdown.png";
        }
    });

    currentCategory.classList.toggle("active");
    const currentArrow = currentCategory.querySelector(".arrowicon");
    currentArrow.src = currentCategory.classList.contains("active")
        ? "/images/arrowup.png"
        : "/images/arrowdown.png";
}
// Gallery
let images = [];
let currentIndex = 0;

function showImage(index) {
    currentIndex = index;
    document.getElementById('main-image').src = images[index];
    document.getElementById('image-counter').textContent = `${index + 1}/${images.length}`;

    document.querySelectorAll('.thumbnail-img').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });

    const showArrows = images.length > 1;
    document.getElementById('prev-btn').style.display = showArrows ? '' : 'none';
    document.getElementById('next-btn').style.display = showArrows ? '' : 'none';
}

function buildThumbnails() {
    const container = document.getElementById('thumbnails');
    container.innerHTML = images.map((src, i) => `
        <img class="thumbnail-img ${i === 0 ? 'active' : ''}" src="${src}" alt="Thumbnail ${i + 1}" onclick="showImage(${i})">
    `).join('');
}

// Wishlist helpers 
function getWishlist() { return JSON.parse(localStorage.getItem('wishlist')) || []; }
function setWishlist(list) { localStorage.setItem('wishlist', JSON.stringify(list)); }

function updateWishlistUI(inWishlist) {
    const heartIcon = document.querySelector('#wishlist-btn i');
    const cardBtn   = document.getElementById('wishlist-btn-card');

    if (heartIcon) {
        heartIcon.className = inWishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        document.getElementById('wishlist-btn').classList.toggle('saved', inWishlist);
    }
    if (cardBtn) {
        cardBtn.textContent = inWishlist ? 'Saved to Wishlist' : 'Add to Wishlist';
        cardBtn.classList.toggle('saved', inWishlist);
    }
}

// Basket helpers
function getBasket() { return JSON.parse(localStorage.getItem('basket')) || []; }
function setBasket(list) { localStorage.setItem('basket', JSON.stringify(list)); }

function updateBasketUI(inBasket) {
    const btn = document.getElementById('basket-btn');
    btn.textContent = inBasket ? 'In Basket' : 'Add to Basket';
    btn.classList.toggle('added', inBasket);
}

// Load product 
async function loadProduct() {
    const id = Number(new URLSearchParams(window.location.search).get('id'));

    if (!id) {
        document.getElementById('product-title').textContent = 'No product ID in URL.';
        return;
    }

    try {
        const res = await fetch('/api/listings');
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const listings = await res.json();

        const item = listings.find(l => Number(l.id) === id);
        if (!item) {
            document.getElementById('product-title').textContent = 'Product not found.';
            return;
        }

        // Populate text fields
        document.getElementById('product-title').textContent        = item.title;
        document.querySelectorAll('#product-price').forEach(el => {
            el.textContent = Number(item.price).toLocaleString('en-GB', { minimumFractionDigits: 2 });
        });
        document.getElementById('product-condition').textContent    = item.condition || '—';
        document.getElementById('product-description').textContent  = item.description || 'No description provided.';
        document.getElementById('product-category').textContent  = item.category_name || 'Undefined.';
        document.title = `${item.title} — UniMarket`;

        // Build image gallery
        try {
            images = item.image_url ? JSON.parse(item.image_url) : [];
        } catch {
            images = item.image_url ? [item.image_url] : [];
        }
        if (images.length === 0) images = ['/images/no-image.png'];
        buildThumbnails();
        showImage(0);

        // Set initial wishlist / basket state
        const inWishlist = getWishlist().some(w => w.id === item.id);
        const inBasket   = getBasket().some(b => b.id === item.id);
        updateWishlistUI(inWishlist);
        updateBasketUI(inBasket);

        // Wishlist toggle gallery heart button
        document.getElementById('wishlist-btn').addEventListener('click', () => {
            let list = getWishlist();
            const idx = list.findIndex(w => w.id === item.id);
            if (idx === -1) list.push(item); else list.splice(idx, 1);
            setWishlist(list);
            updateWishlistUI(idx === -1);
        });

        // Wishlist toggle purchase card button
        document.getElementById('wishlist-btn-card').addEventListener('click', () => {
            let list = getWishlist();
            const idx = list.findIndex(w => w.id === item.id);
            if (idx === -1) list.push(item); else list.splice(idx, 1);
            setWishlist(list);
            updateWishlistUI(idx === -1);
        });

        // Basket toggle
        document.getElementById('basket-btn').addEventListener('click', () => {
            let list = getBasket();
            const idx = list.findIndex(b => b.id === item.id);
            if (idx === -1) {
                list.push({
                    id:        item.id,
                    title:     item.title,
                    price:     item.price,
                    condition: item.condition,
                    image_url: images[0] || '/images/no-image.png',
                    qty:       1
                });
            } else {
                list.splice(idx, 1);
            }
            setBasket(list);
            updateBasketUI(idx === -1);
        });

    } catch (err) {
        document.getElementById('product-title').textContent = 'Could not load product.';
        console.error('product.js error:', err.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const q = document.getElementById('search').value.trim();
            window.location.href = `/html/results.html?q=${encodeURIComponent(q)}`;
        });
    }

    document.getElementById('prev-btn').addEventListener('click', () => {
        showImage((currentIndex - 1 + images.length) % images.length);
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        showImage((currentIndex + 1) % images.length);
    });

    loadProduct();
});

