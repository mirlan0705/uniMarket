// added by bea
// expand/collapse a category section and change the arrow icon direction (auto closes category)
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

// added by Bea
// List of items purchased
const purchasedItems = [
    {
        id: 1,
        name: "Macbook Pro 14 inch M5",
        price: 2199,
        img: "/images/macbookpro.jpg",
        condition: "Brand New",
        category: "Computing & Technology"
    },
    {
        id: 2,
        name: "Wireless Headphones",
        price: 420,
        img: "/images/airpodsmax.jpg",
        condition: "Used - Good",
        category: "Computing & Technology"
    }
];

function renderPurchaseConfirmation() {
    const container = document.getElementById("purchase-items-list");
    const totalLabel = document.getElementById("confirm-total");

    container.innerHTML = ""; 

    let total = 0;

    purchasedItems.forEach(item => {
        total += item.price;

        const template = `
            <div class="confirm-summary">
                <div class="confirm-image-wrap">
                   <img src="${item.img}" alt="${item.name}">
                </div>

                <div class="confirm-details">
                    <p class="confirm-item-title">${item.name}</p>
                    <p><span class="confirm-label">Condition:</span> ${item.condition}</p>
                    <p><span class="confirm-label">Price:</span> £ ${item.price}</p>
                    <p><span class="confirm-label">Category:</span> ${item.category}</p>
                </div>
            </div>
        `;

        container.innerHTML += template;
    });

    totalLabel.innerText = total.toLocaleString();
}

window.onload = renderPurchaseConfirmation;
