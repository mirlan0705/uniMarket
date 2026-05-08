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
};

    document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.loginform').addEventListener('submit', async (e) => {
        e.preventDefault();
       
        const email = document.querySelector('input[type="email"]').value;
        const password = document.querySelector('input[type="password"]').value;

        // added by Bea
        // validation
        if (!email || !password) {
         showToast("Please fill in all fields", "error"); 
        return;
        }
    
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
            throw new Error("Server error");
             }

            const data = await res.json();
            
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data));

                showToast("Login successful", "success"); // added by Bea

                window.location.href = '/html/unimarket.html';

            } else {
            showToast(data.error || "Invalid login details", "error"); // added by Bea 
            }

         } catch (err) {
        showToast("Could not connect to server", "error"); // added by Bea 
       }
    });

// added by Bea  
// password eye toggle
    const toggle = document.getElementById('togglePassword');
    const passwordInput = document.querySelector('input[type="password"]');

    if (toggle && passwordInput) {
        toggle.addEventListener('click', () => {
            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            toggle.classList.toggle('fa-eye-slash');
        });
    }

// toast message
function showToast(message, type = 'error') {
    const container = document.getElementById('toastcontainer')

    if (!container) return;

    const toast = document.createElement('div');
    toast.classList.add('toast', `toast-${type}`);
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.opacity = '0';

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3500);
}

});

