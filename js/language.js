function initLanguage(htmlElement, translatableElementsNodeList, langToggle, hintToggles) {
    // NOTE: translatableElementsNodeList passed here is the initial list,
    // but applyLanguage will re-query the DOM each time.

    let currentLang = localStorage.getItem('language') || 'es';

    // --- Función para actualizar textos de botones de pista ---
    function updateHintButtonTexts(lang) {
        if (!hintToggles) return;
        hintToggles.forEach(button => {
            const span = button.querySelector('span');
            if (!span) return;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            let text;
            let defaultText = ''; // Texto por defecto si no hay traducción específica

            if (isExpanded) {
                text = lang === 'es' ? span.dataset.langEsHide : span.dataset.langEuHide;
                defaultText = lang === 'es' ? 'Ocultar Pista/Razón' : 'Pista/Arrazoia Ezkutatu'; // Valor por defecto si falta data-*
            } else {
                text = lang === 'es' ? span.dataset.langEs : span.dataset.langEu;
                 defaultText = lang === 'es' ? 'Mostrar Pista/Razón' : 'Pista/Arrazoia Erakutsi'; // Valor por defecto
            }
             // Usar el texto del dataset si existe, si no, el por defecto
             span.textContent = text || defaultText;
        });
    }

    // --- Función para actualizar placeholders ---
    function updatePlaceholders(lang) {
         const inputs = document.querySelectorAll('input[data-placeholder-es], textarea[data-placeholder-es]'); // Incluir textareas
         inputs.forEach(input => {
            const placeholderText = lang === 'es' ? input.dataset.placeholderEs : input.dataset.placeholderEu;
             if(placeholderText !== undefined) input.placeholder = placeholderText; // Usar undefined check
         });
    }


    // --- Función Principal para Aplicar Idioma ---
    const applyLanguage = (lang) => {
        currentLang = lang; // Actualiza la variable local

        // *** Re-buscar TODOS los elementos traducibles CADA VEZ ***
        const elementsToTranslate = document.querySelectorAll('[data-lang-es], [data-lang-eu]'); // Buscar por cualquiera de los dos

        if (elementsToTranslate) {
            elementsToTranslate.forEach(el => {
                 // Priorizar data-lang-xx específico si existe, si no, intentar data-lang-es como fallback
                 const text = (lang === 'eu' && el.dataset.langEu !== undefined) ? el.dataset.langEu : el.dataset.langEs;

                if (text !== undefined) {
                    // Manejo especial para botones y spans dentro de botones (para no borrar iconos)
                    if (el.tagName === 'BUTTON' && el.id === 'theme-toggle') {
                       // No hacer nada con el botón de tema (solo icono)
                    } else if (el.tagName === 'BUTTON' && (el.id === 'lang-toggle' || el.closest('.toggle-hint-button'))) {
                         // Botón lang-toggle o hint-toggle: Actualizar texto preservando icono si lo hay
                         let currentIconHTML = '';
                         const iconElement = el.querySelector('i.fas, i.fa-solid');
                         if (iconElement) {
                             currentIconHTML = iconElement.outerHTML + ' ';
                         }
                          // Para botones hint, el texto lo gestiona updateHintButtonTexts
                         if (!el.closest('.toggle-hint-button')) {
                            el.innerHTML = currentIconHTML + text;
                         }
                    } else if (el.tagName === 'SPAN' && el.closest('.toggle-hint-button')) {
                         // Texto del SPAN dentro de hint-toggle button se actualiza en updateHintButtonTexts
                    } else if (el.tagName === 'INPUT' && el.type === 'submit' || el.tagName === 'BUTTON') {
                         // Otros botones o inputs de tipo submit
                          el.value = text; // Para inputs submit
                          if(el.tagName === 'BUTTON') el.textContent = text; // Para botones normales sin icono
                    }
                    // Para placeholders de inputs/textareas (se gestiona en updatePlaceholders)
                    else if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.hasAttribute('placeholder')) {
                        // Se actualiza en updatePlaceholders
                    }
                    // Para el resto de elementos (p, h1-h4, li, spans fuera de botones, etc.)
                    else {
                        // Usar innerHTML permite etiquetas como <b><i> y $...$
                        el.innerHTML = text;
                    }
                }
            });
        }

        // Actualiza el texto del propio botón de cambio de idioma
        if(langToggle){
            const buttonText = (lang === 'es') ? langToggle.dataset.langEs : langToggle.dataset.langEu;
            if(buttonText !== undefined) {
                 let iconHTML = '';
                 const icon = langToggle.querySelector('i.fas, i.fa-solid');
                 if (icon) {
                     iconHTML = icon.outerHTML + ' ';
                 }
                 langToggle.innerHTML = iconHTML + buttonText;
            }
        }

        // Actualiza placeholders y textos de botones hint
        updatePlaceholders(lang);
        updateHintButtonTexts(lang);

        // Actualiza el atributo lang del HTML
        if (htmlElement) {
            htmlElement.lang = lang;
        }

        // Guarda la preferencia
        localStorage.setItem('language', lang);

        // *** ¡IMPORTANTE! Indicar a MathJax que vuelva a procesar la página ***
        if (typeof MathJax !== 'undefined' && typeof MathJax.typesetPromise === 'function') {
            // console.log("LANGUAGE.JS: Calling MathJax.typesetPromise() after language change.");
            // Envolvemos en Promise para asegurar que se ejecuta después del renderizado del DOM si hay cambios asíncronos
            Promise.resolve().then(() => {
                MathJax.typesetPromise([document.body]) // Podemos limitar al body si es más rápido
                    .catch((err) => console.error('MathJax typesetting failed:', err));
            });
        } else {
             // console.warn("LANGUAGE.JS: MathJax or typesetPromise not available to re-render math.");
        }
    };


    // --- Inicialización y Event Listener Idioma ---
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const newLang = currentLang === 'es' ? 'eu' : 'es';
            applyLanguage(newLang);
        });
    }

    // Aplica idioma inicial al cargar la página
    // Esperar un poco si MathJax tarda en cargar inicialmente
    // setTimeout(() => applyLanguage(currentLang), 100); // O usar un listener de carga de MathJax si es posible
    applyLanguage(currentLang); // Intentar aplicar directamente

    // Devolver funciones útiles (si otros módulos las necesitan)
    // Hacemos accesible globalmente langUtils para que otros scripts puedan usarlo (simplificación)
     window.langUtils = {
         applyLanguage: applyLanguage,
         getCurrentLang: () => currentLang,
         updateHintButtonTexts: updateHintButtonTexts
     };

    //return window.langUtils; // Devolverlo también si se importa como módulo
}

// Exponer la función de inicialización si se usa como módulo simple
// (Asegúrate de que solo se llame una vez, probablemente desde main.js)
// export { initLanguage }; // Descomentar si usas módulos ES6