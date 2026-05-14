// added by Bea
document.addEventListener('DOMContentLoaded', () => {


    const form = document.getElementById('forgotForm');

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        const email = document.getElementById('email').value.trim();

        if (!email) {
            showToast('Please enter your email', 'error');
            return;
        }

        try {

            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (data.success) {

                showToast('Reset link sent', 'success');

        
                if (data.debugLink) {
                    console.log("ETHEREAL LINK:", data.debugLink);

                    const linkWrapper = document.createElement("div"); 
                    
                    linkWrapper.style.position = "fixed";
                    linkWrapper.style.top = "50%";
                    linkWrapper.style.left = "50%";
                    linkWrapper.style.transform = "translate(-50%, -50%)";
                    linkWrapper.style.background = "#fff";
                    linkWrapper.style.padding = "10px";
                    linkWrapper.style.borderRadius = "12px";
                    linkWrapper.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
                    linkWrapper.style.zIndex = "9999";
                    linkWrapper.style.textAlign = "center";

                    const link = document.createElement("a");
                    link.href = data.debugLink;
                    link.target = "_blank";
                    link.textContent = "🔗 View Email";
                    link.style.fontFamily = "'Futura', sans-serif";
                    link.style.fontSize = "18px";
                    link.style.fontWeight = "normal";
                    link.style.color = "#000";
                    link.style.textDecoration = "none";
                    link.style.display = "block";
                    link.style.marginTop = "5px";

                    linkWrapper.appendChild(link);
                    document.body.appendChild(linkWrapper);

                                   
                }

            } else {
                showToast(data.error || 'Something went wrong', 'error');
            }

        } catch (err) {
            showToast('Could not connect to server', 'error');
        }

    });

    function showToast(message, type = 'error') {

        const container = document.getElementById('toastcontainer');

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
            setTimeout(() => toast.remove(), 300);
        }, 3500);

    }

});