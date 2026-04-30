// fills the heart icon when clicked 
function toggleWishlist(element) {

    if (element.classList.contains('fa-regular')) {
        element.classList.remove('fa-regular');
        element.classList.add('fa-solid');
        
    } else {
        
        element.classList.remove('fa-solid');
        element.classList.add('fa-regular');
    }
}
