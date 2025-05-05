document.addEventListener('DOMContentLoaded', () => {
    console.log("CHARTS.JS: DOMContentLoaded event fired.");

    // --- Datos para los gráficos (basados en Subtema 3 y Ejercicios) ---

    // Ejemplo 1: Notas del Examen (Subtema 3)
    const notasData = {
        labels: ['4', '5', '6', '7', '8', '9'], // Valores (eje X)
        datasets: [{
            label: 'Nº Alumnos', // Etiqueta para la leyenda/tooltip
            data: [2, 5, 5, 4, 2, 2], // Frecuencias absolutas (f_i) (alturas de barra)
            backgroundColor: [ // Colores para las barras
                'rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)', 'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)'
            ],
            borderColor: [ // Colores de borde
                'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)', 'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Ejemplo 2: Colores Favoritos (Subtema 3)
    const coloresData = {
        labels: ['Azul', 'Rojo', 'Verde', 'Amarillo'], // Categorías
        datasets: [{
            label: 'Nº Alumnos',
            data: [6, 3, 4, 2], // Frecuencias absolutas (f_i)
            backgroundColor: [ // Colores para los sectores
                'rgba(54, 162, 235, 0.7)', // Azul
                'rgba(255, 99, 132, 0.7)', // Rojo
                'rgba(75, 192, 192, 0.7)', // Verde
                'rgba(255, 206, 86, 0.7)' // Amarillo
            ],
            hoverOffset: 4
        }]
    };

    // **NUEVO:** Ejercicio 3: Mascotas Preferidas
    const mascotasData = {
        labels: ['Perro', 'Gato', 'Hámster', 'Pez', 'Ninguno'],
        datasets: [{
            label: 'Nº Alumnos',
            data: [12, 8, 5, 3, 2], // Frecuencias del ejercicio
            backgroundColor: [
                 'rgba(54, 162, 235, 0.6)', 'rgba(255, 159, 64, 0.6)',
                 'rgba(153, 102, 255, 0.6)', 'rgba(75, 192, 192, 0.6)',
                 'rgba(201, 203, 207, 0.6)' // Gris para 'Ninguno'
            ],
            borderColor: [
                 'rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)',
                 'rgba(153, 102, 255, 1)', 'rgba(75, 192, 192, 1)',
                 'rgba(201, 203, 207, 1)'
            ],
            borderWidth: 1
        }]
    };

    // **NUEVO:** Ejercicio 4: Género Musical Favorito
    const musicaData = {
        labels: ['Pop', 'Rock', 'Reggaetón', 'Clásica', 'Otros'],
        datasets: [{
            label: '% Preferencia',
            data: [40, 25, 20, 5, 10], // Porcentajes del ejercicio
             backgroundColor: [ // Colores diferentes
                 'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)',
                 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)',
                 'rgba(153, 102, 255, 0.7)'
            ],
            hoverOffset: 4
        }]
    };


    // --- Crear los Gráficos ---

    // Gráfico de Barras (Notas - Ejemplo 1)
    const ctxBarNotas = document.getElementById('notasBarChart');
    if (ctxBarNotas && typeof Chart !== 'undefined') {
        // console.log("CHARTS.JS: Creando gráfico de barras (Notas)...");
        try {
            new Chart(ctxBarNotas, { /* ... configuración como antes ... */
                type: 'bar', data: notasData,
                options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Distribución de Notas en el Examen', font: { size: 16 } }, legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Nº de Alumnos (f_i)'} }, x: { title: { display: true, text: 'Nota Obtenida' } } } }
            });
        } catch(e) { console.error("CHARTS.JS: Error creando gráfico de barras (Notas):", e); }
    } else if (!ctxBarNotas) { console.log("CHARTS.JS: Canvas 'notasBarChart' no encontrado."); }

    // Gráfico de Sectores (Colores - Ejemplo 2)
    const ctxPieColores = document.getElementById('coloresPieChart');
    if (ctxPieColores && typeof Chart !== 'undefined') {
        // console.log("CHARTS.JS: Creando gráfico de sectores (Colores)...");
        try {
            new Chart(ctxPieColores, { /* ... configuración como antes ... */
                type: 'pie', data: coloresData,
                options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Color Favorito de los Alumnos', font: { size: 16 } }, legend: { position: 'top' }, tooltip: { callbacks: { label: function(context) { let label = context.label || ''; if (label) { label += ': '; } if (context.parsed !== null) { const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0); const value = context.raw; const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0; label += `${value} (${percentage}%)`; } return label; } } } } }
            });
        } catch (e) { console.error("CHARTS.JS: Error creando gráfico de sectores (Colores):", e); }
    } else if (!ctxPieColores) { console.log("CHARTS.JS: Canvas 'coloresPieChart' no encontrado."); }


    // **NUEVO:** Gráfico de Barras (Mascotas - Ejercicio 3)
    const ctxBarMascotas = document.getElementById('mascotasBarChart');
    if (ctxBarMascotas && typeof Chart !== 'undefined') {
        console.log("CHARTS.JS: Creando gráfico de barras (Mascotas)...");
        try {
            new Chart(ctxBarMascotas, {
                type: 'bar',
                data: mascotasData,
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        title: { display: true, text: 'Mascotas Preferidas', font: { size: 14 } },
                        legend: { display: false }
                    },
                    scales: { y: { beginAtZero: true, title: { display: true, text: 'Nº Alumnos' } }, x: { title: { display: false } } } // No title en X, labels son claros
                }
            });
             console.log("CHARTS.JS: Gráfico de barras (Mascotas) creado.");
        } catch(e) { console.error("CHARTS.JS: Error creando gráfico de barras (Mascotas):", e); }
    } else if (!ctxBarMascotas) { console.log("CHARTS.JS: Canvas 'mascotasBarChart' no encontrado."); }

    // **NUEVO:** Gráfico de Sectores (Música - Ejercicio 4)
    const ctxPieMusica = document.getElementById('musicaPieChart');
    if (ctxPieMusica && typeof Chart !== 'undefined') {
        console.log("CHARTS.JS: Creando gráfico de sectores (Música)...");
        try {
            new Chart(ctxPieMusica, {
                type: 'pie',
                data: musicaData,
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        title: { display: true, text: 'Género Musical Favorito (%)', font: { size: 14 } },
                        legend: { position: 'top' },
                        tooltip: { // Mostrar porcentajes en tooltip
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) { label += ': '; }
                                    if (context.parsed !== null) { label += context.raw + '%'; } // Los datos ya son porcentajes
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
            console.log("CHARTS.JS: Gráfico de sectores (Música) creado.");
        } catch(e) { console.error("CHARTS.JS: Error creando gráfico de sectores (Música):", e); }
    } else if (!ctxPieMusica) { console.log("CHARTS.JS: Canvas 'musicaPieChart' no encontrado."); }


    // Común a todos: verificar carga de Chart.js si algo falla
    if (typeof Chart === 'undefined') {
        console.error("CHARTS.JS: ¡Chart.js no se ha cargado correctamente! Verifica el enlace en el HTML.");
    }

}); // Fin DOMContentLoaded