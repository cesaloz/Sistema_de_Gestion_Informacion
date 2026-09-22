/* ===== PESTAÑAS ===== */
function mostrarTab(e, id) {
    if (e) e.preventDefault();

    // Bloqueo de pestañas
    if (id === "tab-consulta" && document.getElementById("btnTabConsulta")?.disabled) {
        alert("⚠️ Primero debe seleccionar un paciente de la tabla.");
        return;
    }
    if (id === "tab-tratamiento" && document.getElementById("btnTabTratamiento")?.disabled) {
        alert("⚠️ Primero complete la Consulta y Diagnóstico.");
        return;
    }

    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

    const tab = document.getElementById(id);
    if (tab) tab.classList.add("active");

    const boton = document.querySelector(`.tab-btn[onclick*="${id}"]`);
    if (boton) boton.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ===== INTENTAR IR A TAB BLOQUEADA ===== */
function intentarIrATab(id) {
    const boton = document.querySelector(`.tab-btn[onclick*="${id}"]`);
    if (boton && boton.disabled) {
        alert("🔒 Esta sección está bloqueada. Complete los pasos anteriores.");
        return;
    }
    mostrarTab(null, id);
}

/* ===== DESBLOQUEAR TAB ===== */
function desbloquearTab(idBoton) {
    const boton = document.getElementById(idBoton);
    if (!boton) return;

    boton.disabled = false;
    boton.classList.remove("locked");

    const candado = boton.querySelector(".fa-lock");
    if (candado) candado.remove();
}

/* ===== BLOQUEAR TAB ===== */
function bloquearTab(idBoton) {
    const boton = document.getElementById(idBoton);
    if (!boton) return;

    boton.disabled = true;
    boton.classList.add("locked");

    if (!boton.querySelector(".fa-lock")) {
        const candado = document.createElement("i");
        candado.className = "fas fa-lock";
        candado.style.fontSize = "0.7rem";
        candado.style.marginLeft = "0.3rem";
        boton.appendChild(candado);
    }
}

/* ===== CONTINUAR ENTRE PASOS ===== */
function continuarPaso(idSiguiente) {
    // Paso 1 → Paso 2
    if (idSiguiente === 'tab-consulta') {
        const seleccionado = document.getElementById("pacienteSeleccionado").style.display;
        if (seleccionado === "none") {
            alert("⚠️ Primero debe seleccionar un paciente de la tabla.");
            return;
        }
    }

    // Paso 2 → Paso 3
    if (idSiguiente === 'tab-tratamiento') {
        const diagnostico = document.getElementById("diagnosticoInicio").value.trim();
        if (!diagnostico) {
            alert("⚠️ Debe completar al menos el 'Diagnóstico de Inicio' antes de continuar.");
            document.getElementById("diagnosticoInicio").focus();
            return;
        }
        desbloquearTab("btnTabTratamiento");
    }

    mostrarTab(null, idSiguiente);
}

/* ===== SELECCIONAR PACIENTE ===== */
function seleccionarPaciente(boton) {
    const fila = boton.closest("tr");
    const celdas = fila.cells;

    const id = celdas[0].textContent;
    const cedula = celdas[1].textContent;
    const nombre = celdas[2].textContent;

    // Marcar fila
    document.querySelectorAll("#tablaPacientes tbody tr").forEach(tr => tr.classList.remove("selected"));
    fila.classList.add("selected");

    // Mostrar info del seleccionado
    const info = document.getElementById("pacienteSeleccionado");
    document.getElementById("nombreSeleccionado").textContent = `${nombre} (Céd. ${cedula}) - ${id}`;
    info.style.display = "flex";

    // Guardar en input oculto
    let hidden = document.getElementById("pacienteIdSeleccionado");
    if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.id = "pacienteIdSeleccionado";
        hidden.name = "pacienteIdSeleccionado";
        document.getElementById("formPaciente").appendChild(hidden);
    }
    hidden.value = id.replace("#", "");

    // Desbloquear pestaña 2
    desbloquearTab("btnTabConsulta");
}

/* ===== FILTRAR PACIENTES ===== */
function filtrarPacientes() {
    const texto = document.getElementById("buscarPaciente").value.toLowerCase();
    const filas = document.querySelectorAll("#tablaPacientes tbody tr");

    filas.forEach(fila => {
        const celdas = fila.cells;
        const cedula = celdas[1].textContent.toLowerCase();
        const nombre = celdas[2].textContent.toLowerCase();
        const id = celdas[0].textContent.toLowerCase();

        const coincide = cedula.includes(texto) || nombre.includes(texto) || id.includes(texto);
        fila.style.display = coincide ? "" : "none";
    });
}

/* ===== GUARDAR HISTORIA ===== */
function guardarPaciente() {
    const form = document.getElementById("formPaciente");
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

    if (!datos.pacienteIdSeleccionado) {
        alert("⚠️ Debe seleccionar un paciente antes de guardar.");
        mostrarTab(null, "tab-buscar");
        return;
    }

    console.log("📋 Datos de Historia Clínica Hemato:", datos);

    /* ==========================================================
       🔌 AQUÍ ENLAZARÁS TU BD:

       fetch("http://localhost:3000/api/historias/hemato", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(datos)
       })
       ========================================================== */

    alert(`✅ Historia Clínica guardada correctamente para el paciente ${datos.pacienteIdSeleccionado}.`);
}


