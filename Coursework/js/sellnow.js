// For sell now page
// Photo upload

// stores all categories and their related subcategories (Items detail section)
const subcategories = {
  "Computing & Technology": [
    "Laptops",
    "Audio",
    "Accessories",
    "Chargers"
  ],
  "Study & Course Materials": [
    "Textbooks",
    "Stationery",
    "Lab Equipment"
  ],
  "Uni Style & Clothes": [
    "Everyday Wear",
    "Outerwear & Jackets",
    "Formal & Event Wear",
    "Sports Wear",
    "Accessories"
  ],
  "Home & Halls": [
    "Kitchen",
    "Bedroom",
    "Lighting/Decor",
    "Bathroom",
    "Cleaning Supplies"
  ],
  "Entertainment & Leisure": [
    "Games",
    "Board Games & Puzzles",
    "Musical Instruments"
  ]
};

// Handles subcategory dropdown based on selected category
const categorySelect = document.getElementById("item-category");
const subcategorySelect = document.getElementById("item-sub-category");

categorySelect.addEventListener("change", function () {

 //get the selected category
  const selectedCategory = this.value;

  // reset subcategory
  subcategorySelect.innerHTML =
    '<option value="" disabled selected>Select a subcategory</option>';

  if (subcategories[selectedCategory]) {

     // enable the subcategory dropdown
    subcategorySelect.disabled = false;

    // loop through each subcategory for the selected category
    subcategories[selectedCategory].forEach(sub => {

      //create a new option 
      const option = document.createElement("option");
      option.value = sub;
      option.textContent = sub;
      subcategorySelect.appendChild(option);

    });
  } else {
    subcategorySelect.disabled = true;
  }
});

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
