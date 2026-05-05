// Added by Bea
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
// Added by Bea
// List of items (Local Data for testing only)
const basketData = [
    {
        id: 1,
        name: "Macbook Pro 14 inch M5",
        price: 2199,
        img: "/images/macbookpro.jpg",
        condition: "Brand New",
        qty: 1
    }
]; 

function renderBasket() {
    const emptyUI = document.getElementById('emptybasket');
    const itemsUI = document.getElementById('basketcontent');
    const listContainer = document.getElementById('basketitems');
    const totalQtyLabel = document.getElementById('totalqty');
    const subtotalLabel = document.getElementById('subtotalprice');

    // check if the basket empty
    if (basketData.length === 0) {
        emptyUI.style.display = 'grid';  //show empty message
        itemsUI.style.display = 'none';  //hide the basket list
        return; 
    }

    // if is not empty
    emptyUI.style.display = 'none';
    itemsUI.style.display = 'flex';

    // clear the list
    listContainer.innerHTML = '<h3 class="sectionlabel">Your items</h3>';
    let subtotal = 0;
    let totalPhysicalItems = 0;

    // calculate price for specific item
    basketData.forEach((item) => {
        const currentQty = item.qty || 1;
        totalPhysicalItems += currentQty;
        subtotal += (item.price * currentQty);
        
        // html template for every item in the list
        const template = `
            <div class="itemcard">
                <div class="itemimage"><img src="${item.img}"></div>
                <div class="itemdetails">
                    <h4>${item.name}</h4>
                    <p class="condition">Condition: ${item.condition}</p>
                    <div class="itemactions">
                        <button class="actionbtn" onclick="removeItem(${item.id})">Remove Item</button>
                         <div class="qtydisplay">
                           <label>Quantity:</label>
                              <input type="number" class="qtyinput" value="${currentQty}" min="1" 
                               oninput="updateQty(${item.id}, this.value)"
                               onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                         </div>
                        <span class="price">Price: £ ${item.price}</span>
                    </div>
                </div>
            </div>
        `;
        listContainer.innerHTML += template;
    });

    // updates the numbers on the right summary section
    totalQtyLabel.innerText = totalPhysicalItems;
    subtotalLabel.innerText = "£ " + subtotal.toLocaleString();
}

// update quantity when user types in the input box & automatically recalculates subtotal and item count
function updateQty(id, newQty) {
    const item = basketData.find(i => i.id === id);
   if (item) {
        let val = parseInt(newQty);
        item.qty = (isNaN(val) || val <= 0) ? 1 : val; 
        // update summary labels only
        updateSummary();
    }
}

function updateSummary() {
    let runningSubtotal = 0;
    let totalPhysicalCount = 0;

    basketData.forEach((item) => {
        const currentQty = item.qty || 0;
        totalPhysicalCount += currentQty;
        runningSubtotal += (item.price * currentQty);
    });

    // update the labels on the right
    const totalQtyLabel = document.getElementById('totalqty');
    const subtotalLabel = document.getElementById('subtotalprice');
    
    if (totalQtyLabel) totalQtyLabel.innerText = totalPhysicalCount;
    if (subtotalLabel) subtotalLabel.innerText = "£ " + runningSubtotal.toLocaleString();
}

// remove an item (switch to empty basket if last item is removed)
function removeItem(id) {
    const index = basketData.findIndex(item => item.id === id);
    // remove from array
    if (index !== -1) {
        basketData.splice(index, 1);
        // refresh the UI so the item disappears and shows empty basket
        renderBasket();
    }
}

window.onload = renderBasket;
