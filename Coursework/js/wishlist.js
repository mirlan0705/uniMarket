// handles wishlist display between empty wishlist and product grid based on whether any wishlist items exist added by bea
function checkWishlist() {
  const products = document.querySelectorAll(".productcard");
  const emptywishlist = document.getElementById("emptywishlist");
  const grid = document.getElementById("productgrid");
  const toolbar = document.getElementById("toolbar");

  if (products.length === 0) {
    emptywishlist.style.display = "flex";
    grid.style.display = "none";
    toolbar.style.display = "none";
  } else {
    emptywishlist.style.display = "none";
    grid.style.display = "grid";
    toolbar.style.display = "flex";
  }
}

document.addEventListener("DOMContentLoaded", checkWishlist);

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

//set the heart as filled, toggle functonality added by bea
function toggleWishlist(element) {
    element.classList.toggle('fa-solid');
    element.classList.toggle('fa-regular');
}

// add to basket change button state added by bea
function addToBasket(button) {
    button.classList.toggle("added");

    if (button.classList.contains("added")) {
        button.textContent = "Added to Basket";
    } else {
        button.textContent = "Add to Basket";
    }
}
