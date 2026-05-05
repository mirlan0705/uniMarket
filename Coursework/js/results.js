
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

// TO DO:
// add a function to GET wishlist "function getWishlist()" and to save wishlist "function saveWishlist(list)" to localStorage. 
// add event listener to the heart icon to add/remove item from wishlist and update the localStorage accordingly.
// Toggle heat icon. 

// FETCH lisitngs from /api/lisitngs and store in a global variable "listings" to be used for sorting and filtering.

// Read search query from URL (..?q=..)/ handle search form submission (prevent reload, update URL, re-render results). 

// FILTER litings based on search query. keywords/mathch with title, description, and category. 

// sorting functionality based on dropdown selection: alphabetical (title), price , most recent (id??) => re-render based on teh results.

// each resulted card redirect to item details page with item id in URL (?id=...). 

//ERROR HANDLING: if fetch fails, show error message. if no results, show "no results found".

let allListings = [];

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

function renderResults(query) {
    const grid = document.getElementById('results-grid');
    let filtered = [...allListings];

    if (query) {
        const q=query.toLowerCase();
        filtered = filtered.filter(item =>
            (item.title || '').toLowerCase().includes(q) ||
            (item.description || '').toLowerCase().includes(q) ||
            String(item.category_id || '').toLowerCase().includes(q)
        );
    }

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

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    grid.innerHTML = filtered.map(item => {
        const saved = wishlist.some(w => w.id === item.id);
        const fallbackImg = '/images/no-image.jpg';
        return `
            <div class="result-card" onclick="window.location.href='/html/results.html?id=${item.id}'">
                <div class="result-card-img">
                    <img src="${item.image || fallbackImg}" alt="${item.title}">
                    <button class="heart-btn ${saved ? 'saved' : ''}"
                        onclick="event.stopPropagation(); toggleWishlist(${item.id})"
                        title="${saved ? 'Remove from wishlist' : 'Save to wishlist'}">
                        ${saved ? '&#9829;' : '&#9825;'}
                    </button>
                </div>
                <div class="result-card-info">
                    <div class="result-card-title">${item.title}</div>
                    <div class="result-card-price">£${Number(item.price).toLocaleString()}</div>
                    ${item.condition ? `<div class="result-card-ccategory">${item.condition}</div>` : ''}
                    ${item.category_id ? `<div class="result-card-ccategory">${item.category_id}</div>` : ''}
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



// function renderResults(listings) {
//     const container = document.getElementById('results-container');
//     if (listings.length === 0) {
//         container.innerHTML = '<p class="no-results">No results found.</p>';
//         return;
//     }

//     container.innerHTML = listings.map(listing => `
//         <div class="result-card">
//             <img src="${listing.image}" alt="${listing.title}">
//             <h3>${listing.title}</h3>
//             <p>${listing.description}</p>
//             <p>£${listing.price}</p>
//         </div>
//     `).join('');
// }

// function toggleWishlist(element, itemId) {
//     element.classList.toggle('fa-solid');
//     element.classList.toggle('fa-regular');

//     let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
//     const index = wishlist.indexOf(itemId);

//     if (index > -1) {
//         // already in wishlist — remove it
//         wishlist.splice(index, 1);
//     } else {
//         // not in wishlist — add it
//         wishlist.push(itemId);
//     }

//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
// }
