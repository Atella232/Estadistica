// ===============================================
// ======== INICIALIZACIÓN UI COMPONENTS =========
// ===============================================

/**
 * Inicializa la funcionalidad de pestañas (tabs).
 * @param {NodeListOf<Element>} tabLinks - Los elementos <a> que actúan como enlaces de pestaña.
 * @param {NodeListOf<Element>} tabPanes - Los elementos <div> que actúan como paneles de contenido.
 */
function initTabs(tabLinks, tabPanes) {
    
    // Imprimir detalles de los enlaces de pestaña
    tabLinks.forEach((link, index) => {
            href: link.getAttribute('href'),
            text: link.textContent,
            isActive: link.classList.contains('active')
        });
    });
    
    // Imprimir detalles de los paneles de pestaña
    tabPanes.forEach((pane, index) => {
            id: pane.id,
            isActive: pane.classList.contains('active')
        });
    });

    // Verifica si los elementos necesarios existen
    if (!tabLinks || tabLinks.length === 0 || !tabPanes || tabPanes.length === 0) {
        console.warn("UITABS: Elementos de pestañas no encontrados o vacíos en initTabs. Saliendo.");
        return;
    }

    tabLinks.forEach((link, index) => {
        link.addEventListener('click', (event) => {

            event.preventDefault(); // Previene el comportamiento por defecto
            const targetId = link.getAttribute('href');

            if (!targetId || !targetId.startsWith('#')) {
                console.error(`UITABS: El enlace ${index} no tiene un href válido: ${targetId}`);
                return;
            }

            // 1. Desactivar todos los enlaces y paneles
            tabLinks.forEach((lnk, i) => {
                lnk.classList.remove('active');
            });
            tabPanes.forEach((pane, i) => {
                pane.classList.remove('active');
            });

            // 2. Activar el enlace clicado
            link.classList.add('active');

            // 3. Activar el panel correspondiente
            try {
                const targetPane = document.querySelector(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                } else {
                    console.error(`UITABS: Panel no encontrado con el selector: ${targetId}`);
                }
            } catch (e) {
                console.error(`UITABS: Error buscando panel con selector "${targetId}": `, e);
            }
        });
    });

    // Asegurar estado inicial (lógica revisada para claridad)
    let activeLinkInHTML = null;
    tabLinks.forEach(link => {
        if (link.classList.contains('active')) {
            activeLinkInHTML = link;
        }
    });

    if (activeLinkInHTML) {
        // Asegurar que el panel correspondiente está activo
        const targetId = activeLinkInHTML.getAttribute('href');
        if (targetId) {
            try {
                 const targetPane = document.querySelector(targetId);
                 if (targetPane) {
                     // Quitar active de otros paneles por si acaso hubiera más de uno activo en HTML
                     tabPanes.forEach(pane => { if (pane !== targetPane) pane.classList.remove('active'); });
                     targetPane.classList.add('active'); // Asegurar que este está activo
                 } else {
                     console.error(`UITABS: Panel para enlace activo inicial ${targetId} no encontrado.`);
                 }
            } catch(e) {
                 console.error(`UITABS: Error buscando panel para enlace activo inicial ${targetId}: `, e);
            }
        } else {
             console.error("UITABS: Enlace activo inicial no tiene href válido.");
        }
    } else if (tabLinks.length > 0) {
        // Si no hay ninguno activo en HTML, activar el primero
        tabLinks[0].classList.add('active');
        const targetId = tabLinks[0].getAttribute('href');
         if (targetId) {
             try {
                 const targetPane = document.querySelector(targetId);
                 if (targetPane) {
                     tabPanes.forEach(pane => pane.classList.remove('active')); // Desactivar todos los demás
                     targetPane.classList.add('active');
                 } else {
                      console.error(`UITABS: Panel inicial por defecto ${targetId} no encontrado.`);
                 }
             } catch(e) {
                 console.error(`UITABS: Error buscando panel inicial por defecto ${targetId}: `, e);
             }
         } else {
             console.error("UITABS: El primer enlace no tiene href válido.");
         }
    } else {
    }
}


// --- COPIA AQUÍ EL RESTO DE FUNCIONES DE uiComponents.js ---
// initAccordion, initCarousel, initHints
// (Asegúrate de que el resto del archivo sigue igual que antes)

/**
 * Inicializa la funcionalidad de acordeón.
 * @param {NodeListOf<Element>} accordionItems - Los elementos que contienen cada par header/content.
 */
function initAccordion(accordionItems) {
    if (!accordionItems || accordionItems.length === 0) return;

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (header && content) {
            // Estado inicial basado en aria-expanded
            const isInitiallyExpanded = header.getAttribute('aria-expanded') === 'true';
             // Aplicar estilos iniciales basados en si está expandido o no
            if (isInitiallyExpanded) {
                 content.style.maxHeight = content.scrollHeight + "px";
                 content.style.paddingTop = '1rem';
                 content.style.paddingBottom = '1rem';
            } else {
                 content.style.maxHeight = null; // O '0px' si se prefiere explícito
                 content.style.paddingTop = '0';
                 content.style.paddingBottom = '0';
                 // Asegurar opacidad y visibilidad si se usan en CSS
                 content.style.opacity = '0';
                 content.style.visibility = 'hidden';
            }

            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);

                if (!isExpanded) {
                    // Expandir: preparar estilos antes de medir y animar
                    content.style.paddingTop = '1rem';
                    content.style.paddingBottom = '1rem';
                    content.style.visibility = 'visible'; // Hacer visible
                    content.style.opacity = '1'; // Hacer opaco
                    // Usar requestAnimationFrame o setTimeout para asegurar que los estilos se apliquen antes de medir scrollHeight
                    requestAnimationFrame(() => {
                        content.style.maxHeight = content.scrollHeight + "px";
                    });
                } else {
                    // Colapsar: simplemente quitar max-height, la transición CSS hará el resto
                    content.style.maxHeight = null; // O '0px'
                     // Opcional: resetear padding/visibilidad/opacidad al finalizar la transición (escucha 'transitionend')
                     content.addEventListener('transitionend', function handleTransitionEnd() {
                         // Solo resetear si sigue colapsado (evita problemas con clics rápidos)
                         if (header.getAttribute('aria-expanded') === 'false') {
                              content.style.paddingTop = '0';
                              content.style.paddingBottom = '0';
                              content.style.opacity = '0';
                              content.style.visibility = 'hidden';
                         }
                         // Eliminar el listener para que no se ejecute múltiples veces
                         content.removeEventListener('transitionend', handleTransitionEnd);
                     });
                }
            });
        } else {
             console.warn("Item de acordeón no contiene .accordion-header o .accordion-content", item);
        }
    });
}

/**
 * Inicializa la funcionalidad de carrusel.
 * @param {Element} carouselWrapper - El elemento que contiene los slides y se transforma.
 */
function initCarousel(carouselWrapper) {
    // carouselWrapper ya se verifica en main.js antes de llamar
    const slides = carouselWrapper.querySelectorAll('.carousel-slide');
    // Buscar botones relativos al contenedor del wrapper (podría ser .carousel-container)
    const container = carouselWrapper.closest('.carousel-container');
    if (!container) {
        console.error("No se encontró .carousel-container para el carrusel.");
        return;
    }
    const prevButton = container.querySelector('.carousel-button.prev');
    const nextButton = container.querySelector('.carousel-button.next');
    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
        if (!carouselWrapper) return;
        const offset = -currentIndex * 100;
        carouselWrapper.style.transform = `translateX(${offset}%)`;
        if(prevButton) prevButton.disabled = currentIndex === 0;
        if(nextButton) nextButton.disabled = currentIndex >= totalSlides - 1;
    }

    if (prevButton && nextButton && totalSlides > 1) {
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) { currentIndex--; updateCarousel(); }
        });
        nextButton.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) { currentIndex++; updateCarousel(); }
        });
        updateCarousel(); // Estado inicial
    } else {
        // Ocultar botones si hay 1 o 0 slides
        if(prevButton) prevButton.style.display = 'none';
        if(nextButton) nextButton.style.display = 'none';
    }
}

/**
 * Inicializa la funcionalidad de mostrar/ocultar pistas.
 * @param {NodeListOf<Element>} hintToggles - Los botones que activan las pistas.
 * @param {object} langUtils - El objeto devuelto por initLanguage para actualizar textos.
 */
function initHints(hintToggles, langUtils) {
     // hintToggles y langUtils ya se verifican en main.js
    if (!langUtils || typeof langUtils.updateHintButtonTexts !== 'function' || typeof langUtils.getCurrentLang !== 'function') {
        console.error("langUtils no está disponible o incompleto para initHints.");
        return;
    }

    hintToggles.forEach(button => {
         const targetId = button.getAttribute('data-target');
         const hintContent = document.getElementById(targetId);
         const span = button.querySelector('span'); // El span que contiene el texto del botón

         if(hintContent && span){
             // Estado inicial desde HTML/CSS
             const isInitiallyVisible = hintContent.classList.contains('visible');
             button.setAttribute('aria-expanded', isInitiallyVisible);
              if (isInitiallyVisible) {
                 button.classList.add('open');
                 hintContent.style.maxHeight = hintContent.scrollHeight + 'px';
                 hintContent.style.visibility = 'visible';
                 hintContent.style.opacity = '1';
                 hintContent.style.paddingTop = '0.8rem';
                 hintContent.style.paddingBottom = '0.8rem';
                 hintContent.style.marginTop = '0.5rem';
             } else {
                 hintContent.style.maxHeight = null; // O '0px'
                 hintContent.style.visibility = 'hidden';
                 hintContent.style.opacity = '0';
                 hintContent.style.paddingTop = '0';
                 hintContent.style.paddingBottom = '0';
                 hintContent.style.marginTop = '0';
             }

             button.addEventListener('click', () => {
                const isVisible = hintContent.classList.contains('visible');
                button.setAttribute('aria-expanded', !isVisible);

                if (isVisible) { // Colapsar
                    hintContent.classList.remove('visible');
                    button.classList.remove('open');
                    hintContent.style.maxHeight = null;
                    hintContent.style.opacity = '0';
                     // Resetear padding/margin/visibility DESPUÉS de la transición
                    hintContent.addEventListener('transitionend', function handleHintCollapseEnd() {
                         if (!hintContent.classList.contains('visible')) { // Verificar estado actual
                              hintContent.style.paddingTop = '0';
                              hintContent.style.paddingBottom = '0';
                              hintContent.style.marginTop = '0';
                              hintContent.style.visibility = 'hidden';
                         }
                         hintContent.removeEventListener('transitionend', handleHintCollapseEnd);
                    });

                } else { // Expandir
                    hintContent.classList.add('visible');
                    button.classList.add('open');
                    // Aplicar padding/margin y visibilidad ANTES de medir scrollHeight
                    hintContent.style.visibility = 'visible';
                    hintContent.style.paddingTop = '0.8rem';
                    hintContent.style.paddingBottom = '0.8rem';
                    hintContent.style.marginTop = '0.5rem';
                    hintContent.style.opacity = '1';
                    // Medir y aplicar max-height
                     requestAnimationFrame(() => {
                        hintContent.style.maxHeight = hintContent.scrollHeight + "px";
                    });
                }
                 // Actualizar texto del botón inmediatamente después del clic
                 langUtils.updateHintButtonTexts(langUtils.getCurrentLang());
            });
         } else {
              console.warn("Botón de pista o contenido no encontrado:", button, targetId);
         }
    });
     // Asegurar textos correctos al inicio
     langUtils.updateHintButtonTexts(langUtils.getCurrentLang());
}