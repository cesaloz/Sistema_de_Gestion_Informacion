/* ===================================================================
   ONCOPATH - registro.js
   Funciones para el Registro de Paciente
   =================================================================== */

/* ===== CERRAR SESIÓN ===== */
function cerrarSesion() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        window.location.href = "../login.html";
    }
}

/* ===== SUBMENÚ ===== */
function toggleSubmenu(e) {
    e.preventDefault();
    e.currentTarget.parentElement.classList.toggle("open");
}

/* ===== PESTAÑAS ===== */
function mostrarTab(e, id) {
    if (e) e.preventDefault();

    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

    const tab = document.getElementById(id);
    if (tab) tab.classList.add("active");

    const boton = document.querySelector(`.tab-btn[onclick*="${id}"]`);
    if (boton) boton.classList.add("active");
}

/* ===== FECHA DE HOY ===== */
document.addEventListener("DOMContentLoaded", function () {
    const hoy = new Date().toISOString().split("T")[0];
    const campoFecha = document.getElementById("fecha");
    if (campoFecha) campoFecha.value = hoy;
});

/* ===== CALCULAR EDAD ===== */
function calcularEdad() {
    const fechaNac = document.getElementById("fechaNacimiento")?.value;
    if (!fechaNac) return;

    const nacimiento = new Date(fechaNac);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

    const campoEdad = document.getElementById("edad");
    if (campoEdad) campoEdad.value = edad;
}

/* ===== GUARDAR PACIENTE ===== */
function guardarPaciente() {
    const form = document.getElementById("formPaciente");
    if (!form) return;

    const obligatorios = [
        { id: "institucion",     nombre: "Institución de Adscripción" },
        { id: "establecimiento", nombre: "Nombre del Establecimiento" },
        { id: "fechaReferencia", nombre: "Fecha de la Referencia" },
        { id: "fecha",           nombre: "Fecha del Registro" },
        { id: "numeroHistoria",  nombre: "Número de Historia" },
        { id: "nombres",         nombre: "Nombres" },
        { id: "apellidos",       nombre: "Apellidos" },
        { id: "cedula",          nombre: "Cédula" },
        { id: "fechaNacimiento", nombre: "Fecha de Nacimiento" },
        { id: "edad",            nombre: "Edad" },
        { id: "raza",            nombre: "Raza" }
    ];

    for (const campo of obligatorios) {
        const el = document.getElementById(campo.id);
        if (!el) continue;
        if (!el.value || el.value.trim() === "") {
            mostrarTab(null, "datos-personales");
            el.style.borderColor = "#dc2626";
            el.focus();
            alert(`⚠️ Falta completar: ${campo.nombre}`);
            return;
        }
    }

    const tipoDoc = form.querySelector('input[name="tipoDocumento"]:checked');
    if (!tipoDoc) {
        alert("⚠️ Debe seleccionar el Tipo de Documento (V / E / J).");
        return;
    }

    const sexo = form.querySelector('input[name="sexo"]:checked');
    if (!sexo) {
        alert("⚠️ Debe seleccionar el Sexo del paciente.");
        return;
    }

    const datos = {};
    form.querySelectorAll("input, select, textarea").forEach(campo => {
        if (!campo.name) return;
        if (campo.type === "radio") {
            if (campo.checked) datos[campo.name] = campo.value;
        } else if (campo.type === "checkbox") {
            datos[campo.name] = campo.checked;
        } else {
            datos[campo.name] = campo.value;
        }
    });

    console.log("📋 Datos del Paciente:", datos);

    /* ==========================================================
       🔌 AQUÍ ENLAZARÁS TU BD:

       fetch("http://localhost:3000/api/pacientes", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(datos)
       })
       ========================================================== */

    alert(`✅ Paciente "${datos.nombres} ${datos.apellidos}" registrado correctamente.`);
}