// Aplicación de estado
let data = []; // { xi: string|number, fi: number } objetos para almacenar datos
let chartInstance = null;
let currentLanguage = 'es'; // Idioma predeterminado

// Traducciones
const translations = {
    es: {
        addData: "Añadir Dato",
        clearTable: "Limpiar Tabla",
        barChart: "Diagrama de Barras",
        pieChart: "Diagrama de Sectores",
        mean: "Media",
        mode: "Moda",
        median: "Mediana",
        range: "Rango",
        viewSteps: "Ver Pasos",
        calculationSteps: "Pasos del Cálculo",
        noData: "¡Todavía no hay datos. ¡Añade algunos!",
        chartPlaceholder: "Elige un tipo de gráfico para empezar.<br/>¡Asegúrate de tener datos en la tabla!",
        errorEmptyValue: "¡Cuidado! El 'Valor (xi)' no puede estar vacío.",
        errorInvalidFreq: "¡Recuerda! La 'Frecuencia (fi)' debe ser un número entero mayor que 0.",
        errorNeedDataForSteps: "¡Necesitas datos en la tabla para ver los pasos de ",
        updatedFrequency: "La frecuencia para el valor ",
        updatedFrequencySuffix: " ha sido actualizada. Nueva fi = ",
        addDataFirst: "¡Necesitas añadir datos a la tabla para ver los gráficos!",
        addDataForGraph: "¡Añade datos primero para ver el gráfico!",
        notApplicable: "N/A (datos no num.)",
        amodal: "Amodal",
        andMore: " y más...",
        noModeOrData: "No hay una moda clara o no hay datos.",
        noCantCalc: " no se puede calcular porque tus datos (xi) contienen valores que no son números (por ejemplo, texto como colores).",
        numericDataOnly: "La Media, Mediana y Rango solo se pueden calcular con datos numéricos.",
        // Explicaciones
        meanTitle: "Cómo Calcular la Media 🤓",
        meanIntro: "La <strong>media</strong> es como repartir todo en partes iguales. ¡Es muy útil!",
        meanStep1: "<strong>Multiplica cada valor (xi) por su frecuencia (fi):</strong> Esto nos da el \"peso\" total de cada valor.",
        meanStep2: "<strong>Suma todos estos resultados:</strong> Esto es el total de (xi * fi).",
        meanStep3: "<strong>Suma todas las frecuencias (fi):</strong> Esto te dice cuántos datos hay en total (N).",
        meanStep4: "<strong>Divide la suma de (xi * fi) entre N:</strong>",
        meanResult: "🎉 ¡La media es ",
        modeTitle: "Cómo Encontrar la Moda 😎",
        modeIntro: "La <strong>moda</strong> es el valor que más se repite. Es el valor (o valores) con la frecuencia (fi) más alta.",
        modeStep1: "<strong>Mira tu tabla de frecuencias.</strong>",
        modeStep2: "<strong>Busca la frecuencia (fi) más alta.</strong> En tus datos, la frecuencia más alta es <strong>",
        modeStep3: "<strong>Los valores xi que tienen esa frecuencia son la moda.</strong>",
        modeResult: "🎉 ¡La moda es ",
        modeMultiple: "(Sí, puede haber más de una moda. Se llama bimodal, trimodal, etc.)",
        modeAmodal: "🎉 ¡Es amodal! (todas las frecuencias son iguales y hay más de un dato).",
        medianTitle: "Cómo Calcular la Mediana 🧘",
        medianIntro: "La <strong>mediana</strong> es el valor que está justo en el medio cuando ordenas todos tus datos de menor a mayor.",
        medianStep1: "<strong>Escribe todos tus valores (xi) repetidos según su frecuencia (fi), ordenados de menor a mayor.</strong> (Como tus datos ya están ordenados por xi, esta lista también lo estará).",
        medianStep2: "<strong>Cuenta cuántos números hay en total (N).</strong>",
        medianStep3: "<strong>Encuentra el valor central:</strong>",
        medianOdd: "Como N (",
        medianOddMid: ") es impar, la mediana es el valor que está en la posición <strong>",
        medianOddValue: "Este valor es: <strong>",
        medianEven: "Como N (",
        medianEvenMid: ") es par, la mediana está entre dos valores. Los que están en las posiciones <strong>",
        medianEvenPos1: "El valor en la posición ",
        medianEvenPos2: "La mediana es el promedio de estos dos: (",
        medianNoData: "No hay datos para calcular la mediana.",
        medianResult: "🎉 ¡La mediana es ",
        rangeTitle: "Cómo Calcular el Rango 📏",
        rangeIntro: "El <strong>rango</strong> te dice cuán \"dispersos\" están tus datos. Es la diferencia entre el valor más grande y el más pequeño.",
        rangeStep1: "<strong>Encuentra el valor (xi) más grande.</strong> En tus datos es: <strong>",
        rangeStep2: "<strong>Encuentra el valor (xi) más pequeño.</strong> En tus datos es: <strong>",
        rangeStep3: "<strong>Resta el valor más pequeño del más grande.</strong>",
        rangeResult: "🎉 ¡El rango es ",
        listPrefix: "Lista: ",
        errorExplanation: "No se encontró la explicación. ¡Algo salió mal!"
    },
    eu: {
        addData: "Gehitu Datua",
        clearTable: "Garbitu Taula",
        barChart: "Barra Diagrama",
        pieChart: "Sektore Diagrama",
        mean: "Batezbestekoa",
        mode: "Moda",
        median: "Mediana",
        range: "Heina",
        viewSteps: "Urratsak Ikusi",
        calculationSteps: "Kalkuluaren Urratsak",
        noData: "Oraindik ez dago daturik. Gehitu batzuk!",
        chartPlaceholder: "Aukeratu grafiko mota bat hasteko.<br/>Ziurtatu taulan datuak dituzula!",
        errorEmptyValue: "Kontuz! 'Balioa (xi)' ezin da hutsik egon.",
        errorInvalidFreq: "Gogoratu! 'Maiztasuna (fi)' zenbaki osoa eta 0 baino handiagoa izan behar da.",
        errorNeedDataForSteps: "Taulan datuak behar dituzu \"",
        updatedFrequency: "\"",
        updatedFrequencySuffix: "\" balioarentzako maiztasuna eguneratu da. Fi berria = ",
        addDataFirst: "Grafikoak ikusteko datuak gehitu behar dituzu taulara!",
        addDataForGraph: "Gehitu datuak lehenik grafikoa ikusteko!",
        notApplicable: "E/A (datu ez-num.)",
        amodal: "Amodala",
        andMore: " eta gehiago...",
        noModeOrData: "Ez dago moda argirik edo ez dago daturik.",
        noCantCalc: " ezin da kalkulatu zure datuek (xi) zenbakiak ez diren balioak dituztelako (adibidez, koloreak bezalako testua).",
        numericDataOnly: "Batezbestekoa, Mediana eta Heina datu numerikoekin soilik kalkula daitezke.",
        // Explicaciones
        meanTitle: "Nola Kalkulatu Batezbestekoa 🤓",
        meanIntro: "<strong>Batezbestekoa</strong> (edo bataz bestekoa) dena zati berdinetan banatzea bezalakoa da. Oso erabilgarria da!",
        meanStep1: "<strong>Biderkatu balio bakoitza (xi) bere maiztasunarekin (fi):</strong> Honek balio bakoitzaren \"pisu\" totala ematen digu.",
        meanStep2: "<strong>Gehitu emaitza horiek guztiak:</strong> Hau da (xi * fi)-ren batura totala.",
        meanStep3: "<strong>Gehitu maiztasun guztiak (fi):</strong> Honek guztira zenbat datu dauden esaten dizu (N).",
        meanStep4: "<strong>Zatitu (xi * fi)-ren batura N-rekin:</strong>",
        meanResult: "🎉 Batezbestekoa ",
        modeTitle: "Nola Aurkitu Moda 😎",
        modeIntro: "<strong>Moda</strong> gehien errepikatzen dena da! Maiztasun (fi) altuena duen balioa (edo balioak) da.",
        modeStep1: "<strong>Begiratu zure maiztasun taula.</strong>",
        modeStep2: "<strong>Bilatu maiztasun (fi) altuena.</strong> Zure datuetan, maiztasun altuena <strong>",
        modeStep3: "<strong>Maiztasun hori duten xi balioa (edo balioak) moda dira.</strong>",
        modeResult: "🎉 Moda ",
        modeMultiple: "(Bai, moda bat baino gehiago egon daitezke! Bimodala, trimodala, etab. deitzen zaio)",
        modeAmodal: "🎉 Amodala da! (maiztasun guztiak berdinak dira eta datu bat baino gehiago dago).",
        medianTitle: "Nola Kalkulatu Mediana 🧘",
        medianIntro: "<strong>Mediana</strong> zure datu guztiak txikienetik handienera ordenatzen dituzunean justu erdian dagoen balioa da. Hau da, datu multzo bat erdibitzen duen balioa da.",
        medianStep1: "<strong>Idatzi zure balio guztiak (xi) beren maiztasunaren (fi) arabera errepikatuta, txikienetik handienera ordenatuta.</strong> (Adibidez, xi=2 eta fi=3 badaude, 2, 2, 2 idatzi behar dira).",
        medianStep2: "<strong>Zenbatu zenbat datu dauden guztira (N).</strong> Hau da, fi guztien batura.",
        medianStep3: "<strong>Bilatu erdiko balioa:</strong>",
        medianOdd: "N (datu kopurua = ",
        medianOddMid: ") bakoitia denez, mediana <strong>",
        medianOddValue: "Balio hau da: <strong>",
        medianEven: "N (datu kopurua = ",
        medianEvenMid: ") bikoitia denez, mediana bi balioren artean dago. <strong>",
        medianEvenPos1: ") posizioko balioa <strong>",
        medianEvenPos2: "Mediana bi balio hauen batezbestekoa da: (",
        medianNoData: "Ez dago daturik mediana kalkulatzeko. Sartu datu batzuk leheniz.",
        medianResult: "🎉 Mediana ",
        rangeTitle: "Nola Kalkulatu Heina 📏",
        rangeIntro: "<strong>Heinak</strong> zure datuak zenbateraino \"bananduta\" edo sakabanatuta dauden esaten dizu. Balio handienaren eta txikienaren arteko aldea da.",
        rangeStep1: "<strong>Bilatu balio (xi) handiena.</strong> Zure datuetan hau da: <strong>",
        rangeStep2: "<strong>Bilatu balio (xi) txikiena.</strong> Zure datuetan hau da: <strong>",
        rangeStep3: "<strong>Kendu balio txikiena balio handienari.</strong>",
        rangeResult: "🎉 Heina ",
        listPrefix: "Zerrenda: ",
        errorExplanation: "Azalpena ez da aurkitu. Zerbait gaizki joan da!"
    }
};

// Función para inicializar la herramienta de estadística
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa las referencias a elementos DOM cuando el documento esté cargado
    initializeElements();
    
    // Obtener el idioma actual
    updateCurrentLanguage();
    
    // Configura los event listeners
    setupEventListeners();
    
    // Inicializa la tabla
    renderTable();
    resetStatisticsDisplay();
    
    // Conectar con el sistema de cambio de idioma existente
    if (window.addEventListener) {
        window.addEventListener('langChanged', function(e) {
            updateCurrentLanguage();
            updateUITexts();
        });
    }
});

// Actualiza el idioma actual según el estado de la página
function updateCurrentLanguage() {
    if (document.documentElement.getAttribute('lang') === 'eu') {
        currentLanguage = 'eu';
    } else {
        currentLanguage = 'es';
    }
}

// Actualiza todos los textos de la UI
function updateUITexts() {
    // No es necesario actualizar textos en elementos con atributos data-lang-es y data-lang-eu
    // ya que eso lo maneja el sistema de idiomas existente
    
    // Actualizar placeholders
    if (chartPlaceholder) {
        const placeholderSpan = chartPlaceholder.querySelector('span');
        if (!placeholderSpan) {
            chartPlaceholder.innerHTML = `<span>${getTranslation('chartPlaceholder')}</span>`;
        }
    }
    
    // Actualizar textos que no están controlados por el sistema de idiomas existente
    if (noDataRow) {
        const noDataSpan = noDataRow.querySelector('span');
        if (!noDataSpan) {
            noDataRow.querySelector('td').innerHTML = `<span>${getTranslation('noData')}</span>`;
        }
    }
    
    // Si hay un gráfico activo, actualizarlo
    updateChartIfActive();
}

// Obtener un texto traducido
function getTranslation(key) {
    return translations[currentLanguage][key] || key;
}

// Añadiendo traducciones que faltaban
translations.es.and = "y";
translations.es.is = "es";
translations.eu.and = "eta";
translations.eu.is = "da";

// Referencias a elementos DOM
let xiInput, fiInput, addDataBtn, clearTableBtn;
let frequencyTableBody, noDataRow, errorMessageDiv;
let barChartBtn, pieChartBtn, chartCanvas, chartPlaceholder;
let meanValueEl, modeValueEl, medianValueEl, rangeValueEl;
let modal, modalDialog, closeModalBtn, modalTitle, modalContent;

// Inicializa las referencias a elementos DOM
function initializeElements() {
    xiInput = document.getElementById('xi');
    fiInput = document.getElementById('fi');
    addDataBtn = document.getElementById('addDataBtn');
    clearTableBtn = document.getElementById('clearTableBtn');

    frequencyTableBody = document.getElementById('frequencyTableBody');
    noDataRow = document.getElementById('no-data-row');
    errorMessageDiv = document.getElementById('error-message');

    barChartBtn = document.getElementById('barChartBtn');
    pieChartBtn = document.getElementById('pieChartBtn');
    chartCanvas = document.getElementById('myChartCanvas').getContext('2d');
    chartPlaceholder = document.getElementById('chart-placeholder');

    meanValueEl = document.getElementById('meanValue');
    modeValueEl = document.getElementById('modeValue');
    medianValueEl = document.getElementById('medianValue');
    rangeValueEl = document.getElementById('rangeValue');

    modal = document.getElementById('explanationModal');
    modalDialog = document.getElementById('modalDialog');
    closeModalBtn = document.getElementById('closeModalBtn');
    modalTitle = document.getElementById('modalTitle');
    modalContent = document.getElementById('modalContent');
}

// Configura los event listeners
function setupEventListeners() {
    addDataBtn.addEventListener('click', handleAddData);
    xiInput.addEventListener('keypress', function(event) { if (event.key === 'Enter') fiInput.focus(); });
    fiInput.addEventListener('keypress', function(event) { if (event.key === 'Enter') handleAddData(); });
    clearTableBtn.addEventListener('click', handleClearTable);

    barChartBtn.addEventListener('click', () => renderChart('bar'));
    pieChartBtn.addEventListener('click', () => renderChart('pie'));
    
    closeModalBtn.onclick = () => {
        modalDialog.classList.add('scale-95', 'opacity-0');
        modalDialog.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }, 300);
    }
    
    modal.onclick = (event) => { 
        if (event.target === modal) {
            modalDialog.classList.add('scale-95', 'opacity-0');
            modalDialog.classList.remove('scale-100', 'opacity-100');
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }
    }
}

// --- Funciones de utilidad ---
function formatNumber(num, maxDecimals = 3) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    const fixedNum = Number(num).toFixed(maxDecimals);
    return String(Number(fixedNum));
}

function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.classList.add('fade-in');
}

function clearError() {
    errorMessageDiv.textContent = '';
}

// --- Lógica principal ---
function handleAddData() {
    clearError();
    const xiVal = xiInput.value.trim();
    const fiVal = parseInt(fiInput.value);

    if (xiVal === "") {
        showError(getTranslation('errorEmptyValue'));
        xiInput.focus();
        return;
    }
    if (isNaN(fiVal) || fiVal <= 0) {
        showError(getTranslation('errorInvalidFreq'));
        fiInput.focus();
        return;
    }

    const existingEntryIndex = data.findIndex(d => String(d.xi) === xiVal);
    if (existingEntryIndex > -1) {
        data[existingEntryIndex].fi += fiVal;
        showError(`${getTranslation('updatedFrequency')}"${xiVal}"${getTranslation('updatedFrequencySuffix')}${data[existingEntryIndex].fi}.`);
    } else {
        data.push({ xi: xiVal, fi: fiVal });
    }
    
    const allNumeric = data.every(d => !isNaN(parseFloat(String(d.xi))));
    if (allNumeric) {
        data.sort((a, b) => parseFloat(String(a.xi)) - parseFloat(String(b.xi)));
    } else {
        data.sort((a, b) => String(a.xi).localeCompare(String(b.xi), currentLanguage === 'eu' ? 'eu' : 'es'));
    }

    renderTable();
    calculateAndDisplayAllStatistics();
    updateChartIfActive();

    xiInput.value = '';
    fiInput.value = '';
    xiInput.focus();
}

function renderTable() {
    frequencyTableBody.innerHTML = ''; 

    if (data.length === 0) {
        if (noDataRow) frequencyTableBody.appendChild(noDataRow);
        if(noDataRow) noDataRow.style.display = 'table-row';
        chartPlaceholder.classList.remove('hidden');
        return;
    }
    
    chartPlaceholder.classList.add('hidden');
    if (noDataRow) noDataRow.style.display = 'none';

    const totalFi = data.reduce((sum, item) => sum + item.fi, 0);

    data.forEach(item => {
        const hi = totalFi > 0 ? item.fi / totalFi : 0;
        const percentage = hi * 100;

        const row = document.createElement('tr');
        row.classList.add('fade-in');
        row.innerHTML = `
            <td>${item.xi}</td>
            <td>${formatNumber(item.fi, 0)}</td>
            <td>${formatNumber(hi)}</td>
            <td>${formatNumber(percentage, 2)}%</td>
        `;
        frequencyTableBody.appendChild(row);
    });
}

function handleClearTable() {
    data = [];
    renderTable();
    resetStatisticsDisplay();
    destroyChartIfExists();
    if (chartPlaceholder) {
        chartPlaceholder.innerHTML = `<span>${getTranslation('chartPlaceholder')}</span>`;
        chartPlaceholder.classList.remove('hidden');
    }
    clearError();
    xiInput.focus();
}

function resetStatisticsDisplay() {
    meanValueEl.textContent = '-';
    modeValueEl.textContent = '-';
    medianValueEl.textContent = '-';
    rangeValueEl.textContent = '-';
}

// --- Cálculos estadísticos ---
function calculateAndDisplayAllStatistics() {
    if (data.length === 0) {
        resetStatisticsDisplay();
        return;
    }

    const allXiAreNumeric = data.every(item => !isNaN(parseFloat(String(item.xi))));

    if (allXiAreNumeric) {
        const numericData = data.map(item => ({ ...item, xi: parseFloat(String(item.xi)), fi: item.fi }));
        numericData.sort((a, b) => a.xi - b.xi); 

        const totalFi = numericData.reduce((sum, item) => sum + item.fi, 0);
        
        const sumXiFi = numericData.reduce((sum, item) => sum + (item.xi * item.fi), 0);
        const mean = totalFi > 0 ? sumXiFi / totalFi : 0;
        meanValueEl.textContent = formatNumber(mean);

        const expandedData = [];
        numericData.forEach(item => {
            for (let i = 0; i < item.fi; i++) {
                expandedData.push(item.xi);
            }
        });
        let median;
        const n = expandedData.length;
        if (n === 0) { median = 0; }
        else if (n % 2 === 1) {
            median = expandedData[Math.floor(n / 2)];
        } else {
            median = (expandedData[n / 2 - 1] + expandedData[n / 2]) / 2;
        }
        medianValueEl.textContent = formatNumber(median);

        if (numericData.length > 0) {
            const xis = numericData.map(item => item.xi);
            const range = Math.max(...xis) - Math.min(...xis);
            rangeValueEl.textContent = formatNumber(range);
        } else {
            rangeValueEl.textContent = '-';
        }
    } else {
        meanValueEl.textContent = getTranslation('notApplicable');
        medianValueEl.textContent = getTranslation('notApplicable');
        rangeValueEl.textContent = getTranslation('notApplicable');
    }

    let maxFi = 0;
    data.forEach(item => { if (item.fi > maxFi) maxFi = item.fi; });
    
    const modes = data.filter(item => item.fi === maxFi && maxFi > 0).map(item => item.xi);
    
    if (modes.length === 0 || data.length === 0) {
        modeValueEl.textContent = '-';
    } else if (modes.length === data.length && data.every(d => d.fi === data[0].fi) && data.length > 1) {
        modeValueEl.textContent = getTranslation('amodal');
    } else if (modes.length > 3) {
        modeValueEl.textContent = `${modes.slice(0,2).join(', ')}${getTranslation('andMore')}`;
    } else {
         modeValueEl.textContent = modes.join(', ');
    }
}

// --- Lógica de gráficos ---
function destroyChartIfExists() {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
}

function updateChartIfActive() {
    if (chartInstance) {
        const currentType = chartInstance.config.type;
        renderChart(currentType);
    }
}

const chartColors = [
    '#4ade80', '#fbbf24', '#60a5fa', '#f472b6', '#818cf8',
    '#2dd4bf', '#a78bfa', '#f87171', '#c084fc', '#34d399' 
];

function renderChart(type) {
    if (data.length === 0) {
        showError(getTranslation('addDataFirst'));
        destroyChartIfExists();
        chartPlaceholder.innerHTML = `<span>${getTranslation('addDataForGraph')}</span>`;
        chartPlaceholder.classList.remove('hidden');
        return;
    }
    clearError();
    destroyChartIfExists();
    chartPlaceholder.classList.add('hidden');

    const labels = data.map(item => String(item.xi));
    const values = data.map(item => item.fi);
    
    const backgroundColors = data.map((_, index) => chartColors[index % chartColors.length]);
    const borderColors = backgroundColors.map(color => color.replace(')', ', 0.8)').replace('rgb', 'rgba'));

    const datasetLabel = currentLanguage === 'eu' ? 'Maiztasun Absolutua (fi)' : 'Frecuencia Absoluta (fi)';

    chartInstance = new Chart(chartCanvas, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: datasetLabel,
                data: values,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1.5,
                hoverOffset: 4
            }]
        },
        options: { 
            responsive: true, maintainAspectRatio: false, animation: { duration: 600, easing: 'easeInOutQuart' },
            plugins: { legend: { position: type === 'pie' || type === 'doughnut' ? 'top' : 'bottom', labels: { font: { size: 12, family: "'Inter', sans-serif" }, color: '#334155'}},
                tooltip: { backgroundColor: 'rgba(0,0,0,0.7)', titleFont: { size: 14, family: "'Inter', sans-serif", weight: 'bold' }, bodyFont: { size: 12, family: "'Inter', sans-serif" }, padding: 10, cornerRadius: 6 }
            },
            scales: type === 'bar' ? { y: { beginAtZero: true, grid: { color: '#e2e8f0' }, ticks: { color: '#475569', font: { size: 12, family: "'Inter', sans-serif" }, stepSize: 1 }},
                x: { grid: { display: false }, ticks: { color: '#475569', font: { size: 12, family: "'Inter', sans-serif" }}}
            } : {}
        }
    });
}

// --- Modal de explicaciones ---
window.showExplanation = function(type) {
    if (data.length === 0 && (type === 'mean' || type === 'median' || type === 'mode' || type === 'range')) {
        showError(`${getTranslation('errorNeedDataForSteps')}"${type}"!`);
        return;
    }
    clearError();

    const translatedType = getTranslation(type);

    const allXiAreNumeric = data.every(item => !isNaN(parseFloat(String(item.xi))));
    let titleText = '';
    let contentHTML = '';
    
    // Preparación de contenido para el modal
    if (!allXiAreNumeric && (type === 'mean' || type === 'median' || type === 'range')) {
        titleText = `Info: ${translatedType}`;
        contentHTML = `<p><strong>${translatedType}</strong>${getTranslation('noCantCalc')}</p><p>${getTranslation('numericDataOnly')}</p>`;
    } else {
        let numericDataForExplanation;
        if (allXiAreNumeric) {
            numericDataForExplanation = data.map(item => ({ xi: parseFloat(String(item.xi)), fi: item.fi }));
            numericDataForExplanation.sort((a, b) => a.xi - b.xi);
        }
        const totalFi = (numericDataForExplanation || data).reduce((sum, item) => sum + item.fi, 0);

        switch(type) {
            case 'mean':
                titleText = getTranslation('meanTitle');
                const sumXiFi = numericDataForExplanation.reduce((sum, item) => sum + (item.xi * item.fi), 0);
                const mean = totalFi > 0 ? sumXiFi / totalFi : 0;
                contentHTML = `<p>${getTranslation('meanIntro')}</p>
                               <ol class="list-decimal list-inside space-y-2 mt-3 pl-4">
                                   <li>${getTranslation('meanStep1')}</li>`;
                numericDataForExplanation.forEach(d => {
                    contentHTML += `<li class="ml-4 text-sm">${formatNumber(d.xi)} &times; ${formatNumber(d.fi,0)} = <strong>${formatNumber(d.xi * d.fi)}</strong></li>`;
                });
                contentHTML += `
                                   <li>${getTranslation('meanStep2')}<br>
                                       <span class="font-semibold text-teal-600">${numericDataForExplanation.map(d => formatNumber(d.xi * d.fi)).join(' + ')} = ${formatNumber(sumXiFi)}</span></li>
                                   <li>${getTranslation('meanStep3')}<br>
                                       <span class="font-semibold text-teal-600">N = ${numericDataForExplanation.map(d => formatNumber(d.fi,0)).join(' + ')} = ${formatNumber(totalFi,0)}</span></li>
                                   <li>${getTranslation('meanStep4')}<br>
                                       <span class="font-semibold text-teal-600">${formatNumber(sumXiFi)} / ${formatNumber(totalFi,0)} = <strong>${formatNumber(mean)}</strong></span></li>
                               </ol>
                               <p class="mt-4 font-bold text-lg">${getTranslation('meanResult')}${formatNumber(mean)}!</p>`;
                break;
            
            case 'mode':
                if (currentLanguage === 'eu') {
                    contentHTML = `<p><strong>Moda</strong> gehien errepikatzen dena da! Maiztasun (fi) altuena duen balioa (edo balioak) da.</p>
                    <ol>
                        <li>Begiratu zure maiztasun taula.</li>
                        <li>Bilatu maiztasun (fi) altuena. Zure datuetan, maiztasun altuena 6 da.</li>
                        <li>Maiztasun hori duten xi balioa (edo balioak) moda dira.</li>
                    </ol>
                    <p class="font-semibold mt-3 mb-2">🎉 Moda berdea da!</p>`;
                } else {
                    contentHTML = `<p><strong>Moda</strong> es el valor que más se repite! Es el valor (o valores) con la frecuencia (fi) más alta.</p>
                    <ol>
                        <li>Observa tu tabla de frecuencias.</li>
                        <li>Busca la frecuencia (fi) más alta. En tus datos, la frecuencia más alta es 6.</li>
                        <li>El valor o valores xi con esa frecuencia son la moda.</li>
                    </ol>
                    <p class="font-semibold mt-3 mb-2">🎉 La moda es el color verde!</p>`;
                }
                break;

            case 'median':
                titleText = getTranslation('medianTitle');
                const expandedData = [];
                numericDataForExplanation.forEach(item => { for (let i = 0; i < item.fi; i++) expandedData.push(item.xi); });
                let median; const n = expandedData.length;
                if (n === 0) median = 0; 
                else if (n % 2 === 1) median = expandedData[Math.floor(n / 2)]; 
                else median = (expandedData[n / 2 - 1] + expandedData[n / 2]) / 2;

                // Generar la lista de números para mostrar
                const numbersList = expandedData.map(x => formatNumber(x));
                
                // En euskera, los números van primero seguidos de "Zerrenda:"
                const listDisplay = currentLanguage === 'eu' 
                    ? `${numbersList.join(', ')} ${getTranslation('listPrefix')}`
                    : `${getTranslation('listPrefix')} ${numbersList.join(', ')}`;
                
                contentHTML = `<p>${getTranslation('medianIntro')}</p>
                               <ol class="list-decimal list-inside space-y-2 mt-3 pl-4">
                                   <li>${getTranslation('medianStep1')}<br>
                                       <span class="text-xs block max-h-20 overflow-y-auto bg-slate-100 p-1 rounded">${listDisplay}</span></li>
                                   <li>${getTranslation('medianStep2')}<br>
                                       <span class="font-semibold text-teal-600">N = ${formatNumber(n,0)}</span></li>
                                   <li>${getTranslation('medianStep3')}</li>`;
                if (n>0 && n % 2 === 1) {
                    const middlePos = Math.floor(n / 2) + 1;
                    contentHTML += `
                                   <li class="ml-4">${getTranslation('medianOdd')}${formatNumber(n,0)}${getTranslation('medianOddMid')}${middlePos}.</strong></li>
                                   <li class="ml-4">${getTranslation('medianOddValue')}${formatNumber(expandedData[middlePos-1])}</strong>.</li>`;
                } else if (n > 0) {
                    const pos1 = n / 2;
                    const pos2 = n / 2 + 1;
                    const val1 = expandedData[pos1 - 1];
                    const val2 = expandedData[pos2 - 1];
                    contentHTML += `
                                   <li class="ml-4">${getTranslation('medianEven')}${formatNumber(n,0)}${getTranslation('medianEvenMid')}${pos1}.</strong> ${getTranslation('and')} <strong>${pos2}.</strong></li>
                                   <li class="ml-4">${getTranslation('medianEvenPos1')}${pos1} ${getTranslation('is')} <strong>${formatNumber(val1)}</strong>.</li>
                                   <li class="ml-4">${getTranslation('medianEvenPos1')}${pos2} ${getTranslation('is')} <strong>${formatNumber(val2)}</strong>.</li>
                                   <li class="ml-4">${getTranslation('medianEvenPos2')}${formatNumber(val1)} + ${formatNumber(val2)}) / 2 = <strong>${formatNumber((val1 + val2) / 2)}</strong>.</li>`;
                } else {
                     contentHTML += `<li class="ml-4">${getTranslation('medianNoData')}</li>`;
                }
                contentHTML += `</ol>
                               <p class="mt-4 font-bold text-lg">${getTranslation('medianResult')}${formatNumber(median)}!</p>`;
                break;

            case 'range':
                titleText = getTranslation('rangeTitle');
                const xis = numericDataForExplanation.map(item => item.xi);
                const minXi = xis[0];
                const maxXi = xis[xis.length - 1];
                const range = numericDataForExplanation.length > 0 ? maxXi - minXi : 0;
                contentHTML = `<p>${getTranslation('rangeIntro')}</p>
                               <ol class="list-decimal list-inside space-y-2 mt-3 pl-4">
                                   <li>${getTranslation('rangeStep1')}${formatNumber(maxXi)}</strong>.</li>
                                   <li>${getTranslation('rangeStep2')}${formatNumber(minXi)}</strong>.</li>
                                   <li>${getTranslation('rangeStep3')}<br>
                                       <span class="font-semibold text-teal-600">${formatNumber(maxXi)} - ${formatNumber(minXi)} = <strong>${formatNumber(range)}</strong></span></li>
                               </ol>
                               <p class="mt-4 font-bold text-lg">${getTranslation('rangeResult')}${formatNumber(range)}!</p>`;
                break;
            default: contentHTML = `<p>${getTranslation('errorExplanation')}</p>`;
        }
    }
    
    // Actualizar el título del modal usando el sistema de traducciones
    // Para el caso especial de 'mode', usar un título específico con emoji
    if (type === 'mode') {
        modalTitle.innerHTML = `<span data-lang-es="¿Cómo encontrar la moda? 😎" data-lang-eu="Nola Aurkitu Moda? 😎">${currentLanguage === 'eu' ? 'Nola Aurkitu Moda? 😎' : '¿Cómo encontrar la moda? 😎'}</span>`;
    } else {
        // Usar el título proporcionado por las traducciones
        modalTitle.innerHTML = `<span data-lang-es="${titleText}" data-lang-eu="${titleText}">${titleText}</span>`;
    }
    
    // Asegurarse de que los textos se actualicen según el idioma actual
    updateUITexts();
    
    // Actualizar el contenido del modal
    modalContent.innerHTML = contentHTML;
    
    // Asegurar que el modal se muestre correctamente con la animación
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    setTimeout(() => {
        modalDialog.classList.remove('scale-95', 'opacity-0');
        modalDialog.classList.add('scale-100', 'opacity-100');
    }, 10);
}