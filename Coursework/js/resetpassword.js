document.addEventListener('DOMContentLoaded', () => {

    const token = new URLSearchParams(window.location.search).get("token");

    const form = document.getElementById("resetForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById("newPassword").value;

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,
                newPassword
            })
        });

        const data = await res.json();

        if (data.success) {
            alert("Password updated!");
            window.location.href = "/html/loginregister.html";
        } else {
            alert(data.error || "Something went wrong");
        }
    });

});