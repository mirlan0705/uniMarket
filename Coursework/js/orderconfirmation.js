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
function renderPurchaseConfirmation() {
    const container = document.getElementById("purchase-items-list");
    const shippingOption = localStorage.getItem("shippingOption");
    const shippingText = document.getElementById("shippinginfo");
    const totalLabel = document.getElementById("confirm-total");

    const purchasedItems =
        JSON.parse(localStorage.getItem("orderItems")) || [];

    container.innerHTML = "";

    let total = 0;

    purchasedItems.forEach(item => {
        const qty = item.qty || 1;
        total += item.price * qty;

        const template = `
            <div class="confirm-summary">
                <div class="confirm-image-wrap">
                    <img src="${item.img}" alt="${item.name}">
                </div>

                <div class="confirm-details">
                    <p class="confirm-item-title">${item.name}</p>
                    <p><span class="confirm-label">Condition:</span> ${item.condition}</p>
                    <p><span class="confirm-label">Quantity:</span> ${qty}</p>
                    <p><span class="confirm-label">Price:</span> £ ${item.price}</p>
                    <p><span class="confirm-label">Category:</span> ${item.category}</p>
                </div>
            </div>
        `;

        container.innerHTML += template;
    });

    if (shippingText) {
        if (shippingOption === "4.5") {
            shippingText.textContent = "Your order will ship in 1–2 business days.";
        } else {
            shippingText.textContent = "Your order will ship in 3–5 business days.";
        }
    }

    totalLabel.innerText = total.toFixed(2);
}

window.addEventListener("DOMContentLoaded", () => {
    renderPurchaseConfirmation();

    // header search (redirect to results page)
    const searchForm = document.querySelector(".searchcontainer form");

    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const q = (document.getElementById("search").value || "").trim();

            window.location.href = `/html/results.html?q=${encodeURIComponent(q)}`;
        });
    }
});
