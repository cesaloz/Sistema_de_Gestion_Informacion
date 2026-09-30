/* ===================================================================
   ONCOPATH - ubicacion.js
   Selects dependientes: Estado → Municipio → Parroquia
   =================================================================== */

/* ===== RUTA BASE DE LA API ===== */
const API_BASE = "/code/venezuela/";

/* ===== CARGAR ESTADOS AL INICIO ===== */
document.addEventListener("DOMContentLoaded", function () {
    cargarEstados("nac");
    cargarEstados("pro");
});

/* ===== CARGAR ESTADOS ===== */
async function cargarEstados(prefijo) {
    const select = document.getElementById(prefijo + "Estado");
    if (!select) return;

    try {
        const res = await fetch(API_BASE + "estados.php");
        const estados = await res.json();

        select.innerHTML = '<option value="">Seleccionar...</option>';
        estados.forEach(e => {
            select.innerHTML += `<option value="${e.id_estado}">${e.estado}</option>`;
        });
    } catch (err) {
        console.error("Error al cargar estados:", err);
    }
}

/* ===== CARGAR MUNICIPIOS ===== */
async function cargarMunicipios(prefijo) {
    const idEstado = document.getElementById(prefijo + "Estado").value;
    const selectMunicipio = document.getElementById(prefijo + "Municipio");
    const selectParroquia = document.getElementById(prefijo + "Parroquia");

    // Limpiar los selects siguientes
    selectMunicipio.innerHTML = '<option value="">Seleccionar...</option>';
    selectParroquia.innerHTML = '<option value="">Seleccionar municipio primero</option>';

    if (!idEstado) {
        selectMunicipio.innerHTML = '<option value="">Seleccionar estado primero</option>';
        return;
    }

    try {
        const res = await fetch(API_BASE + "municipios.php?id_estado=" + idEstado);
        const municipios = await res.json();

        if (municipios.length === 0) {
            selectMunicipio.innerHTML = '<option value="">Sin municipios</option>';
            return;
        }

        municipios.forEach(m => {
            selectMunicipio.innerHTML += `<option value="${m.id_municipio}">${m.municipio}</option>`;
        });
    } catch (err) {
        console.error("Error al cargar municipios:", err);
    }
}

/* ===== CARGAR PARROQUIAS ===== */
async function cargarParroquias(prefijo) {
    const idMunicipio = document.getElementById(prefijo + "Municipio").value;
    const selectParroquia = document.getElementById(prefijo + "Parroquia");

    selectParroquia.innerHTML = '<option value="">Seleccionar...</option>';

    if (!idMunicipio) {
        selectParroquia.innerHTML = '<option value="">Seleccionar municipio primero</option>';
        return;
    }

    try {
        const res = await fetch(API_BASE + "parroquias.php?id_municipio=" + idMunicipio);
        const parroquias = await res.json();

        if (parroquias.length === 0) {
            selectParroquia.innerHTML = '<option value="">Sin parroquias</option>';
            return;
        }

        parroquias.forEach(p => {
            selectParroquia.innerHTML += `<option value="${p.id_parroquia}">${p.parroquia}</option>`;
        });
    } catch (err) {
        console.error("Error al cargar parroquias:", err);
    }
}