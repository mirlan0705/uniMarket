let allListings = [];

function getFirstImage(image_url) {
    if (!image_url) return '/images/no-image.png';
    try {
        const parsed = JSON.parse(image_url);
        return Array.isArray(parsed) ? parsed[0] : image_url;
    } catch { return image_url; }
}

// edited by mrln
window.onload = function () {

    const canvas = document.getElementById('bg');
    if (!canvas) return;
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

    let gradientAngle = 0;

    let particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * 1.5,
            dy: (Math.random() - 0.5) * 1.5,
            mass: Math.random() * 3 + 1,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.02 + Math.random() * 0.03
        });
    }

    function animate() {
        gradientAngle += 0.003;
        const cx = canvas.width / 2 + Math.cos(gradientAngle) * canvas.width * 0.3;
        const cy = canvas.height / 2 + Math.sin(gradientAngle) * canvas.height * 0.3;
        const grad = ctx.createRadialGradient(cx, cy, 0, canvas.width / 2, canvas.height / 2, canvas.width * 0.9);
        grad.addColorStop(0, '#0d0630');
        grad.addColorStop(0.5, '#0a0a2e');
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // connection lines with pulse flash
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const proximity = 1 - dist / 120;
                    const flash = proximity > 0.85 ? 1 : proximity;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.lineWidth = proximity > 0.85 ? 2 : 1;
                    ctx.strokeStyle = `rgba(180, 160, 255, ${flash})`;
                    ctx.stroke();
                    ctx.lineWidth = 1;
                }
            }
        }

        // particles with twinkle
        for (const star of particles) {
            star.x += star.dx;
            star.y += star.dy;
            star.twinkle += star.twinkleSpeed;

            if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
            if (star.y < 0 || star.y > canvas.height) star.dy *= -1;

            const opacity = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(star.twinkle));
            const radius = Math.max(2, star.mass) * (0.85 + 0.15 * Math.sin(star.twinkle));
            const [r, g, b] = starColor(star.mass);

            ctx.beginPath();
            ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();

    // fade in listings section when scrolled into view
    const listingsSection = document.querySelector('.listings-section');
    if (listingsSection) {
        new IntersectionObserver((entries, obs) => {
            if (entries[0].isIntersecting) {
                listingsSection.classList.add('visible');
                obs.disconnect();
            }
        }, { threshold: 0.1 }).observe(listingsSection);
    }

    // update navbar based on login state
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

            const inWishlist = wishlist.some(w => w.id === item.id);

            const inBasket = basket.some(b => b.id === item.id);

            return `
                <div class="card" id="item-${item.id}" onclick="window.location.href='/html/product.html?id=${item.id}'">

                    <div class="card-image">
                        <img src="${getFirstImage(item.image_url)}" alt="${item.title}">
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
                            ${item.category_name || 'General'}
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

    const item = allListings.find(item => item.id === id);
    if (!item) return;

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const index = wishlist.findIndex(w => w.id === id);

    if (index === -1) {
        wishlist.push({
            id: item.id,
            title: item.title,
            price: item.price,
            condition: item.condition,
            image_url: getFirstImage(item.image_url)
        });
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
            id:         item.id,
            title:      item.title,
            price:      item.price,
            condition:  item.condition,
            image_url:  getFirstImage(item.image_url),
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
