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
// load data items from basket page 
const basketData = JSON.parse(localStorage.getItem("basket")) || [];

document.addEventListener("DOMContentLoaded", () => {
    loadSavedAddress();
    loadSavedCard();
    renderReviewItems();
    setupShippingListeners();
    setupPaymentListener();
    setupAddressListeners();
    updateSummary();
    updateAddressButtons();
    updateClearButtons();
});

// render basket items
function renderReviewItems() {
    const container = document.getElementById("reviewitems");

    if (!container) return;

    container.innerHTML = "";

   if (basketData.length === 0) {
    setTimeout(() => {
        window.location.href = "/html/basket.html";
    }, 300);
    return;
}

    basketData.forEach(item => {
        const qty = item.qty || 1;

        const html = `
            <div class="itemcard">
                <div class="itemimgbox">
                    <img src="${item.img}" alt="${item.name}" />
                </div>

                <div class="itemdetails">
                    <p><strong>${item.name}</strong></p>
                    <p>Condition: ${item.condition}</p>
                    <p>Quantity: ${qty}</p>
                    <p>Price: £${item.price}</p>
                </div>

                <button class="deletebtn" onclick="removeItem(${item.id})">
                <img src="/images/bin.png" alt="delete">
                </button>
            </div>
        `;

        container.innerHTML += html;
    });

    updateSummary();
}

// shipping
function setupShippingListeners() {
    document.querySelectorAll('input[name="ship"]').forEach(radio => {
        radio.addEventListener("change", updateSummary);
    });
}

// payment
function setupPaymentListener() {
    const paymentOptions = document.querySelectorAll('input[name="pay"]');
    const saveCardBtn = document.querySelector(".savecardbtn");

    if (!saveCardBtn) return;

    paymentOptions.forEach(option => {
        option.addEventListener("change", () => {
            saveCardBtn.classList.remove("disabled");
            saveCardBtn.classList.add("enabled");
        });
    });
}


// update order summary
function updateSummary() {
    let subtotal = 0;
    let totalQty = 0;

    basketData.forEach(item => {
        const qty = item.qty || 1;
        subtotal += item.price * qty;
        totalQty += qty;
    });

    
    const selectedShipping = document.querySelector('input[name="ship"]:checked');
    const shippingCost = selectedShipping ? parseFloat(selectedShipping.value) : 0;

    const total = subtotal + shippingCost;

    document.getElementById("summaryitems").innerText = totalQty;
    document.getElementById("summaryshipping").innerText = shippingCost.toFixed(2);
    document.getElementById("summarytotal").innerText = total.toFixed(2);
}

function updateCheckoutSync() {
    updateSummary(); 
}

// remove items from basket
function removeItem(id) {
    const index = basketData.findIndex(item => item.id === id);

    if (index !== -1) {
        basketData.splice(index, 1);
        localStorage.setItem("basket", JSON.stringify(basketData));

        // if empty after removal → redirect
        if (basketData.length === 0) {
            window.location.href = "/html/basket.html";
            return;
        }

        renderReviewItems();
    }
}
// normalize phone
function normalizePhone(phone) {
    return phone.replace(/\s|-/g, ""); // removes spaces and dashes
}

// validation input fields
function validateAddressFields() {
    const inputs = document.querySelectorAll(".inputgrid input");

    const firstName = inputs[0].value.trim();
    const surname = inputs[1].value.trim();
    const address = inputs[2].value.trim();
    const rawPhone = inputs[3].value.trim();
    const phone = normalizePhone(rawPhone);
    const postcode = inputs[4].value.trim();
    const country = inputs[5].value.trim();
    const city = inputs[6].value.trim();

    let isValid = true;

    if (!/^[a-zA-Z]{2,}$/.test(firstName)) isValid = false;
    if (!/^[a-zA-Z]{2,}$/.test(surname)) isValid = false;
    if (address.length < 5) isValid = false;
    if (!/^(\+44|0)\d{10}$/.test(phone)) {isValid = false;}
    if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(postcode)) isValid = false;
    if (country.length < 2) isValid = false;
    if (!/^[a-zA-Z\s]{2,}$/.test(city)) isValid = false;

    return isValid;
}

// enable toggle buttons when valid address input
function updateAddressButtons() {
    const isValid = validateAddressFields();

    const addBtn = document.querySelector(".btnprimary");
    const saveBtn = document.querySelector(".btnsecondary");
    const editBtn = document.querySelector(".btntertiary");

    const buttons = [addBtn, saveBtn, editBtn];

    buttons.forEach(btn => {
        if (!btn) return;

        if (isValid) {
             btn.classList.remove("disabled");
             btn.classList.add("enabled");
        } else {
             btn.classList.add("disabled");
             btn.classList.remove("enabled");
        }
    });
}

// address listener
function setupAddressListeners() {
    document.querySelectorAll(".inputgrid input").forEach(input => {
        input.addEventListener("input", updateAddressButtons);
    });
}

// validation checkout
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".confirmbtn");
    if (btn) {
        btn.addEventListener("click", validateCheckout);
    }
});

function validateCheckout(e) {
    if (e) e.preventDefault();

    let message = "";

    if (basketData.length === 0) {
        window.location.href = "/html/basket.html";
        return;
    }

    if (!validateAddressFields()) {
        message += "Please enter valid delivery details.\n";
    }

    const shipping = document.querySelector('input[name="ship"]:checked');
    if (!shipping) {
        message += "Please select a delivery option.\n";
    }

    const payment = document.querySelector('input[name="pay"]:checked');
    if (!payment) {
        message += "Please select a payment method.\n";
    }

    if (message !== "") {
        showToast(message);
        return;
    }
    
    localStorage.setItem("shippingOption", shipping.value);
    // save order 
    localStorage.setItem("orderItems", JSON.stringify(basketData));

    showToast("Order confirmed.");
}

// save address input data
function saveAddress() {
    if (!validateAddressFields()) {
        showToast("Please enter valid address before saving.");
        return;
    }

    const inputs = document.querySelectorAll(".inputgrid input");

    const addressData = {
        firstName: inputs[0].value.trim(),
        surname: inputs[1].value.trim(),
        address: inputs[2].value.trim(),
        phone: normalizePhone(inputs[3].value.trim()),
        postcode: inputs[4].value.trim(),
        country: inputs[5].value.trim(),
        city: inputs[6].value.trim()
    };

    localStorage.setItem("savedAddress", JSON.stringify(addressData));

    updateClearButtons(); 
    showToast("Address saved.");
}

// load address data
function loadSavedAddress() {
    const saved = JSON.parse(localStorage.getItem("savedAddress"));

    if (!saved) return;

    const inputs = document.querySelectorAll(".inputgrid input");

    inputs[0].value = saved.firstName || "";
    inputs[1].value = saved.surname || "";
    inputs[2].value = saved.address || "";
    inputs[3].value = saved.phone || "";
    inputs[4].value = saved.postcode || "";
    inputs[5].value = saved.country || "";
    inputs[6].value = saved.city || "";
}

// clear saved address data
function clearSavedAddress() {
    localStorage.removeItem("savedAddress");

    const inputs = document.querySelectorAll(".inputgrid input");

    inputs.forEach(input => {
        input.value = "";
    });

    updateAddressButtons();
    updateClearButtons();
    showToast("Saved address removed");
}

// save selected payment method
function saveCard() {
    const selectedCard = document.querySelector('input[name="pay"]:checked');

    if (!selectedCard) {
        showToast("Please select a payment method.");
        return;
    }

    localStorage.setItem("savedPayment", selectedCard.value);

    updateClearButtons(); 
    showToast("Card saved.");
}

// load saved payment method
function loadSavedCard() {
    const savedPayment = localStorage.getItem("savedPayment");

    if (!savedPayment) return;

    const paymentOptions = document.querySelectorAll('input[name="pay"]');

    paymentOptions.forEach(option => {
        if (option.value === savedPayment) {
            option.checked = true;
        }
    });

    const saveCardBtn = document.querySelector(".savecardbtn");

    if (saveCardBtn) {
        saveCardBtn.classList.remove("disabled");
        saveCardBtn.classList.add("enabled");
    }
}

// clear saved payment method
function clearSavedCard() {
    localStorage.removeItem("savedPayment");

    const paymentOptions = document.querySelectorAll('input[name="pay"]');

    paymentOptions.forEach(option => {
        option.checked = false;
    });

    const saveCardBtn = document.querySelector(".savecardbtn");

    if (saveCardBtn) {
        saveCardBtn.classList.add("disabled");
        saveCardBtn.classList.remove("enabled");
    }

    updateClearButtons(); 
    showToast("Saved card removed.");
}

// update clear buttons
function updateClearButtons() {
    const savedAddress = localStorage.getItem("savedAddress");
    const savedPayment = localStorage.getItem("savedPayment");

    const clearAddressBtn = document.querySelector(".clearaddressbtn");
    const clearCardBtn = document.querySelector(".clearcardbtn");

    if (clearAddressBtn) {
        if (savedAddress) {
            clearAddressBtn.classList.remove("disabled");
            clearAddressBtn.classList.add("enabled");
        } else {
            clearAddressBtn.classList.add("disabled");
            clearAddressBtn.classList.remove("enabled");
        }
    }

    if (clearCardBtn) {
        if (savedPayment) {
            clearCardBtn.classList.remove("disabled");
            clearCardBtn.classList.add("enabled");
        } else {
            clearCardBtn.classList.add("disabled");
            clearCardBtn.classList.remove("enabled");
        }
    }
}

//toast function
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.innerText = message;
    toast.classList.add("show");

    // reset state first
    toast.classList.remove("success");

    if (
    message === "Order confirmed." ||
    message === "Address saved." ||
    message === "Card saved."
    ) {
    toast.classList.add("success");
    }

    setTimeout(() => {
        toast.classList.remove("show");
        if (message === "Order confirmed.") {
            localStorage.removeItem("basket"); 
            window.location.href = "/html/orderconfirmation.html"; 
        }
    }, 2500);
}
