
// added by bea
// Handles subcategory dropdown based on selected category
const categorySelect = document.getElementById("item-category");
const subcategorySelect = document.getElementById("item-sub-category");

async function loadCategories() {
    const res = await fetch('/api/listings/categories');
    const categories = await res.json();

    const categorySelect = document.getElementById('item-category');

    categories.forEach(category => {
        const option = document.createElement('option');

        option.value = category.id;
        option.textContent = category.name;

        categorySelect.appendChild(option);
    });
}

document.getElementById('item-category').addEventListener('change', async function () {

    const subcategorySelect = document.getElementById('item-sub-category');

    subcategorySelect.innerHTML =
        '<option value="" disabled selected>Select a subcategory</option>';

    const res = await fetch(
        `/api/listings/subcategories?category_id=${this.value}`
    );

    const subcategories = await res.json();

    subcategories.forEach(sub => {
        const option = document.createElement('option');

        option.value = sub.id;
        option.textContent = sub.name;

        subcategorySelect.appendChild(option);
    });

    subcategorySelect.disabled = false;
});

loadCategories();

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
        currentArrow.src = "/images/arrowup.png";
    } else {
        currentArrow.src = "/images/arrowdown.png";
    }
}

// added by Serine 
// Upload Photo
const uploadInput  = document.getElementById('upload-photo');
const photoPreview = document.getElementById('photo-preview');
let uploadedFiles  = [];

uploadInput.addEventListener('change', (e) => {
    Array.from(e.target.files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        if (uploadedFiles.length >= 8) {
            showToast('You can only upload up to 8 photos.');
            return;
        }

        uploadedFiles.push(file);
 
        const reader = new FileReader();
        reader.onload = (event) => {
            
            // Remove placeholder text and add photo thumbnail
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
 
    // Reset file input to allow re-uploading the same file
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
    const title          = document.getElementById('item-name').value.trim();
    const description    = document.getElementById('item-description').value.trim();
    const category_id    = document.getElementById('item-category').value;
    const subcategory_id = document.getElementById('item-sub-category').value;
    const image_url      = uploadedFiles.length > 0 ? URL.createObjectURL(uploadedFiles[0]) : null; 
    const condition      = document.getElementById('item-condition').value;
    const price          = document.getElementById('item-price').value;

    if (!title)                           return showToast('Please enter a name for your item.');
    if (!description)                     return showToast('Please add a description.');
    if (!category_id)                     return showToast('Please select a category.');
    if (!subcategory_id)                  return showToast('Please select a subcategory.');
    if (!condition)                       return showToast('Please select a condition.');
    if (!price || parseFloat(price) <= 0) return showToast('Please enter a valid price.');


    try {
        const res = await fetch('/api/listings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, price: parseFloat(price), description, condition, category_id, subcategory_id, image_url })
        });
 
        if (!res.ok) throw new Error('Server error');

        const data = await res.json();

        window.location.href = `/html/sellconfirmation.html?id=${data.id}`;
 
    } catch (err) {
        console.error(err);
        showToast('Could not connect to server. Please try again.');
    }

});


// Cancel button goes back to the previous page
document.getElementById('cancel-btn').addEventListener('click', () => {
    history.back();
});