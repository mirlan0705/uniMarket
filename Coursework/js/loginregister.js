
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

