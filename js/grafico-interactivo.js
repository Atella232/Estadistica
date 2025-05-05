document.addEventListener('DOMContentLoaded', () => {
    // Comprobar si estamos en la página correcta
    const toolContainer = document.getElementById('grafico-interactivo-tool');
    if (!toolContainer) return;

    console.log("Inicializando herramienta gráfico interactivo...");

    // --- Selectores de Elementos del DOM ---
    const tablaDatosManualBody = document.querySelector('#tabla-datos-manual tbody');
    const btnAddRow = document.getElementById('btn-add-row');
    const btnProcessData = document.getElementById('btn-process-data');
    const manualDataErrorDiv = document.getElementById('manual-data-error');
    const resultadosGraficoDiv = document.getElementById('resultados-grafico');
    const tablaFrecuenciasCalculadaBody = document.querySelector('#tabla-frecuencias-calculada tbody');
    const tablaFrecuenciasCalculadaFoot = document.querySelector('#tabla-frecuencias-calculada tfoot');
    const chartTypeRadios = document.querySelectorAll('input[name="chart-type"]');
    // const checkShowLabels = document.getElementById('check-show-labels'); // Omitido por simplicidad inicial
    const chartCanvas = document.getElementById('grafico-generado');
    const panelInterpretacionP = document.querySelector('#panel-interpretacion p');

    // Comprobar si language.js está cargado y obtener utils
    let langUtils = null;
    if (typeof initLanguage === 'function' && window.langUtils) {
         langUtils = window.langUtils; // Asumiendo que main.js lo adjunta a window
    } else {
        console.warn("langUtils no encontrado. Las traducciones pueden fallar.");
        // Crear un objeto dummy para evitar errores
        langUtils = { getCurrentLang: () => 'es', applyLanguage: () => {} };
    }

    // --- Estado de la Herramienta ---
    let manualData = [{ xi: '', fi: '' }]; // Iniciar con una fila
    let calculatedTable = {}; // { xi: { fi, hi, Fi, Hi, pct }, ... }
    let uniqueXiValues = [];
    let N = 0;
    let chartInstance = null;
    let currentChartType = 'bar';
    let currentChartOptions = { showLabels: false }; // Opciones iniciales

    // --- Funciones ---

    // Renderizar la tabla de entrada manual
    function renderManualTable() {
        tablaDatosManualBody.innerHTML = ''; // Limpiar tabla
        manualData.forEach((rowData, index) => {
            const row = tablaDatosManualBody.insertRow();

            // Celda Valor/Categoría (xi)
            const cellXi = row.insertCell();
            const inputXi = document.createElement('input');
            inputXi.type = 'text'; // Permitir texto para cualitativas
            inputXi.value = rowData.xi;
            inputXi.placeholder = langUtils.getCurrentLang() === 'es' ? 'Valor o Categoría' : 'Balioa edo Kategoria';
            inputXi.dataset.index = index;
            inputXi.dataset.col = 'xi';
            inputXi.addEventListener('change', handleManualInputChange); // Guardar al cambiar
            cellXi.appendChild(inputXi);

            // Celda Frecuencia (fi)
            const cellFi = row.insertCell();
            const inputFi = document.createElement('input');
            inputFi.type = 'number';
            inputFi.min = '0';
            inputFi.step = '1'; // Frecuencias absolutas son enteras
            inputFi.value = rowData.fi;
            inputFi.placeholder = 'fᵢ';
            inputFi.dataset.index = index;
            inputFi.dataset.col = 'fi';
            inputFi.addEventListener('change', handleManualInputChange); // Guardar al cambiar
            cellFi.appendChild(inputFi);

            // Celda Botón Eliminar
            const cellRemove = row.insertCell();
            cellRemove.classList.add('remove-row-cell');
            if (manualData.length > 1) { // No permitir eliminar la última fila
                const btnRemove = document.createElement('button');
                btnRemove.innerHTML = '<i class="fas fa-times"></i>';
                btnRemove.classList.add('remove-row-button');
                btnRemove.title = langUtils.getCurrentLang() === 'es' ? 'Eliminar fila' : 'Lerroa ezabatu';
                btnRemove.dataset.index = index;
                btnRemove.addEventListener('click', removeRow);
                cellRemove.appendChild(btnRemove);
            }
        });
        // Aplicar idioma a placeholders si es necesario
        langUtils.applyLanguage(langUtils.getCurrentLang());
    }

    // Guardar cambios en la tabla manual al estado
    function handleManualInputChange(event) {
        const index = parseInt(event.target.dataset.index);
        const col = event.target.dataset.col;
        if (index >= 0 && index < manualData.length) {
            manualData[index][col] = event.target.value;
        }
        // console.log("Manual data updated:", manualData);
    }

    // Añadir una fila a la tabla manual
    function addRow() {
        manualData.push({ xi: '', fi: '' });
        renderManualTable();
        // Enfocar el nuevo input xi
        const lastXiInput = tablaDatosManualBody.querySelector(`tr:last-child input[data-col='xi']`);
        if(lastXiInput) lastXiInput.focus();
    }

    // Eliminar una fila de la tabla manual
    function removeRow(event) {
        const indexToRemove = parseInt(event.currentTarget.dataset.index);
        if (indexToRemove >= 0 && indexToRemove < manualData.length && manualData.length > 1) {
            manualData.splice(indexToRemove, 1);
            renderManualTable();
        }
    }

    // Validar y procesar datos manuales
    function processData() {
        manualDataErrorDiv.style.display = 'none'; // Ocultar error previo
        manualDataErrorDiv.textContent = '';
        let isValid = true;
        let processedFi = new Map(); // Usar Map para manejar claves numéricas y de texto
        N = 0;

        // 1. Recoger y validar datos del DOM y calcular N
        manualData.forEach((row, index) => {
            const xiInput = tablaDatosManualBody.querySelector(`input[data-index="${index}"][data-col="xi"]`);
            const fiInput = tablaDatosManualBody.querySelector(`input[data-index="${index}"][data-col="fi"]`);
            const xi = xiInput ? xiInput.value.trim() : '';
            const fiStr = fiInput ? fiInput.value.trim() : '';

            if (!xi || !fiStr) {
                 // Permitir filas vacías si no son la única fila, pero ignorarlas
                if(manualData.length > 1) return;
                else {
                    isValid = false;
                    manualDataErrorDiv.textContent = langUtils.getCurrentLang() === 'es' ? 'Completa al menos una fila con valor y frecuencia.' : 'Bete gutxienez lerro bat balio eta maiztasunarekin.';
                    return; // Salir del forEach si hay error grave
                }
            }

            const fi = parseInt(fiStr);

            if (isNaN(fi) || fi < 0) {
                isValid = false;
                if(fiInput) fiInput.style.borderColor = '#a94442'; // Marcar input inválido
                manualDataErrorDiv.textContent = langUtils.getCurrentLang() === 'es' ? `Error en Fila ${index + 1}: La frecuencia debe ser un número entero no negativo.` : `Errorea ${index + 1}. Lerroan: Maiztasunak zenbaki oso ez-negatiboa izan behar du.`;
                return; // Salir del forEach
            } else {
                 if(fiInput) fiInput.style.borderColor = ''; // Limpiar borde si era inválido
            }

             // Agrupar frecuencias por xi
            processedFi.set(xi, (processedFi.get(xi) || 0) + fi);
            N += fi; // Sumar al total N
        });

        if (!isValid || N === 0) {
            if (isValid && N===0 && processedFi.size > 0) { // Si hay valores pero todos con fi=0
                 manualDataErrorDiv.textContent = langUtils.getCurrentLang() === 'es' ? 'La frecuencia total (N) no puede ser cero.' : 'Maiztasun totala (N) ezin da zero izan.';
            } else if (!manualDataErrorDiv.textContent) { // Error genérico si no se especificó antes
                manualDataErrorDiv.textContent = langUtils.getCurrentLang() === 'es' ? 'Error en los datos introducidos. Revisa las frecuencias.' : 'Errorea sartutako datuetan. Berrikusi maiztasunak.';
            }
            manualDataErrorDiv.style.display = 'block';
            resultadosGraficoDiv.style.display = 'none'; // Ocultar resultados
            return;
        }

        // 2. Calcular tabla completa
        calculatedTable = {};
        uniqueXiValues = [...processedFi.keys()];

         // Ordenar Xi: numéricamente si todos son números, alfabéticamente si no
         const allNumeric = uniqueXiValues.every(val => !isNaN(parseFloat(val)) && isFinite(val));
         if (allNumeric) {
             uniqueXiValues.sort((a, b) => parseFloat(a) - parseFloat(b));
         } else {
             uniqueXiValues.sort(); // Orden alfabético/natural
         }


        let cumulativeFi = 0;
        let cumulativeHi = 0.0;

        uniqueXiValues.forEach(xi => {
            const fi = processedFi.get(xi) || 0;
            const hi = N > 0 ? fi / N : 0;
            const pct = hi * 100;
            cumulativeFi += fi;
            cumulativeHi += hi;
            calculatedTable[xi] = {
                fi: fi,
                hi: hi,
                Fi: cumulativeFi, // Frecuencia Absoluta Acumulada
                Hi: cumulativeHi, // Frecuencia Relativa Acumulada
                pct: pct
            };
        });

        // 3. Renderizar tabla calculada, gráfico y mostrar resultados
        renderCalculatedTable();
        updateChart();
        generateInterpretation();
        resultadosGraficoDiv.style.display = 'block'; // Mostrar sección de resultados
    }

    // Renderizar la tabla de frecuencias calculada
    function renderCalculatedTable() {
        tablaFrecuenciasCalculadaBody.innerHTML = ''; // Limpiar
        tablaFrecuenciasCalculadaFoot.innerHTML = ''; // Limpiar

        uniqueXiValues.forEach(xi => {
            const data = calculatedTable[xi];
            const row = tablaFrecuenciasCalculadaBody.insertRow();
            row.insertCell().textContent = xi;
            row.insertCell().textContent = data.fi;
            row.insertCell().textContent = data.hi.toFixed(3); // Formatear decimales
            row.insertCell().textContent = data.Fi;
            row.insertCell().textContent = data.Hi.toFixed(3); // Formatear decimales
            row.insertCell().textContent = data.pct.toFixed(1) + '%'; // Formatear porcentaje
        });

        // Añadir fila de totales
        const footerRow = tablaFrecuenciasCalculadaFoot.insertRow();
        const cellTotalLabel = footerRow.insertCell();
        cellTotalLabel.textContent = langUtils.getCurrentLang() === 'es' ? 'Total' : 'Guztira';
        cellTotalLabel.dataset.langEs = 'Total';
        cellTotalLabel.dataset.langEu = 'Guztira';
        footerRow.insertCell().textContent = N;
        footerRow.insertCell().textContent = (N > 0 ? '1.000' : '0.000'); // Suma de hi
        footerRow.insertCell().textContent = ''; // Celda vacía para Fi total
        footerRow.insertCell().textContent = ''; // Celda vacía para Hi total
        footerRow.insertCell().textContent = (N > 0 ? '100.0%' : '0.0%'); // Suma de %
    }

    // Actualizar/Crear el gráfico
    function updateChart() {
        if (chartInstance) {
            chartInstance.destroy(); // Destruir gráfico anterior
        }
        if (uniqueXiValues.length === 0 || !chartCanvas) return; // No hay datos o canvas

        const labels = uniqueXiValues;
        const dataFi = uniqueXiValues.map(xi => calculatedTable[xi].fi);
        // Generar colores (simplificado)
        const backgroundColors = generateColors(labels.length);
        const borderColors = backgroundColors.map(color => color.replace('0.6', '1')); // Opacidad 1 para borde

        // Datos para Chart.js
        const chartData = {
            labels: labels,
            datasets: [{
                label: langUtils.getCurrentLang() === 'es' ? 'Frecuencia Absoluta (fi)' : 'Maiztasun Absolutua (fi)',
                data: dataFi,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
                hoverOffset: (currentChartType === 'pie') ? 4 : 0 // Solo para pie
            }]
        };

        // Opciones de Chart.js
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: currentChartType === 'pie', // Leyenda solo para pie
                    position: 'top',
                },
                title: {
                    display: true,
                    text: langUtils.getCurrentLang() === 'es' ? 'Gráfico Generado' : 'Sortutako Grafikoa',
                    font: { size: 16 }
                },
                tooltip: { // Personalizar tooltips si es necesario
                    callbacks: {
                       label: function(context) {
                           let label = context.dataset.label || '';
                           if (label) { label += ': '; }
                           if (context.parsed.y !== null) { label += context.parsed.y; } // Para barras
                           else if(context.parsed !== null) { // Para pie
                               label = context.label + ': ' + context.parsed;
                               // Añadir porcentaje al tooltip del pie
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                                label += ` (${percentage}%)`;
                           }
                           return label;
                       }
                    }
                }
            },
            scales: (currentChartType === 'bar') ? { // Escalas solo para barras
                y: { beginAtZero: true, title: { display: true, text: 'Frecuencia (fᵢ)' } },
                x: { title: { display: true, text: 'Valor / Categoría (xᵢ)' } }
            } : {} // Sin escalas para pie
        };

        // Crear nuevo gráfico
        chartInstance = new Chart(chartCanvas, {
            type: currentChartType,
            data: chartData,
            options: chartOptions
        });
    }

    // Generar colores simples para gráficos
    function generateColors(count) {
         // Paleta base simple (más colores si es necesario)
         const baseColors = [
             'rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)',
             'rgba(255, 206, 86, 0.6)', 'rgba(153, 102, 255, 0.6)',
             'rgba(255, 99, 132, 0.6)', 'rgba(255, 159, 64, 0.6)',
             'rgba(46, 204, 113, 0.6)', 'rgba(230, 126, 34, 0.6)',
             'rgba(149, 165, 166, 0.6)', 'rgba(52, 73, 94, 0.6)'
         ];
         let colors = [];
         for (let i = 0; i < count; i++) {
             colors.push(baseColors[i % baseColors.length]); // Repetir colores si hay más de 10 categorías
         }
         return colors;
    }

    // Generar interpretación básica y estadísticas descriptivas
    function generateInterpretation() {
        if (uniqueXiValues.length === 0 || !panelInterpretacionP || N === 0) {
            panelInterpretacionP.innerHTML = ''; // Clear if no data or N=0
            return;
        }

        let maxFi = -1;
        let modaValues = [];

        uniqueXiValues.forEach(xi => {
            const data = calculatedTable[xi];
            if(data && data.fi > 0) { // Only consider values with positive frequency
                if (data.fi > maxFi) {
                    maxFi = data.fi;
                    modaValues = [xi]; // Nuevo máximo encontrado
                } else if (data.fi === maxFi) {
                    modaValues.push(xi); // Empate en el máximo
                }
            }
        });

        // Determinar si los datos son numéricos
        const numericXiValues = uniqueXiValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val));
        const allNumeric = numericXiValues.length === uniqueXiValues.length;

        let mean = null;
        let median = null;

        // --- Calcular Media y Mediana si es numérico ---
        if (allNumeric && N > 0) {
            // Calcular Media (Batez bestekoa)
            let sumProduct = 0;
            numericXiValues.forEach(xi => {
                sumProduct += parseFloat(xi) * calculatedTable[xi].fi;
            });
            mean = sumProduct / N;

            // Calcular Mediana (Mediana)
            const sortedNumericData = numericXiValues
                .map(xi => ({ value: parseFloat(xi), fi: calculatedTable[xi].fi }))
                .sort((a, b) => a.value - b.value);

            const middlePosition1 = Math.floor((N - 1) / 2); // 0-based index for first middle element
            const middlePosition2 = Math.ceil((N - 1) / 2); // 0-based index for second middle element (same if N is odd)
            let cumulativeCount = 0;
            let medianVal1 = null;
            let medianVal2 = null;

            for (const item of sortedNumericData) {
                const nextCumulativeCount = cumulativeCount + item.fi;

                if (medianVal1 === null && nextCumulativeCount > middlePosition1) {
                    medianVal1 = item.value;
                }
                if (medianVal2 === null && nextCumulativeCount > middlePosition2) {
                    medianVal2 = item.value;
                    break; // Found both potential median values
                }
                cumulativeCount = nextCumulativeCount;
            }
            // If N=1, medianVal2 might still be null, handle this
            if (medianVal2 === null) medianVal2 = medianVal1;

            median = (medianVal1 + medianVal2) / 2; // Average the two middle values (works for odd N too)
        }

        // --- Construir Texto de Interpretación ---
        let interpretationTextES = `En este conjunto de <strong>${N}</strong> datos, `;
        let interpretationTextEU = `<strong>${N}</strong> datuko multzo honetan, `;

        // Añadir Moda
        if (maxFi <= 0 || modaValues.length === 0) { // Handle case where all frequencies are 0 or negative
             interpretationTextES += `no hay datos con frecuencia positiva para calcular la moda.`;
             interpretationTextEU += `ez dago maiztasun positiboa duen daturik moda kalkulatzeko.`;
        } else if (modaValues.length === uniqueXiValues.filter(xi => calculatedTable[xi].fi > 0).length && modaValues.length > 1) { // Distribución uniforme entre los que tienen freq > 0
            interpretationTextES += `todos los ${allNumeric ? 'valores' : 'categorías'} con frecuencia positiva aparecen ${maxFi} veces. No hay una moda única.`;
            interpretationTextEU += `maiztasun positiboa duten ${allNumeric ? 'balio' : 'kategoria'} guztiak ${maxFi} aldiz agertzen dira. Ez dago moda bakar bat.`;
        } else if (modaValues.length === 1) {
            interpretationTextES += `la moda (valor/categoría más frecuente) es <strong>${modaValues[0]}</strong>, con ${maxFi} apariciones (${calculatedTable[modaValues[0]].pct.toFixed(1)}%).`;
            interpretationTextEU += `moda (balio/kategoria ohikoena) <strong>${modaValues[0]}</strong> da, ${maxFi} aldiz agertuz (%${calculatedTable[modaValues[0]].pct.toFixed(1)}).`;
        } else if (modaValues.length > 1) { // Multimodal
            interpretationTextES += `hay varias modas: <strong>${modaValues.join(', ')}</strong>, cada una con ${maxFi} apariciones (${calculatedTable[modaValues[0]].pct.toFixed(1)}%).`;
            interpretationTextEU += `hainbat moda daude: <strong>${modaValues.join(', ')}</strong>, bakoitza ${maxFi} aldiz agertuz (%${calculatedTable[modaValues[0]].pct.toFixed(1)}).`;
        }

        // Añadir Media y Mediana si es numérico
        if (allNumeric && N > 0) {
            interpretationTextES += ` La media aritmética es <strong>${mean.toFixed(2)}</strong> y la mediana es <strong>${median.toFixed(2)}</strong>.`;
            interpretationTextEU += ` Batez besteko aritmetikoa <strong>${mean.toFixed(2)}</strong> da eta mediana <strong>${median.toFixed(2)}</strong> da.`;
        } else if (N > 0) {
             interpretationTextES += ` La media y la mediana no se calculan para datos no numéricos.`;
             interpretationTextEU += ` Batez bestekoa eta mediana ez dira kalkulatzen datu ez-numerikoetarako.`;
        }

        panelInterpretacionP.innerHTML = langUtils.getCurrentLang() === 'es' ? interpretationTextES : interpretationTextEU;
    }

    // --- Event Listeners Iniciales ---
    if(btnAddRow) btnAddRow.addEventListener('click', addRow);
    if(btnProcessData) btnProcessData.addEventListener('click', processData);

    // ... (rest of the code remains the same)
    chartTypeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            currentChartType = event.target.value;
            updateChart(); // Regenerar gráfico con el nuevo tipo
        });
    });

    // Listener para botones de eliminar fila (delegación de eventos)
    tablaDatosManualBody.addEventListener('click', (event) => {
        if (event.target.closest('.remove-row-button')) {
            removeRow(event);
        }
    });

    // --- Inicialización al cargar ---
    renderManualTable(); // Renderizar la fila inicial
    console.log("Herramienta gráfico interactivo lista.");

}); // Fin DOMContentLoaded