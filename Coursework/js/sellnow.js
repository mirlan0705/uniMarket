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

// added by serine 
// Upload Photo
const uploadInput  = document.getElementById('upload-photo');
const photoPreview = document.getElementById('photo-preview');
let uploadedFiles  = [];

uploadInput.addEventListener('change', (e) => {
    Array.from(e.target.files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        uploadedFiles.push(file);
 
        const reader = new FileReader();
        reader.onload = (event) => {
            
            const placeholder = photoPreview.querySelector('.photo-placeholder-text');
            if (placeholder) placeholder.remove();
            photoPreview.classList.add('has-photos');
 
            
            const thumbnail = document.createElement('div');
            thumbnail.className = 'photo-thumbnail';
 
            const img = document.createElement('img');
            img.src = event.target.result;
            img.alt = file.name;
 
            const removeBtn = document.createElement('button');
            removeBtn.className   = 'photo-thumbnail-remove';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => {
                uploadedFiles.splice(uploadedFiles.indexOf(file), 1);
                thumbnail.remove();
 
                if (photoPreview.querySelectorAll('.photo-thumbnail').length === 0) {
                    photoPreview.classList.remove('has-photos');
                    const p = document.createElement('p');
                    p.className   = 'photo-placeholder-text';
                    p.textContent = 'No photos yet';
                    photoPreview.appendChild(p);
                }
            });
 
            thumbnail.appendChild(img);
            thumbnail.appendChild(removeBtn);
            photoPreview.appendChild(thumbnail);
        };
        reader.readAsDataURL(file);
    });
 
    uploadInput.value = ''; 
});

// Toast message
function showToast(message, type = 'error') {
    document.querySelectorAll('.sellnow-toast').forEach(t => t.remove());
 
    const toast = document.createElement('div');
    toast.className   = `sellnow-toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
 
    requestAnimationFrame(() => toast.style.opacity = '1');
 
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Uplaod 
document.getElementById('upload-btn').addEventListener('click', async() => {
    const title       = document.getElementById('item-name').value.trim();
    const description = document.getElementById('item-description').value.trim();
    const category    = document.getElementById('item-category').value;
    const price       = document.getElementById('item-price').value;

    if (!title)                           return showToast('Please enter a name for your item.');
    if (!description)                     return showToast('Please add a description.');
    if (!category)                        return showToast('Please select a category.');
    if (!price || parseFloat(price) <= 0) return showToast('Please enter a valid price.');

    //sending only the first picture for now 
    const imageData = uploadedFiles.length > 0 ? await toBase64(uploadedFiles[0]) : '';

    try {
        const res = await fetch('/listings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, price: parseFloat(price), description, category, image: imageData })
        });
 
        if (!res.ok) throw new Error('Server error');
 
        localStorage.removeItem('sellnow_draft');
        showToast('Item listed successfully!', 'success');
        setTimeout(() => { window.location.href = 'unimarket.html'; }, 2000);
 
    } catch (err) {
        console.error(err);
        showToast('Could not connect to server. Please try again.');
    }

});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Save draft
document.getElementById('draft-btn').addEventListener('click', () => {
    const draft = {
        title:       document.getElementById('item-name').value,
        description: document.getElementById('item-description').value,
        category:    document.getElementById('item-category').value,
        price:       document.getElementById('item-price').value
    };
    localStorage.setItem('sellnow_draft', JSON.stringify(draft));
    showToast('Draft saved.', 'success');
});
// Resotors draft 
function restoreDraft() {
    const saved = localStorage.getItem('sellnow_draft');
    if (!saved) return;
    try {
        const draft = JSON.parse(saved);
        if (draft.title)       document.getElementById('item-name').value        = draft.title;
        if (draft.description) document.getElementById('item-description').value = draft.description;
        if (draft.category)    document.getElementById('item-category').value    = draft.category;
        if (draft.price)       document.getElementById('item-price').value       = draft.price;
        showToast('Draft restored.', 'success');
    } catch (e) {
        console.warn('Could not restore draft:', e);
    }
}
 
document.addEventListener('DOMContentLoaded', restoreDraft);
