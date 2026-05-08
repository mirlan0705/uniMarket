let allListings = [];

// edited by mrln
window.onload = function () {

    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    function starColor(mass) {
        const t = Math.min(mass / 4, 1);
        return [
            Math.round(255 * (1 - t * 0.5)),
            Math.round(150 * t),
            255
        ];
    }

    let particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * 1.5,
            dy: (Math.random() - 0.5) * 1.5,
            mass: Math.random() * 3 + 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const star of particles) {
            for (const other of particles) {
                if (star === other) continue;

                const dx = other.x - star.x;
                const dy = other.y - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const force = 0.5 * other.mass / (distance * distance + 50);
                const ax = force * dx / distance;
                const ay = force * dy / distance;

                star.dx += ax;
                star.dy += ay;
            }

            star.x += star.dx;
            star.y += star.dy;

            if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
            if (star.y < 0 || star.y > canvas.height) star.dy *= -1;

            const [r, g, b] = starColor(star.mass);

            ctx.beginPath();
            ctx.arc(star.x, star.y, Math.max(2, star.mass), 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();

    // block protected pages if not logged in
    document.querySelectorAll('.protected-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!localStorage.getItem('user')) {
                e.preventDefault();
                window.location.href = '/html/loginregister.html';
            }
        });
    });

    // search bar
    const searchForm = document.querySelector('.searchcontainer form');

    if (searchForm) {

        searchForm.addEventListener('submit', (e) => {

            e.preventDefault();

            const q = (document.getElementById('search').value || '').trim();

            window.location.href = `/html/results.html?q=${encodeURIComponent(q)}`;
        });
    }

    // render listings
    function renderListings() {

        const grid = document.getElementById('listings');

        if (!grid) return;

        if (allListings.length === 0) {

            grid.innerHTML = `
                <p style="color:rgba(255,255,255,0.4); padding:10px;">
                    Nothing listed yet.
                </p>
            `;

            return;
        }

        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const basket = JSON.parse(localStorage.getItem('basket')) || [];

        grid.innerHTML = allListings.map(item => {

            const inWishlist = wishlist.includes(item.id);

            const inBasket = basket.some(b => b.id === item.id);

            return `
                <div class="card">

                    <div class="card-image">
                        <img src="${item.image || '/images/no-image.jpg'}" alt="${item.title}">
                        <button 
                            class="heart-btn ${inWishlist ? 'saved' : ''}"
                            onclick="event.stopPropagation(); toggleWishlist(${item.id})">
                            ${inWishlist ? '&#9829;' : '&#9825;'}
                        </button>
                    </div>

                    <div class="card-info">
                        <div class="card-title">${item.title}</div>
                        <div class="card-price">£${item.price}</div>
                        <div class="card-category">
                            ${item.category || 'General'}
                        </div>
                        <button 
                            class="add-basket-btn ${inBasket ? 'added' : ''}"
                            onclick="event.stopPropagation(); toggleBasket(${item.id})"
                        >
                            ${inBasket ? 'Added to Basket' : 'Add to Basket'}
                        </button>
                    </div>

                </div>
            `;
        }).join('');
    }

    // fetch listings
    function fetchAndRender() {

        fetch('/api/listings')
            .then(res => res.json())
            .then(listings => {

                allListings = listings;

                renderListings();
            })
            .catch(err => {
                console.error('Error loading listings:', err);
            });
    }

    // make render function global
    window.renderListings = renderListings;

    fetchAndRender();
};

// toggle wishlist
function toggleWishlist(id) {

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const index = wishlist.indexOf(id);

    if (index === -1) {
        wishlist.push(id);
    } else {
        wishlist.splice(index, 1);
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    renderListings();
}

// toggle basket
function toggleBasket(id) {

    const item = allListings.find(item => item.id === id);

    if (!item) return;

    let basket = JSON.parse(localStorage.getItem('basket')) || [];

    const index = basket.findIndex(b => b.id === id);

    if (index === -1) {
        basket.push({
            id: item.id,
            name: item.title,
            price: item.price,
            condition: item.condition,
            img: item.image || '/images/no-image.jpg',
            qty: 1
        });
    } else {
        basket.splice(index, 1);
    }
    localStorage.setItem('basket', JSON.stringify(basket));

    renderListings();
}

// open/close the sidebar menu
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-322px";
        overlay.classList.remove('active');
    } else {
        sidebar.style.left = "0px";
        overlay.classList.add('active');
    }
}

// expand/collapse a category section and change the arrow icon direction
function toggleCategory(element) {
    const category = element.parentElement;
    category.classList.toggle("active");

    const arrow = category.querySelector(".arrow-icon");

    if (category.classList.contains("active")) {
        arrow.src = "/images/arrowup.png";
    } else {
        arrow.src = "/images/arrowdown.png";
    }
}

// navbar
fetch('navbar.html')
    .then(res => res.text())
    .then(html => {document.getElementById('navbar').innerHTML = html;});