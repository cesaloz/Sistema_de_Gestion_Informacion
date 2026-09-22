/* ===== VER PACIENTE ===== */
function verPaciente(nombre) {
    alert(`👁️ Viendo ficha de: ${nombre}`);
    // window.location.href = `ver-paciente.html?nombre=${nombre}`;
}

/* ===== EDITAR PACIENTE ===== */
function editarPaciente(nombre) {
    alert(`✏️ Editando a: ${nombre}`);
    // window.location.href = `editar-paciente.html?nombre=${nombre}`;
}

/* ===== ELIMINAR PACIENTE ===== */
function eliminarPaciente(boton) {
    const fila = boton.closest("tr");
    const nombre = fila.cells[1].textContent;

    if (confirm(`¿Estás seguro de eliminar a "${nombre}"?`)) {
        fila.remove();
        actualizarContador();
    }
}

/* ===== FILTRAR TABLA ===== */
function filtrarTabla() {
    const texto = document.getElementById("buscador").value.toLowerCase();
    const estadoFiltro = document.getElementById("filtroEstado").value;
    const fechaFiltro = document.getElementById("filtroFecha").value;

    const filas = document.querySelectorAll("#tablaPacientes tbody tr");
    let visibles = 0;

    filas.forEach(fila => {
        const celdas = fila.cells;
        const nombre = celdas[1].textContent.toLowerCase();
        const cedula = celdas[0].textContent.toLowerCase();
        const diagnostico = celdas[3].textContent.toLowerCase();
        const estado = celdas[5].textContent.trim();
        const fecha = celdas[4].textContent;

        const coincideTexto = nombre.includes(texto) || cedula.includes(texto) || diagnostico.includes(texto);
        const coincideEstado = !estadoFiltro || estado === estadoFiltro;
        const coincideFecha = !fechaFiltro || fecha === fechaFiltro;

        if (coincideTexto && coincideEstado && coincideFecha) {
            fila.style.display = "";
            visibles++;
        } else {
            fila.style.display = "none";
        }
    });

    document.getElementById("resultados").textContent = `Mostrando ${visibles} paciente(s)`;
    document.getElementById("emptyState").style.display = visibles === 0 ? "block" : "none";
}

/* ===== LIMPIAR FILTROS ===== */
function limpiarFiltros() {
    document.getElementById("buscador").value = "";
    document.getElementById("filtroEstado").value = "";
    document.getElementById("filtroFecha").value = "";
    filtrarTabla();
}

/* ===== ACTUALIZAR CONTADOR ===== */
function actualizarContador() {
    const total = document.querySelectorAll("#tablaPacientes tbody tr").length;
    document.getElementById("contador").textContent = total;
}