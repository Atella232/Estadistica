document.addEventListener('DOMContentLoaded', () => {
    // Comprobar si estamos en la página correcta o si existe el contenedor principal
    const toolContainer = document.getElementById('herramienta-frecuencia-interactiva');
    if (!toolContainer) {
        // console.log("Herramienta frecuencia interactiva no encontrada en esta página.");
        return; // Salir si no estamos en la página de frecuencias o no existe el contenedor
    }
    console.log("Inicializando herramienta frecuencia interactiva...");

    // --- Selectores de Elementos del DOM ---
    const tipoVariableSelect = document.getElementById('tipo-variable');
    const controlesDiscretaDiv = document.getElementById('controles-discreta');
    const rangoMinInput = document.getElementById('rango-min');
    const rangoMaxInput = document.getElementById('rango-max');
    const controlesCualitativaDiv = document.getElementById('controles-cualitativa');
    const categoriasInput = document.getElementById('categorias');
    const tamanoMuestraSlider = document.getElementById('tamano-muestra');
    const tamanoMuestraValorSpan = document.getElementById('tamano-muestra-valor');
    const nivelDificultadSelect = document.getElementById('nivel-dificultad');
    const btnGenerarDatos = document.getElementById('btn-generar-datos');
    const zonaEjercicioDiv = document.getElementById('zona-ejercicio');
    const nDisplaySpanEs = document.getElementById('n-display-es');
    const nDisplaySpanEu = document.getElementById('n-display-eu');
    const datosBrutosDisplayDiv = document.getElementById('datos-brutos-display');
    const tablaEditableTbody = document.querySelector('#tabla-frecuencias-editable tbody');
    const tablaEditableTfoot = document.querySelector('#tabla-frecuencias-editable tfoot'); // Para totales
    const feedbackGeneralDiv = document.getElementById('feedback-general');
    const accionesEstadisticasDiv = document.getElementById('acciones-estadisticas');
    const btnComprobar = document.getElementById('btn-comprobar');
    const btnReintentar = document.getElementById('btn-reintentar');
    const btnNuevaMuestra = document.getElementById('btn-nueva-muestra');
    const btnExportarCsv = document.getElementById('btn-exportar-csv');
    const statsTiempoSpan = document.getElementById('stats-tiempo');
    const statsIntentosSpan = document.getElementById('stats-intentos');
    const statsAciertosSpan = document.getElementById('stats-aciertos');

    // Comprobar si language.js está cargado y obtener utils
    let langUtils = null;
    if (typeof initLanguage === 'function') {
        // Suponemos que language.js ya se ha inicializado en main.js o similar
        // Necesitamos acceder a las funciones retornadas por initLanguage.
        // Si main.js no expone langUtils globalmente (lo cual es bueno),
        // podríamos necesitar una forma de acceder a él o pasar las funciones necesarias.
        // Solución simple por ahora: re-inicializar o buscar global (NO RECOMENDADO EN PROD)
        // Alternativa: main.js podría adjuntar langUtils al window o al contenedor de la herramienta.
        // Por ahora, asumimos que está disponible globalmente o se pasa de alguna manera.
        // Si se ejecuta como módulo independiente, necesitaría su propia inicialización de langUtils.
        if (window.langUtils) { // Asumiendo que main.js lo adjunta a window (adaptar si no es así)
             langUtils = window.langUtils;
        } else {
            console.warn("langUtils no encontrado. Las traducciones pueden fallar.");
            // Crear un objeto dummy para evitar errores, aunque no traducirá
            langUtils = {
                getCurrentLang: () => 'es', // idioma por defecto
                applyLanguage: () => {}     // función vacía
            };
        }
    } else {
        console.error("Función initLanguage no encontrada.");
         langUtils = { getCurrentLang: () => 'es', applyLanguage: () => {} };
    }


    // --- Estado de la Herramienta ---
    let datosBrutos = [];
    let tablaCorrecta = {}; // Objeto/Map con xi como clave y {fi, hi, pct} como valor
    let valoresUnicos = []; // Array de xi ordenados
    let N = 0; // Tamaño de la muestra
    let timerInterval = null;
    let startTime = null;
    let intentosComprobacion = 0;
    let resultadosComprobados = false;

    // --- Funciones ---

    // Mostrar/Ocultar controles según tipo de variable
    function actualizarVisibilidadControles() {
        const tipo = tipoVariableSelect.value;
        controlesDiscretaDiv.style.display = (tipo === 'discreta') ? 'flex' : 'none';
        controlesCualitativaDiv.style.display = (tipo === 'cualitativa') ? 'flex' : 'none';
    }

    // Generar número aleatorio entero en rango [min, max]
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generar datos brutos
    function generarDatos() {
        const tipo = tipoVariableSelect.value;
        N = parseInt(tamanoMuestraSlider.value);
        const dificultad = nivelDificultadSelect.value;
        datosBrutos = [];

        if (tipo === 'discreta') {
            const min = parseInt(rangoMinInput.value);
            const max = parseInt(rangoMaxInput.value);
            if (isNaN(min) || isNaN(max) || min > max) {
                alert(langUtils.getCurrentLang() === 'es' ? "Rango inválido para variable discreta." : "Barruti baliogabea aldagai diskreturako.");
                return false;
            }
            for (let i = 0; i < N; i++) {
                datosBrutos.push(getRandomInt(min, max));
            }
            // Lógica dificultad (avanzado podría forzar algún valor a no aparecer)
            if (dificultad === 'avanzado' && max > min) {
                const valorAusente = getRandomInt(min, max);
                datosBrutos = datosBrutos.filter(d => d !== valorAusente);
                 // Rellenar hasta N si se quitaron muchos
                while (datosBrutos.length < N) {
                     let nuevoValor;
                     do {
                         nuevoValor = getRandomInt(min, max);
                     } while (nuevoValor === valorAusente); // Evitar añadir el ausente
                     datosBrutos.push(nuevoValor);
                 }
            }

        } else { // cualitativa
            const categoriasStr = categoriasInput.value.trim();
            if (!categoriasStr) {
                 alert(langUtils.getCurrentLang() === 'es' ? "Introduce al menos una categoría." : "Sartu gutxienez kategoria bat.");
                return false;
            }
            const categorias = categoriasStr.split(',').map(cat => cat.trim()).filter(cat => cat !== '');
            if (categorias.length === 0) {
                 alert(langUtils.getCurrentLang() === 'es' ? "Categorías inválidas." : "Kategoria baliogabeak.");
                 return false;
             }
            for (let i = 0; i < N; i++) {
                datosBrutos.push(categorias[Math.floor(Math.random() * categorias.length)]);
            }
             // Lógica dificultad (avanzado podría forzar alguna categoría a no aparecer)
            if (dificultad === 'avanzado' && categorias.length > 1) {
                const categoriaAusente = categorias[Math.floor(Math.random() * categorias.length)];
                 datosBrutos = datosBrutos.filter(d => d !== categoriaAusente);
                 // Rellenar hasta N
                 while (datosBrutos.length < N) {
                     let nuevaCat;
                     do {
                         nuevaCat = categorias[Math.floor(Math.random() * categorias.length)];
                     } while (nuevaCat === categoriaAusente);
                     datosBrutos.push(nuevaCat);
                 }
            }
        }
        return true; // Datos generados
    }

    // Mostrar datos brutos
    function mostrarDatosBrutos() {
        datosBrutosDisplayDiv.innerHTML = ''; // Limpiar
        // Mostrar como lista separada por comas para ahorrar espacio
        datosBrutosDisplayDiv.textContent = datosBrutos.join(', ');
        // Actualizar N en el título
         if (nDisplaySpanEs) nDisplaySpanEs.textContent = N;
         if (nDisplaySpanEu) nDisplaySpanEu.textContent = N; // Asegurar traducción inicial
         langUtils.applyLanguage(langUtils.getCurrentLang()); // Aplicar idioma al título actualizado
    }

    // Calcular la tabla de frecuencias correcta
    function calcularTablaCorrecta() {
        tablaCorrecta = {};
        valoresUnicos = [];
        const freqMap = new Map();

        // Contar frecuencias absolutas (fi)
        datosBrutos.forEach(dato => {
            freqMap.set(dato, (freqMap.get(dato) || 0) + 1);
        });

        // Obtener valores únicos y ordenarlos (si son números)
        valoresUnicos = [...freqMap.keys()];
        if (tipoVariableSelect.value === 'discreta') {
            valoresUnicos.sort((a, b) => a - b);
        } else {
             valoresUnicos.sort(); // Orden alfabético para cualitativas
        }

        // Añadir categorías/valores con fi=0 si es nivel avanzado
        if (nivelDificultadSelect.value === 'avanzado') {
            if (tipoVariableSelect.value === 'discreta') {
                const min = parseInt(rangoMinInput.value);
                const max = parseInt(rangoMaxInput.value);
                for (let i = min; i <= max; i++) {
                    if (!freqMap.has(i)) {
                        freqMap.set(i, 0);
                        if (!valoresUnicos.includes(i)) valoresUnicos.push(i);
                    }
                }
                valoresUnicos.sort((a, b) => a - b); // Reordenar con los ceros
            } else {
                const categorias = categoriasInput.value.split(',').map(cat => cat.trim()).filter(cat => cat !== '');
                categorias.forEach(cat => {
                    if (!freqMap.has(cat)) {
                        freqMap.set(cat, 0);
                         if (!valoresUnicos.includes(cat)) valoresUnicos.push(cat);
                    }
                });
                 valoresUnicos.sort(); // Reordenar con los ceros
            }
        }

        // Calcular hi y % para cada valor único
        valoresUnicos.forEach(xi => {
            const fi = freqMap.get(xi) || 0; // Asegurar fi=0 si no está (aunque ya se hizo antes)
            const hi = N > 0 ? fi / N : 0;
            const pct = hi * 100;
            tablaCorrecta[xi] = { fi, hi, pct };
        });
    }

    // Renderizar la tabla editable
    function renderizarTablaEditable() {
        tablaEditableTbody.innerHTML = ''; // Limpiar cuerpo
        tablaEditableTfoot.innerHTML = ''; // Limpiar pie

        valoresUnicos.forEach(xi => {
            const row = tablaEditableTbody.insertRow();

            // Celda Xi (no editable)
            const cellXi = row.insertCell();
            cellXi.textContent = xi;
            cellXi.classList.add('xi-value');

            // Celda Fi (editable)
            const cellFi = row.insertCell();
            const inputFi = document.createElement('input');
            inputFi.type = 'number';
            inputFi.min = '0';
            inputFi.step = '1';
            inputFi.dataset.xi = xi;
            inputFi.dataset.col = 'fi';
            cellFi.appendChild(inputFi);

            // Celda Hi (editable)
            const cellHi = row.insertCell();
            const inputHi = document.createElement('input');
            inputHi.type = 'number';
            inputHi.min = '0';
            inputHi.max = '1';
            inputHi.step = '0.001'; // Permitir más decimales para entrada
            inputHi.dataset.xi = xi;
            inputHi.dataset.col = 'hi';
            cellHi.appendChild(inputHi);

            // Celda % (editable)
            const cellPct = row.insertCell();
            const inputPct = document.createElement('input');
            inputPct.type = 'number';
            inputPct.min = '0';
            inputPct.max = '100';
            inputPct.step = '0.1'; // Permitir decimales
            inputPct.dataset.xi = xi;
            inputPct.dataset.col = 'pct';
            cellPct.appendChild(inputPct);
        });

         // Añadir fila de Totales al tfoot
         const footerRow = tablaEditableTfoot.insertRow();
         const cellTotalLabel = footerRow.insertCell();
         cellTotalLabel.textContent = langUtils.getCurrentLang() === 'es' ? 'Total' : 'Guztira';
         cellTotalLabel.dataset.langEs = 'Total';
         cellTotalLabel.dataset.langEu = 'Guztira';
         const cellTotalFi = footerRow.insertCell();
         cellTotalFi.textContent = N; // Suma de fi debe ser N
         const cellTotalHi = footerRow.insertCell();
         cellTotalHi.textContent = '1.00'; // Suma de hi debe ser 1
         const cellTotalPct = footerRow.insertCell();
         cellTotalPct.textContent = '100%'; // Suma de % debe ser 100
    }

    // Comprobar respuestas
    function comprobarRespuestas() {
        if (resultadosComprobados) return; // Evitar comprobar múltiples veces sin reintentar
        detenerTimer();
        intentosComprobacion++;
        resultadosComprobados = true; // Marcar como comprobado
        btnComprobar.disabled = true; // Deshabilitar hasta reintentar/nueva muestra
        btnReintentar.disabled = false;
        btnNuevaMuestra.disabled = false;

        let aciertos = 0;
        let totalInputs = 0;
        let feedbackHtml = '';
        const toleranciaHi = 0.01; // Tolerancia para frecuencias relativas
        const toleranciaPct = 1; // Tolerancia para porcentajes

        tablaEditableTbody.querySelectorAll('input').forEach(input => {
            totalInputs++;
            const xi = input.dataset.xi;
            const col = input.dataset.col;
            const valorUsuario = parseFloat(input.value);
            const valorCorrecto = tablaCorrecta[xi] ? tablaCorrecta[xi][col] : null; // Obtener valor correcto

            input.classList.remove('input-correct', 'input-incorrect'); // Limpiar clases previas

            if (isNaN(valorUsuario) || valorCorrecto === null) {
                input.classList.add('input-incorrect'); // Marcar como incorrecto si no es número o no hay valor correcto
            } else {
                let esCorrecto = false;
                if (col === 'fi') {
                    esCorrecto = Math.round(valorUsuario) === valorCorrecto; // fi deben ser enteros exactos
                } else if (col === 'hi') {
                    esCorrecto = Math.abs(valorUsuario - valorCorrecto) <= toleranciaHi;
                } else if (col === 'pct') {
                    esCorrecto = Math.abs(valorUsuario - valorCorrecto) <= toleranciaPct;
                }

                if (esCorrecto) {
                    input.classList.add('input-correct');
                    aciertos++;
                } else {
                    input.classList.add('input-incorrect');
                    // Añadir pista específica (ejemplo para fi)
                    if (col === 'fi') {
                        const pista_es = `Pista: Revisa cuántas veces aparece '${xi}'. El valor correcto es ${valorCorrecto}.`;
                        const pista_eu = `Pista: Berrikusi zenbat aldiz agertzen den '${xi}'. Balio zuzena ${valorCorrecto} da.`;
                        input.title = langUtils.getCurrentLang() === 'es' ? pista_es : pista_eu; // Pista en tooltip
                    } else if (col === 'hi') {
                         const pista_es = `Pista: Recuerda hᵢ = fᵢ / N. El valor correcto es ${valorCorrecto.toFixed(3)}.`;
                         const pista_eu = `Pista: Gogoratu hᵢ = fᵢ / N. Balio zuzena ${valorCorrecto.toFixed(3)} da.`;
                         input.title = langUtils.getCurrentLang() === 'es' ? pista_es : pista_eu;
                    } else if (col === 'pct') {
                         const pista_es = `Pista: Recuerda % = hᵢ × 100. El valor correcto es ${valorCorrecto.toFixed(1)}%.`;
                         const pista_eu = `Pista: Gogoratu % = hᵢ × 100. Balio zuzena %${valorCorrecto.toFixed(1)} da.`;
                         input.title = langUtils.getCurrentLang() === 'es' ? pista_es : pista_eu;
                    }
                }
            }
             // Deshabilitar input después de comprobar
            input.disabled = true;
        });

        const porcentajeAciertos = totalInputs > 0 ? ((aciertos / totalInputs) * 100).toFixed(0) : 0;
        statsAciertosSpan.textContent = `${porcentajeAciertos}%`;
        statsIntentosSpan.textContent = intentosComprobacion;

        // Feedback general
        feedbackGeneralDiv.classList.remove('correct', 'incorrect');
        if (aciertos === totalInputs) {
            feedbackGeneralDiv.classList.add('correct');
            feedbackGeneralDiv.innerHTML = `<strong data-lang-es="¡Tabla Completada Correctamente!" data-lang-eu="Taula Zuzen Osatuta!">¡Tabla Completada Correctamente!</strong>`;
        } else {
            feedbackGeneralDiv.classList.add('incorrect');
             const mensaje_es = `Se encontraron ${totalInputs - aciertos} errores. Revisa las celdas en rojo.`;
             const mensaje_eu = `${totalInputs - aciertos} akats aurkitu dira. Berrikusi gelaxka gorriak.`;
            feedbackGeneralDiv.innerHTML = `<strong data-lang-es="${mensaje_es}" data-lang-eu="${mensaje_eu}">${langUtils.getCurrentLang() === 'es' ? mensaje_es : mensaje_eu}</strong>`;
        }
        langUtils.applyLanguage(langUtils.getCurrentLang()); // Aplicar idioma al feedback

        // Habilitar exportación si se comprobó
        btnExportarCsv.disabled = false;
    }

     // Limpiar tabla y feedback para reintentar
     function prepararReintento() {
         tablaEditableTbody.querySelectorAll('input').forEach(input => {
             input.value = ''; // Limpiar valor
             input.classList.remove('input-correct', 'input-incorrect');
             input.title = ''; // Limpiar tooltips/pistas
             input.disabled = false; // Habilitar input
         });
         feedbackGeneralDiv.innerHTML = ''; // Limpiar feedback general
         feedbackGeneralDiv.classList.remove('correct', 'incorrect');
         resultadosComprobados = false; // Permitir comprobar de nuevo
         btnComprobar.disabled = false; // Habilitar botón comprobar
         btnExportarCsv.disabled = true; // Deshabilitar export hasta nueva comprobación
         iniciarTimer(); // Reiniciar timer
         // No resetear intentosComprobacion aquí, es por sesión de datos
     }


    // --- Timer ---
    function iniciarTimer() {
        detenerTimer(); // Asegurar que no haya timers previos
        startTime = new Date();
        timerInterval = setInterval(actualizarTimerDisplay, 1000);
        actualizarTimerDisplay(); // Mostrar 0s inicial
    }

    function detenerTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function actualizarTimerDisplay() {
        if (!startTime) {
            statsTiempoSpan.textContent = '0s';
            return;
        }
        const now = new Date();
        const elapsedSeconds = Math.round((now - startTime) / 1000);
        statsTiempoSpan.textContent = `${elapsedSeconds}s`;
    }

    // --- Exportar a CSV ---
    function exportarTablaACSV() {
         if (!resultadosComprobados) {
             alert(langUtils.getCurrentLang() === 'es' ? "Primero debes comprobar tus respuestas." : "Lehenik zure erantzunak egiaztatu behar dituzu.");
             return;
         }

         let csvContent = "data:text/csv;charset=utf-8,";
         const headers = ["xi", "fi_usuario", "fi_correcto", "hi_usuario", "hi_correcto", "pct_usuario", "pct_correcto", "estado_fi", "estado_hi", "estado_pct"].join(",");
         csvContent += headers + "\r\n";

         valoresUnicos.forEach(xi => {
             const row = tablaEditableTbody.querySelector(`input[data-xi="${xi}"][data-col="fi"]`).closest('tr');
             const inputs = row.querySelectorAll('input');
             const fiInput = inputs[0];
             const hiInput = inputs[1];
             const pctInput = inputs[2];
             const correctData = tablaCorrecta[xi];

             const rowData = [
                 `"${xi}"`, // Valor xi (entre comillas por si es cualitativo con comas)
                 fiInput.value || 'N/A', correctData.fi,
                 hiInput.value || 'N/A', correctData.hi.toFixed(3),
                 pctInput.value || 'N/A', correctData.pct.toFixed(1),
                 fiInput.classList.contains('input-correct') ? 'Correcto' : (fiInput.classList.contains('input-incorrect') ? 'Incorrecto' : 'No comprobado'),
                 hiInput.classList.contains('input-correct') ? 'Correcto' : (hiInput.classList.contains('input-incorrect') ? 'Incorrecto' : 'No comprobado'),
                 pctInput.classList.contains('input-correct') ? 'Correcto' : (pctInput.classList.contains('input-incorrect') ? 'Incorrecto' : 'No comprobado')
             ];
             csvContent += rowData.join(",") + "\r\n";
         });

         // Añadir totales
         csvContent += `"${langUtils.getCurrentLang() === 'es' ? 'Total' : 'Guztira'}",${N},${N},1.000,1.000,100.0,100.0,,,,` + "\r\n";

         // Crear y descargar el archivo
         const encodedUri = encodeURI(csvContent);
         const link = document.createElement("a");
         link.setAttribute("href", encodedUri);
         link.setAttribute("download", "tabla_frecuencias.csv");
         document.body.appendChild(link); // Required for FF
         link.click();
         document.body.removeChild(link);
    }


    // --- Event Listeners Iniciales ---

    // Cambiar visibilidad de controles de rango/categorías
    tipoVariableSelect.addEventListener('change', actualizarVisibilidadControles);

    // Actualizar valor visible del slider
    tamanoMuestraSlider.addEventListener('input', () => {
        tamanoMuestraValorSpan.textContent = tamanoMuestraSlider.value;
    });

    // Botón Generar Datos
    btnGenerarDatos.addEventListener('click', () => {
        if (generarDatos()) {
            calcularTablaCorrecta();
            mostrarDatosBrutos();
            renderizarTablaEditable();
            zonaEjercicioDiv.style.display = 'grid'; // Mostrar zona de ejercicio
            accionesEstadisticasDiv.style.display = 'grid'; // Mostrar acciones
            intentosComprobacion = 0; // Resetear intentos para la nueva muestra
            resultadosComprobados = false;
            statsIntentosSpan.textContent = '0';
            statsAciertosSpan.textContent = '--';
            btnComprobar.disabled = false;
            btnReintentar.disabled = true; // Deshabilitar hasta comprobar
            btnNuevaMuestra.disabled = false;
            btnExportarCsv.disabled = true; // Deshabilitar hasta comprobar
            feedbackGeneralDiv.innerHTML = '';
            feedbackGeneralDiv.classList.remove('correct', 'incorrect');
             tablaEditableTbody.querySelectorAll('input').forEach(input => {
                 input.disabled = false; // Habilitar inputs
                 input.value = '';
                 input.classList.remove('input-correct', 'input-incorrect');
                 input.title = '';
             });
            iniciarTimer();
        }
    });

    // Botón Comprobar
    btnComprobar.addEventListener('click', comprobarRespuestas);

     // Botón Reintentar
     btnReintentar.addEventListener('click', prepararReintento);

     // Botón Nueva Muestra
     btnNuevaMuestra.addEventListener('click', () => {
         // Simula clic en generar datos para reiniciar todo
         btnGenerarDatos.click();
     });

     // Botón Exportar CSV
     btnExportarCsv.addEventListener('click', exportarTablaACSV);
     btnExportarCsv.disabled = true; // Deshabilitado inicialmente

    // --- Inicialización al cargar ---
    actualizarVisibilidadControles(); // Ajustar controles iniciales
    console.log("Herramienta frecuencia interactiva lista.");

}); // Fin DOMContentLoaded