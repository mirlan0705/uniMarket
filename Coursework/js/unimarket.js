// edited by mrln
window.onload = function() {

    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.onresize = function() {
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

    fetch('/api/listings')
        .then(res => res.json())
        .then(listings => {
            const grid = document.getElementById('listings');

            if (listings.length === 0) {
                grid.innerHTML = '<p style="color:rgba(255,255,255,0.4); padding:10px;">Nothing listed yet.</p>';
                return;
            }

            listings.forEach(item => {
                grid.innerHTML += `
                    <div class="card">
                        <img src="${item.image || '/images/asuslaptop.jpg'}" alt="${item.title}">
                        <div class="card-info">
                            <div class="card-title">${item.title}</div>
                            <div class="card-price">£${item.price}</div>
                            <div class="card-category">${item.category || 'General'}</div>
                        </div>
                    </div>
                `;
            });
        });
};

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

// nabar is loaded dynamically to allow for easier reuse across pages
fetch('navbar.html')
  .then(res => res.text())
  .then(html => document.getElementById('navbar').innerHTML = html);
  