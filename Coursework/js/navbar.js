
function getBasketKey() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user ? `basket_${user.email}` : 'basket';
}
function getWishlistKey() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user ? `wishlist_${user.email}` : 'wishlist';
}

window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const rightButtons = document.getElementById('right-buttons');
    if (rightButtons) {
        if (user) {
            rightButtons.innerHTML = `
                <div class="profile-dropdown">
                     <button class="profile-btn" id="profile-btn">Hi, ${user.name} ▾</button>
                 <div class="dropdown-menu" id="dropdown-menu">
                     <a href="/html/profile.html">Profile</a>
                     <a href="/html/settings.html">Settings</a>
                     <a href="#" id="logout-btn">Log Out</a>
                 </div>
                 <a href="/html/sellnow.html" class="protected-link sell-btn"> Sell Now</a>
                 </div>
               `;

     const profileBtn = document.getElementById('profile-btn');
     const dropdownMenu = document.getElementById('dropdown-menu');

profileBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
});

// close dropdown when clicking elsewhere
document.addEventListener('click', (e) => {

    if (
        !profileBtn.contains(e.target) &&
        !dropdownMenu.contains(e.target)
    ) {
        dropdownMenu.classList.remove('show');
    }
     });
            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                window.location.reload();
            });
        }
    }

    document.querySelectorAll('.protected-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!localStorage.getItem('user')) {
                e.preventDefault();
                window.location.href = '/html/loginregister.html';
            }
        });
    });

});
