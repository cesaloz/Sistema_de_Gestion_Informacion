
function toggleSubmenu(e) {
    e.preventDefault();
    const li = e.currentTarget.parentElement;
    li.classList.toggle("open");
}


function cerrarSesion() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        sessionStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("usuarioLogueado");
        window.location.href = "../Login.php";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const sesion = sessionStorage.getItem("usuarioLogueado");
    if (sesion) {
        const data = JSON.parse(sesion);
        const nombreEl = document.querySelector(".user-name");
        if (nombreEl) nombreEl.textContent = data.nombre;
    }
});