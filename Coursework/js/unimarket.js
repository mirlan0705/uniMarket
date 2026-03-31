// open/close the sidebar menu
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-280px";
    } else {
        sidebar.style.left = "0px";
    }
}
// expand/collapse a category section and change the arrow icon direction
function toggleCategory(element) {
    const category = element.parentElement;
    category.classList.toggle("active");

    const arrow = category.querySelector(".arrow-icon");

    if (category.classList.contains("active")) {
        arrow.src = "images/arrowup.png";
    } else {
        arrow.src = "images/arrowdown.png";
    }
}