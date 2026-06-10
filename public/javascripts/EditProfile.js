const toggle = document.getElementById("themeToggle");

document.documentElement.setAttribute("data-theme", "dark");

toggle.addEventListener("change", () => {
    if (toggle.checked) {
        document.documentElement.setAttribute("data-theme", "light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
    }
});  