document.addEventListener('DOMContentLoaded', () => {
    console.log("MAIN.JS: DOMContentLoaded event fired.");

    // --- Selectores Comunes ---
    const body = document.body;
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const translatableElements = document.querySelectorAll('[data-lang-es][data-lang-eu]'); // Query inicial, language.js requery
    const hintToggles = document.querySelectorAll('.toggle-hint-button');
    const tabLinks = document.querySelectorAll('.tabs-nav .tab-link');
    const tabPanes = document.querySelectorAll('.tabs-content .tab-pane');
    const accordionItems = document.querySelectorAll('.accordion-item');
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    // Selectores para Simulador (si existen en la página)
    const sampleSizeInput = document.getElementById('sample-size-input');
    const takeSampleButton = document.getElementById('take-sample-button');
    const populationDisplay = document.getElementById('population-display');
    const sampleDisplay = document.getElementById('sample-display');
    const sampleInfo = document.getElementById('sample-info');
    const populationSizeInput = document.getElementById('population-size-input');
    const populationSizeDisplay = document.getElementById('population-size-display');
    // Selectores para Quiz (si existen en la página)
    const quizForm = document.getElementById('quiz-form');
    const quizCheckButtonMC = document.getElementById('quiz-check-button-mc');
    const quizFeedbackMC = document.getElementById('quiz-feedback-mc');
    // Selector para el nuevo Clasificador de Variables
    const variableClassifierTool = document.getElementById('variable-classifier-tool'); // <- NUEVO

    console.log("MAIN.JS: Selectores comunes definidos.");

    // --- Inicializaciones ---
    console.log("MAIN.JS: Iniciando inicializaciones...");

    // 1. Tema
    if (typeof initTheme === 'function') {
        console.log("MAIN.JS: Intentando inicializar Tema...");
        initTheme(body, themeToggle);
        console.log("MAIN.JS: Inicialización de Tema completada.");
    } else {
        console.error("MAIN.JS: Función initTheme no encontrada.");
    }

    // 2. Idioma (NECESARIO para otros módulos)
    let langUtils = null;
    if (typeof initLanguage === 'function') {
        console.log("MAIN.JS: Intentando inicializar Idioma...");
        // Pasar NodeList inicial, aunque language.js lo re-evaluará
        langUtils = initLanguage(htmlElement, translatableElements, langToggle, hintToggles);
        console.log("MAIN.JS: Inicialización de Idioma completada.");
    } else {
        console.error("MAIN.JS: Función initLanguage no encontrada.");
        // Si el idioma falla, muchas otras cosas podrían fallar o no traducirse
    }

    // 3. Componentes UI (Dependen de sus selectores)
    console.log("MAIN.JS: Revisando inicialización de Componentes UI...");
    // Pestañas
    if (typeof initTabs === 'function') {
        if (tabLinks.length > 0 && tabPanes.length > 0) {
            console.log("MAIN.JS: Llamando a initTabs...");
            initTabs(tabLinks, tabPanes);
            console.log("MAIN.JS: Llamada a initTabs completada.");
        } else {
            console.log("MAIN.JS: No se encontraron elementos de pestañas, saltando initTabs.");
        }
    } else {
        console.error("MAIN.JS: Función initTabs no encontrada.");
    }
    // Acordeón
    if (typeof initAccordion === 'function') {
        if (accordionItems.length > 0) {
            console.log("MAIN.JS: Llamando a initAccordion...");
            initAccordion(accordionItems);
            console.log("MAIN.JS: Llamada a initAccordion completada.");
        } else {
             console.log("MAIN.JS: No se encontraron items de acordeón, saltando initAccordion.");
        }
    } else {
         console.error("MAIN.JS: Función initAccordion no encontrada.");
    }
    // Carrusel
    if (typeof initCarousel === 'function') {
         if (carouselWrapper) {
            console.log("MAIN.JS: Llamando a initCarousel...");
            initCarousel(carouselWrapper);
            console.log("MAIN.JS: Llamada a initCarousel completada.");
         } else {
             console.log("MAIN.JS: No se encontró wrapper de carrusel, saltando initCarousel.");
         }
    } else {
         console.error("MAIN.JS: Función initCarousel no encontrada.");
    }
    // Pistas (Depende de langUtils)
    if (typeof initHints === 'function') {
        if (hintToggles.length > 0 && langUtils) {
             console.log("MAIN.JS: Llamando a initHints...");
             initHints(hintToggles, langUtils);
             console.log("MAIN.JS: Llamada a initHints completada.");
        } else if (hintToggles.length === 0) {
             console.log("MAIN.JS: No se encontraron botones de pista, saltando initHints.");
        } else if (!langUtils) {
             console.warn("MAIN.JS: langUtils no disponible, saltando initHints.");
        }
    } else {
        console.error("MAIN.JS: Función initHints no encontrada.");
    }

    // 4. Herramientas Interactivas (Dependen de sus selectores y langUtils)
    console.log("MAIN.JS: Revisando inicialización de Herramientas Interactivas...");

    // Simulador de Muestreo
    if (typeof initSamplingSimulator === 'function') {
        // Verificar si todos los elementos necesarios existen ANTES de llamar
        if (sampleSizeInput && takeSampleButton && populationDisplay && sampleDisplay && sampleInfo && langUtils && populationSizeInput && populationSizeDisplay) {
             console.log("MAIN.JS: Llamando a initSamplingSimulator...");
             initSamplingSimulator(sampleSizeInput, takeSampleButton, populationDisplay, sampleDisplay, sampleInfo, langUtils, populationSizeInput, populationSizeDisplay);
             console.log("MAIN.JS: Llamada a initSamplingSimulator completada.");
        } else {
             // No es un error si la página no tiene el simulador
             console.log("MAIN.JS: No se encontraron todos los elementos del simulador, saltando initSamplingSimulator.");
        }
    } else {
         console.warn("MAIN.JS: Función initSamplingSimulator no encontrada (puede ser normal si no está en esta página).");
    }

    // Quiz Opción Múltiple
    if (typeof initQuiz === 'function') {
        // Verificar si todos los elementos necesarios existen ANTES de llamar
         if (quizForm && quizCheckButtonMC && quizFeedbackMC && langUtils) {
            console.log("MAIN.JS: Llamando a initQuiz...");
            initQuiz(quizForm, quizCheckButtonMC, quizFeedbackMC, langUtils);
            console.log("MAIN.JS: Llamada a initQuiz completada.");
         } else {
            // No es un error si la página no tiene el quiz
             console.log("MAIN.JS: No se encontraron todos los elementos del quiz, saltando initQuiz.");
         }
    } else {
         console.warn("MAIN.JS: Función initQuiz no encontrada (puede ser normal si no está en esta página).");
    }

    // Clasificador de Variables (NUEVO)
    if (typeof initVariableClassifier === 'function') {
        if (variableClassifierTool && langUtils) { // Comprobar si el contenedor principal existe
            console.log("MAIN.JS: Llamando a initVariableClassifier...");
            initVariableClassifier(langUtils); // Pasar langUtils
            console.log("MAIN.JS: Llamada a initVariableClassifier completada.");
        } else if (!variableClassifierTool) {
            console.log("MAIN.JS: No se encontró el contenedor del clasificador de variables, saltando initVariableClassifier.");
        } else if (!langUtils) {
            console.warn("MAIN.JS: langUtils no disponible, saltando initVariableClassifier.");
        }
    } else {
        console.warn("MAIN.JS: Función initVariableClassifier no encontrada (puede ser normal si no está en esta página).");
    }


    console.log("MAIN.JS: Todas las inicializaciones posibles intentadas.");

}); // FIN DEL DOMContentLoaded