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
// List of items (Local Data for testing only)
const wishlistData = [
    {
        id: 101,
        name: "Macbook Pro 14 inch M5 pro chip, 1 TB SSD - Space Black",
        price: 2199,
        img: "/images/macbookpro.jpg",
        condition: "New"
    }
];

function renderWishlist() {
    const emptyUI = document.getElementById('emptywishlist');
    const gridUI = document.getElementById('productgrid');
    const toolbar = document.getElementById('toolbar');

    // check if the wishlist empty
    if (wishlistData.length === 0) {
        emptyUI.style.display = "flex";
        gridUI.style.display = "none";
        toolbar.style.display = "none";
        return;
    }

    // if not empty show UI
    emptyUI.style.display = "none";
    gridUI.style.display = "grid";
    toolbar.style.display = "flex";

    // clear current cards
    gridUI.innerHTML = ''; 

    // html template card for every item in the wishlist
    wishlistData.forEach(item => {
        const itemHTML = `
            <div class="productcard" id="item-${item.id}">
                <div class="imagecard">
                    <img src="${item.img}" alt="${item.name}">
                    <i class="fa-solid fa-heart favoriteicon" onclick="event.stopPropagation(); removeFromWishlist(${item.id})"></i>
                </div>
                <div class="productinfo">
                    <h5>${item.name}</h5>
                    <p class="price">Price: £ ${item.price.toLocaleString()}</p>
                    <p class="condition">Condition: ${item.condition}</p>
                     <!-- Add to Basket Button -->
                     <button class="addtobasketbtn" onclick="addToBasket(this)">Add to Basket</button>
                </div>
            </div>
        `;
        gridUI.innerHTML += itemHTML;
    });
}
    // Added by Bea
    // Function to remove item when heart is toggled off 
    function removeFromWishlist(id) {
    //find the item in database (the array)
    const index = wishlistData.findIndex(item => item.id === id);
    
    if (index !== -1) {
        // find card in the browser to animate it
        const cardElement = document.getElementById(`item-${id}`);
        
        if (cardElement) {
            cardElement.style.opacity = '0';
            cardElement.style.transform = 'scale(0.9)';
            cardElement.style.transition = 'all 0.3s ease';
        }

        setTimeout(() => {
            // remove item from array
            wishlistData.splice(index, 1);
            
            // refresh everything (this automatically handles the empty UI check)
            renderWishlist();
        }, 300);
    }
}

// Added by Bea
// add to basket change button state with undo functionality 
function addToBasket(button) {
    const isAdded = button.classList.toggle("added");

    if (isAdded) {
        button.textContent = "Added to Basket";
        showToast("Item added to your basket.", "success");
    } else {
        button.textContent = "Add to Basket";
        showToast("Item removed from your basket.", "info");
    }
}

// Added by Bea
// toast message function
function showToast(message, type = 'success') {

    document.querySelectorAll('.addbasket-toast').forEach(t => t.remove());
 
    const toast = document.createElement('div');
    toast.className = `addbasket-toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
 

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });
 
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

document.addEventListener("DOMContentLoaded", renderWishlist);
