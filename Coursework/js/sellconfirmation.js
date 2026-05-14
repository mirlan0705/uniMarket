// expand/collapse a category section and change the arrow icon direction (auto closes category) added by bea
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

// added by Serine

document.addEventListener('DOMContentLoaded', async() => {
    const id = new URLSearchParams(window.location.search).get('id');

    const res      = await fetch('/api/listings');
    const listings = await res.json();
    const listing  = listings.find(item => item.id === parseInt(id));
   
    if (!listing) return;

    const images = listing.image_url ? JSON.parse(listing.image_url) : [];
    
    document.getElementById('confirm-title').textContent     = listing.title;
    document.getElementById('confirm-condition').textContent = listing.condition || '—';
    document.getElementById('confirm-price').textContent     = listing.price || '—';
    document.getElementById('confirm-category').textContent  = listing.category_name || '—';
    document.getElementById('confirm-image').src = images[0] || '/images/placeholder.png';

    // header search (redirect to results page)
    const searchForm = document.querySelector(".searchcontainer form");
    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const searchInput = document.getElementById("search");
            const q = (searchInput.value || "").trim();
            if (q) {
                window.location.href = `/html/results.html?q=${encodeURIComponent(q)}`;
            }
        });
    }
});
