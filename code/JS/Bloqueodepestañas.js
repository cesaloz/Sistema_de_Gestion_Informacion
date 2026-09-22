/* ===== PESTAÑAS CON BLOQUEO ===== */
function mostrarTab(e, id) {
    if (e) e.preventDefault();

    // Si intenta ir a una pestaña bloqueada, avisar
    if (id === "tab-consulta" && document.getElementById("btnTabConsulta").disabled) {
        alert("⚠️ Primero debe seleccionar un paciente de la tabla.");
        return;
    }
    if (id === "tab-tratamiento" && document.getElementById("btnTabTratamiento").disabled) {
        alert("⚠️ Primero complete la Consulta y Diagnóstico.");
        return;
    }

    // Cambiar pestaña
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

    const tab = document.getElementById(id);
    if (tab) tab.classList.add("active");

    const boton = document.querySelector(`.tab-btn[onclick*="${id}"]`);
    if (boton) boton.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ===== INTENTAR IR A UNA PESTAÑA BLOQUEADA ===== */
function intentarIrATab(id) {
    const boton = document.querySelector(`.tab-btn[onclick*="${id}"]`);
    if (boton && boton.disabled) {
        alert("🔒 Esta sección está bloqueada. Complete los pasos anteriores.");
        return;
    }
    mostrarTab(null, id);
}





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

    // 👇 DESBLOQUEAR LA PESTAÑA 2
    desbloquearTab("btnTabConsulta");
}

/* ===== DESBLOQUEAR UNA PESTAÑA ===== */
function desbloquearTab(idBoton) {
    const boton = document.getElementById(idBoton);
    if (!boton) return;

    boton.disabled = false;
    boton.classList.remove("locked");

    // Quitar el ícono de candado
    const candado = boton.querySelector(".fa-lock");
    if (candado) candado.remove();
}

/* ===== BLOQUEAR UNA PESTAÑA ===== */
function bloquearTab(idBoton) {
    const boton = document.getElementById(idBoton);
    if (!boton) return;

    boton.disabled = true;
    boton.classList.add("locked");

    // Agregar ícono de candado si no lo tiene
    if (!boton.querySelector(".fa-lock")) {
        const candado = document.createElement("i");
        candado.className = "fas fa-lock";
        candado.style.fontSize = "0.7rem";
        candado.style.marginLeft = "0.3rem";
        boton.appendChild(candado);
    }
}




function continuarPaso(idSiguiente) {
    // Si va de Paso 1 → Paso 2
    if (idSiguiente === 'tab-consulta') {
        const seleccionado = document.getElementById("pacienteSeleccionado").style.display;
        if (seleccionado === "none") {
            alert("⚠️ Primero debe seleccionar un paciente de la tabla.");
            return;
        }
    }

    // Si va de Paso 2 → Paso 3
    if (idSiguiente === 'tab-tratamiento') {
        // Validar que al menos el diagnóstico de inicio esté lleno
        const diagnostico = document.getElementById("diagnosticoInicio").value.trim();
        if (!diagnostico) {
            alert("⚠️ Debe completar al menos el 'Diagnóstico de Inicio' antes de continuar.");
            document.getElementById("diagnosticoInicio").focus();
            return;
        }

        // Desbloquear la pestaña 3
        desbloquearTab("btnTabTratamiento");
    }

    mostrarTab(null, idSiguiente);
}