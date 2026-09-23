/* ===================================================================
   ONCOPATH - estadisticas.js
   Gráficos de Estadísticas Regionales
   =================================================================== */

/* ===== DATOS DE EJEMPLO =====
   ⚠️ TEMPORAL: cuando conectes la BD, reemplaza este objeto por un fetch() */

const datosPacientes = {
    estados: {
        "Lara":       45,
        "Portuguesa": 28,
        "Zulia":      22,
        "Miranda":    18,
        "Carabobo":   8,
        "Distrito Capital": 12,
        "Táchira":    2,
        "Yaracuy":    6,
        "Falcón":     4,
        "Otros":      2
    },
    municipiosPorEstado: {
        "Lara": {
            "Iribarren":    20,
            "Palavecino":   10,
            "Torres":       7,
            "Jiménez":      5,
            "Morán":        3
        },
        "Portuguesa": {
            "Guanare":      12,
            "Acarigua":     10,
            "Turén":        4,
            "Páez":         2
        },
        "Zulia": {
            "Maracaibo":    15,
            "Cabimas":      4,
            "San Francisco": 3
        }
    }
};

/* ===== COLORES ===== */
const coloresEstados = [
    "#098cd7", "#633ab6", "#10b981", "#f59e0b", "#ef4444",
    "#14b8a6", "#8b5cf6", "#f97316", "#06b6d4", "#84cc16"
];

const coloresMunicipios = [
    "#098cd7", "#633ab6", "#10b981", "#f59e0b", "#ef4444",
    "#14b8a6", "#8b5cf6", "#f97316"
];

/* ===== GRÁFICO DE ESTADOS (Barras) ===== */
let graficoEstados;
let graficoMunicipios;

function crearGraficoEstados() {
    const ctx = document.getElementById("graficoEstados");
    if (!ctx) return;

    const estados = Object.keys(datosPacientes.estados);
    const cantidades = Object.values(datosPacientes.estados);

    graficoEstados = new Chart(ctx, {
        type: "bar",
        data: {
            labels: estados,
            datasets: [{
                label: "Pacientes",
                data: cantidades,
                backgroundColor: coloresEstados,
                borderColor: "#ffffff",
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 28
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: function (event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const estado = estados[index];
                    actualizarGraficoMunicipios(estado);
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#1e293b",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            const total = cantidades.reduce((a, b) => a + b, 0);
                            const porcentaje = ((context.parsed.y / total) * 100).toFixed(1);
                            return `${context.parsed.y} pacientes (${porcentaje}%)`;
                        },
                        afterLabel: function () {
                            return "💡 Clic para ver municipios";
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: "#f1f5f9" },
                    ticks: { color: "#64748b", font: { size: 12 } }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: "#1e293b",
                        font: { size: 11, weight: "500" },
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            }
        }
    });
}

/* ===== GRÁFICO DE MUNICIPIOS (Dona) ===== */
function crearGraficoMunicipios(estado = "Lara") {
    const ctx = document.getElementById("graficoMunicipios");
    if (!ctx) return;

    const municipios = datosPacientes.municipiosPorEstado[estado] || {};
    const labels = Object.keys(municipios);
    const data = Object.values(municipios);
    const total = data.reduce((a, b) => a + b, 0);

    // Actualizar subtítulo del card
    const subtitulo = ctx.closest(".chart-card").querySelector(".chart-header p");
    if (subtitulo) subtitulo.textContent = `Estado: ${estado} (${total} pacientes)`;

    graficoMunicipios = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: coloresMunicipios,
                borderColor: "#ffffff",
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "62%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 14,
                        font: { size: 12 },
                        color: "#1e293b",
                        usePointStyle: true,
                        pointStyle: "circle"
                    }
                },
                tooltip: {
                    backgroundColor: "#1e293b",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            const porcentaje = ((context.parsed / total) * 100).toFixed(1);
                            return ` ${context.label}: ${context.parsed} (${porcentaje}%)`;
                        }
                    }
                }
            }
        }
    });
}

/* ===== ACTUALIZAR GRÁFICO DE MUNICIPIOS AL HACER CLIC ===== */
function actualizarGraficoMunicipios(estado) {
    if (graficoMunicipios) {
        graficoMunicipios.destroy();
    }
    crearGraficoMunicipios(estado);
}

/* ===== INICIALIZAR ===== */
document.addEventListener("DOMContentLoaded", function () {
    crearGraficoEstados();
    crearGraficoMunicipios("Lara");

    // Mensaje en consola
    console.log("📊 Estadísticas regionales cargadas");
});

/* ===================================================================
   🔌 CUANDO CONECTES TU BD, REEMPLAZA LOS DATOS POR ESTO:

   async function cargarEstadisticas() {
       try {
           const res = await fetch("http://localhost:3000/api/estadisticas/regionales");
           const data = await res.json();

           // data.estados = { "Lara": 45, "Zulia": 22, ... }
           // data.municipiosPorEstado = { "Lara": { "Iribarren": 20, ... }, ... }

           datosPacientes.estados = data.estados;
           datosPacientes.municipiosPorEstado = data.municipiosPorEstado;

           crearGraficoEstados();
           crearGraficoMunicipios(Object.keys(data.estados)[0]);
       } catch (err) {
           console.error("Error al cargar estadísticas:", err);
       }
   }

   document.addEventListener("DOMContentLoaded", cargarEstadisticas);
   =================================================================== */