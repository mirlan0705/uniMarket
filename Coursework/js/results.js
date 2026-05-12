
// added by Serine

// category srodown dropdown menu
function toggleCategory(element) {
    const currentCategory = element.parentElement;
    const allCategories = document.querySelectorAll(".category");

    allCategories.forEach(category => {
        const arrow = category.querySelector(".arrowicon");

        // Close everything except the clicked one
        if (category !== currentCategory) {
            category.classList.remove("active");
            if (arrow) arrow.src = "../images/arrowdown.png";
        }
    });

    // Toggle current category
    currentCategory.classList.toggle("active");

    const currentArrow = currentCategory.querySelector(".arrowicon");

    if (currentCategory.classList.contains("active")) {
        currentArrow.src = "../images/arrowup.png";
    } else {
        currentArrow.src = "../images/arrowdown.png";
    }
}

let allListings = [];

// Fetch all listings once and store in memory, then render results from that without needing to re-fetch.
async function fetchAndRender() {
    const grid = document.getElementById('results-grid');
    const query = new URLSearchParams(window.location.search).get('q') || '';

    const searchinput = document.getElementById('search');
    if (searchinput) searchinput.value = query;

    try {
        const res = await fetch('/api/listings');
        if (!res.ok) throw new Error('Failed to fetch listings');
        allListings = await res.json();
    } catch (err) {
        grid.innerHTML = '<p style="color:#ffffff99;padding:20px;grid-column:1/-1;">Could not load listings. Make sure the server is running.</p>';
        return;
    }
    renderResults(query);
}

// Filter and sort the already fetched listings, then render them to the page. 
function renderResults(query) {
    const grid = document.getElementById('results-grid');
    let filtered = [...allListings];

    // Basic search filter - checks if query is a substring of title, description, or category_id (case-insensitive)
    if (query) {
        const q=query.toLowerCase();
        filtered = filtered.filter(item =>
            (item.title || '').toLowerCase().includes(q) ||
            (item.description || '').toLowerCase().includes(q) ||
            String(item.category_id || '').toLowerCase().includes(q)
        );
    }

    // Sorting 
    const sort = document.getElementById('sortby').value;
    if (sort === 'alphabetical-order') filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    if (sort === 'price-low-high')     filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-high-low')     filtered.sort((a, b) => b.price - a.price);
    if (sort === 'newest')             filtered.sort((a, b) => b.id - a.id);

    if (filtered.length === 0) {
        const msg = query ? `No results for "${query}"` : 'No listings yet.';
        grid.innerHTML = `<p style="color:#ffffff99;padding:20px;grid-column:1/-1;">${msg}</p>`;
        return;
    }

    // Get wishlist and basket from localStorage to determine button states for eaach item. 
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const basket = JSON.parse(localStorage.getItem('basket')) || [];

    // Render each listing as a card in the results grid. Buttons have event handlers to toggle wishlist/basket status without navigating away from the page. Clicking the card itself navigates to the item details page.
    grid.innerHTML = filtered.map(item => {
        const inWhishlist = wishlist.some(w => w.id === item.id);
        const inBasket = basket.some(b => b.id === item.id);
        return `
            <div class="result-card" id="item-${item.id}" onclick="window.location.href='/html/product.html?id=${item.id}'">
                <div class="result-card-img">
                    <img src="${item.image_url || '/images/no-image.jpg'}" alt="${item.title}">
                    <button class="heart-btn ${inWhishlist ? 'saved' : ''}"
                        onclick="event.stopPropagation(); toggleWishlist(${item.id})"
                        title="${inWhishlist ? 'Remove from wishlist' : 'Save to wishlist'}">
                        ${inWhishlist ? '&#9829;' : '&#9825;'}
                    </button>
                </div>
                <div class="result-card-info">
                    <div class="result-card-title">${item.title}</div>
                    <div class="result-card-price">£${Number(item.price).toLocaleString()}</div>
                    ${item.condition ? `<div class="result-card-condition">${item.condition}</div>` : ''}
                    <button class="basket-btn ${inBasket ? 'added' : ''}"
                        onclick="event.stopPropagation(); toggleBasket(${item.id})"
                        title="${inBasket ? 'Remove from basket' : 'Add to basket'}">
                        ${inBasket ? 'In Basket' : 'Add to Basket'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function toggleWishlist(id) {
    const item = allListings.find(l => l.id === id);
    if (!item) return;

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const idx = wishlist.findIndex(w => w.id === id);

    if (idx === -1) {
        wishlist.push(item);
    } else {
        wishlist.splice(idx, 1);
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderResults(new URLSearchParams(window.location.search).get('q') || '');
}

function toggleBasket(id) {
    const item = allListings.find(l => l.id === id);
    if (!item) return;

    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    const idx = basket.findIndex(b => b.id === id);

    if (idx === -1) {
        basket.push({
            id:        item.id,
            name:      item.title,
            price:     item.price,
            condition: item.condition,
            img:       item.image_url || '/images/no-image.jpg',
            qty:       1
        });
    } else {
        basket.splice(idx, 1);
    }

    localStorage.setItem('basket', JSON.stringify(basket));
    renderResults(new URLSearchParams(window.location.search).get('q') || '');
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRender();

    document.getElementById('sortby').addEventListener('change', () => {
        renderResults(new URLSearchParams(window.location.search).get('q') || '');
    });

    // Intercept header search form so it navigates to results page with query
    const searchForm = document.querySelector('.searchcontainer form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const q = (document.getElementById('search').value || '').trim();
            window.location.href = `/html/results.html?q=${encodeURIComponent(q)}`;
        });
    }
});