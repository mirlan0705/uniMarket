// added by Bea
// expand/collapse a category section and change the arrow icon direction (auto closes category) 
function toggleCategory(element) {
    const currentCategory = element.parentElement;
    const allCategories = document.querySelectorAll(".category");

    allCategories.forEach(category => {
        const arrow = category.querySelector(".arrowicon");

        // Close everything except the clicked one
        if (category !== currentCategory) {
            category.classList.remove("active");
            if (arrow) arrow.src = "/images/arrowdown.png";
        }
    });

    // Toggle current category
    currentCategory.classList.toggle("active");

    const currentArrow = currentCategory.querySelector(".arrowicon");

    if (currentCategory.classList.contains("active")) {
        currentArrow.src = "/images/arrowup.png";
    } else {
        currentArrow.src = "/images/arrowdown.png";
    }
}

// added by Bea
let wishlistData = JSON.parse(localStorage.getItem("wishlist")) || [];

let currentSearch = "";
let currentSort = "Recently Added";

function renderWishlist(data) {

    const emptyUI = document.getElementById('emptywishlist');
    const noResultsUI = document.getElementById('noresults');
    const gridUI = document.getElementById('productgrid');
    const toolbar = document.getElementById('toolbar');


    // empty wishlist
    if (wishlistData.length === 0) {
        emptyUI.style.display = "flex";
        noResultsUI.style.display = "none";
        gridUI.style.display = "none";
        toolbar.style.display = "none";
        return;
    }

    // no search result
    if (data.length === 0) {
        emptyUI.style.display = "none";
        noResultsUI.style.display = "flex";
        gridUI.style.display = "none";
        toolbar.style.display = "flex";
        return;
    }

    // normal
    emptyUI.style.display = "none";
    noResultsUI.style.display = "none";
    gridUI.style.display = "grid";
    toolbar.style.display = "flex";

    gridUI.innerHTML = '';

    data.forEach(item => {
        gridUI.innerHTML += `
            <div class="productcard" id="item-${item.id}">
                <div class="imagecard">
                    <img src="${item.image_url}" alt="${item.title}">
                    <i class="fa-solid fa-heart favoriteicon"
                       onclick="event.stopPropagation(); removeFromWishlist(${item.id})">
                    </i>
                </div>

                <div class="productinfo">
                    <h5>${item.title}</h5>
                    <p class="price">Price: £ ${Number(item.price).toLocaleString()}</p>
                    <p class="condition">Condition: ${item.condition}</p>

                    <button class="addtobasketbtn" onclick="addToBasket(this)">
                        Add to Basket
                    </button>
                </div>
            </div>
        `;
    });
  syncBasketButtons();
}

function syncBasketButtons() {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];

    document.querySelectorAll(".productcard").forEach(card => {

        const id = Number(card.id.replace("item-", ""));
        const button = card.querySelector(".addtobasketbtn");

        if (!button) return;

        const inBasket = basket.some(b => b.id === id);

        if (inBasket) {
            button.classList.add("added");
            button.textContent = "Added to Basket";
        } else {
            button.classList.remove("added");
            button.textContent = "Add to Basket";
        }
    });
}

// tool filter bar function
function applyFilters() {
    let filtered = [...wishlistData];

    if (currentSearch) {
    filtered = filtered.filter(item =>
        (item.title || item.name || "")
            .toLowerCase()
            .includes(currentSearch)
    );
}

    if (currentSort === "Recently Added") {
        filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    if (currentSort === "Price (Low to High)") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (currentSort === "Price (High to Low)") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (currentSort === "Alphabetical Order") {
    filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    renderWishlist(filtered);
}

// added by Bea
// search wishlist handler
document.getElementById("wishlistsearch")?.addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    applyFilters();
});

// added by Bea
// sort handler
document.addEventListener("change", (e) => {
    if (e.target.closest(".sortselector select")) {
        currentSort = e.target.value;
        applyFilters();
    }
});

// added by Bea
// function to remove item when heart is toggled off 
function removeFromWishlist(id) {

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlist = wishlist.filter(item => item.id !== id);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    wishlistData = wishlist; // update memory state too

    const card = document.getElementById(`item-${id}`);

    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = '0.3s ease';
    }

    setTimeout(() => {
        applyFilters();
    }, 300);
}

// added by Bea
// add to basket change button state with undo functionality 
function addToBasket(button) {

    const card = button.closest(".productcard");
    const id = Number(card?.id?.replace("item-", ""));

    const item = wishlistData.find(i => i.id === id);
    if (!item) return;

    let basket = JSON.parse(localStorage.getItem("basket")) || [];

    const exists = basket.some(b => b.id === id);

    if (!exists) {
        basket.push(item);
        showToast("Added to Basket", "success");
    } else {
        basket = basket.filter(b => b.id !== id);
        showToast("Removed from Basket", "success");
    }

    localStorage.setItem("basket", JSON.stringify(basket));

    syncBasketButtons();
}

// added by Bea
// toast message function
function showToast(message, type = "success") {

    document.querySelectorAll(".addbasket-toast").forEach(t => t.remove());

    const toast = document.createElement("div");
    toast.className = `addbasket-toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// header search (redirect to results page)
document.addEventListener("DOMContentLoaded", () => {
    applyFilters();

    const searchForm = document.querySelector(".searchcontainer form");

    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const q = (document.getElementById("search").value || "").trim();

            window.location.href = `/html/results.html?q=${encodeURIComponent(q)}`;
        });
    }
});
