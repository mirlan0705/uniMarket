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
});
