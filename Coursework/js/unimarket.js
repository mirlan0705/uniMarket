function toggleMenu() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-270px";
    } else {
        sidebar.style.left = "0px";
    }
}

function toggleCategory(element){
    element.parentElement.classList.toggle("active");
}