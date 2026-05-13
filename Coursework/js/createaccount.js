// edited by mrln
window.onload = function() {

document.getElementById('createform').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirmPassword').value;

        if (password !== confirm) {
            document.getElementById('errorMsg').textContent = 'Passwords do not match';
            return;
        }

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        if (data.success) {
            window.location.href = '/html/loginregister.html';
        } else {
            document.getElementById('errorMsg').textContent = data.error;
        }
    });
};

