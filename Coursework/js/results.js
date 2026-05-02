
// added by Serine

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

