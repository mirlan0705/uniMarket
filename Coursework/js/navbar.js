
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
                <span style="color:white; margin: 0 10px;">Hi, ${user.name}</span>
                <a href="/html/sellnow.html" class="protected-link">Sell Now</a>
                <a href="#" id="logout-btn">Log Out</a>
            `;
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
