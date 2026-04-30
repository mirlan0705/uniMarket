window.onload = function() {

    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.onresize = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    let particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * 1.5,
            dy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 2 + 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;

            // bounce off edges 
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(100, 150, 255, 0.8)';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // -- grab listings and show them as cards --
    fetch('/listings')
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
                        <img src="${item.image || '../images/asuslaptop.jpg'}" alt="${item.title}">
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
        sidebar.style.left = "-280px";
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
        arrow.src = "../images/arrowup.png";
    } else {
        arrow.src = "../images/arrowdown.png";
    }
}

// nabar is loaded dynamically to allow for easier reuse across pages
fetch('navbar.html')
  .then(res => res.text())
  .then(html => document.getElementById('navbar').innerHTML = html);
