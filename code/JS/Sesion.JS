/* ============================================
   ONCOPATH - Sesión
   ============================================ */

/* ===== SUBMENÚ ===== */
function toggleSubmenu(e) {
    if (e) e.preventDefault();
    const li = e.currentTarget.parentElement;
    li.classList.toggle("open");
}

/* ===== CERRAR SESIÓN ===== */
function cerrarSesion() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {

        // Detectar si estamos en subcarpeta
        const enSubcarpeta = window.location.pathname.includes("/historias/") ||
                             window.location.pathname.includes("/modulos/");

        if (enSubcarpeta) {
            window.location.href = "../Cerrarsesion.php";
        } else {
            window.location.href = "Cerrarsesion.php";
        }
    }
}

/* ===== MOSTRAR NOMBRE DEL USUARIO (lo maneja PHP directamente) ===== */
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Sesión manejada por PHP");
});