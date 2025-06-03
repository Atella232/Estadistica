// ===============================================
// ====== INICIALIZACIÓN HERRAMIENTAS INTERAC. =====
// ===============================================

function initSamplingSimulator(sampleSizeInput, takeSampleButton, populationDisplay, sampleDisplay, sampleInfo, langUtils, populationSizeInput, populationSizeDisplay) {
    if (!takeSampleButton || !sampleSizeInput || !populationDisplay || !sampleDisplay || !sampleInfo || !langUtils || !populationSizeInput || !populationSizeDisplay) {
        // console.warn("Sampling simulator elements not found or langUtils missing.");
        return;
    }

    // Update population size display when slider changes
    populationSizeInput.addEventListener('input', () => { 
        const populationSize = parseInt(populationSizeInput.value); 
        populationSizeDisplay.textContent = populationSize; 
        createConceptualPopulation(populationSize);
      });
      let population = [];
      let conceptualPopulationSize = 100; // Tamaño inicial para los porcentajes

    function createConceptualPopulation(size = 100) { 
        population = []; 
        const MAX_POPULATION_SIZE = 400;
        const MIN_POPULATION_SIZE = 100;
        const BLUE_RATIO = 0.6; // 60% blue
        size = Math.min(Math.max(size, MIN_POPULATION_SIZE), MAX_POPULATION_SIZE);
        const ORANGE_RATIO = 0.4; // 40% orange
        
        // Usar "let" para permitir ajustes posteriores si el redondeo no suma
        // exactamente el tamaño deseado
        let blueCount = Math.round(size * BLUE_RATIO);
        let orangeCount = size - blueCount;
        
        // Ajustar para asegurar que la suma sea exactamente conceptualPopulationSize
        const totalCount = blueCount + orangeCount;
        if (totalCount !== size) {
            if (blueCount < orangeCount) {
                blueCount += size - totalCount;
            } else {
                orangeCount += size - totalCount;
            }
        }
        
        for (let i = 0; i < blueCount; i++) population.push('blue');
        for (let i = 0; i < orangeCount; i++) population.push('orange');

        // Mostrar población inicial
        displayDots(populationDisplay, population);
    }

    function displayDots(container, dotsArray) {
        if (!container) return;
        container.innerHTML = ''; // Limpiar contenedor
        
        // Mostrar todos los dots
        dotsArray.forEach(color => {
            const dot = document.createElement('div');
            dot.classList.add('dot', color);
            container.appendChild(dot);
        });
        
        // Actualizar contador visual si es el de población
        if (container.id === 'population-display') {
             const populationCounter = container.previousElementSibling; // El <strong>
             if (populationCounter) {
                 const currentLang = langUtils.getCurrentLang();
                 const baseText = currentLang === 'es' ? 'Población' : 'Populazioa';
                 populationCounter.textContent = `${baseText} (${conceptualPopulationSize})`; // Muestra tamaño actual
             }
        }
    }

    // Initialize with default conceptual population
    createConceptualPopulation();

    // Event listener para sacar muestra
    takeSampleButton.addEventListener('click', () => {
        const sampleSize = parseInt(sampleSizeInput.value);
        const currentLang = langUtils.getCurrentLang(); // Obtener idioma actual

        // Validación
        if (isNaN(sampleSize) || sampleSize < 1 || sampleSize > parseInt(populationSizeInput.value)) {
             const errorMsg = currentLang === 'es' ? `Introduce un tamaño de muestra válido (1-${parseInt(populationSizeInput.value)})` : `Sartu lagin-tamaina baliogarria (1-${parseInt(populationSizeInput.value)})`;
             alert(errorMsg);
             return;
        }

        // Tomar muestra
        const shuffledPopulation = [...population].sort(() => 0.5 - Math.random());
        const currentSample = shuffledPopulation.slice(0, sampleSize);
        displayDots(sampleDisplay, currentSample); // Muestra la muestra real

        // Calcular y mostrar resultados
        const blueInSample = currentSample.filter(dot => dot === 'blue').length;
        const orangeInSample = sampleSize - blueInSample;
        const bluePercent = (sampleSize > 0) ? ((blueInSample / sampleSize) * 100).toFixed(1) : 0;
        const orangePercent = (sampleSize > 0) ? ((orangeInSample / sampleSize) * 100).toFixed(1) : 0;

        // Textos traducidos
        const resultTextES = `Muestra (${sampleSize}): ${bluePercent}% 🔵, ${orangePercent}% 🟠`;
        const resultTextEU = `Lagina (${sampleSize}): %${bluePercent} 🔵, %${orangePercent} 🟠`;

        sampleInfo.textContent = (currentLang === 'es' ? resultTextES : resultTextEU);
    });
}


function initQuiz(quizForm, quizCheckButtonMC, quizFeedbackMC, langUtils) {
     if (!quizForm || !quizCheckButtonMC || !quizFeedbackMC || !langUtils) {
        // console.warn("Quiz elements not found or langUtils missing.");
        return;
     }

    const correctAnswersMC = {
        poblacion: "500 alumnos",
        muestra: "50 alumnos",
        individuo: "1 alumno"
    };

    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const currentLang = langUtils.getCurrentLang(); // Obtener idioma actual

        const selectedPoblacion = quizForm.querySelector('input[name="quiz-poblacion"]:checked');
        const selectedMuestra = quizForm.querySelector('input[name="quiz-muestra"]:checked');
        const selectedIndividuo = quizForm.querySelector('input[name="quiz-individuo"]:checked');

        const userPoblacionValue = selectedPoblacion ? selectedPoblacion.value : null;
        const userMuestraValue = selectedMuestra ? selectedMuestra.value : null;
        const userIndividuoValue = selectedIndividuo ? selectedIndividuo.value : null;

        const isPoblacionCorrect = userPoblacionValue === correctAnswersMC.poblacion;
        const isMuestraCorrect = userMuestraValue === correctAnswersMC.muestra;
        const isIndividuoCorrect = userIndividuoValue === correctAnswersMC.individuo;

        let feedbackHTML = '';

        if (isPoblacionCorrect && isMuestraCorrect && isIndividuoCorrect) {
            quizFeedbackMC.className = 'quiz-feedback correct';
            feedbackHTML = `<span data-lang-es="¡Todo Correcto! Muy bien." data-lang-eu="Dena Zuzena! Oso ondo.">¡Todo Correcto! Muy bien.</span>`;
        } else {
            quizFeedbackMC.className = 'quiz-feedback incorrect';
            let feedbackTextES = "Hay errores. Revisa:<br>";
            let feedbackTextEU = "Akatsak daude. Berrikusi:<br>";
            if (!userPoblacionValue) {
                feedbackTextES += "- No has respondido la pregunta de Población.<br>";
                feedbackTextEU += "- Ez duzu Populazioaren galdera erantzun.<br>";
            } else if (!isPoblacionCorrect) {
                feedbackTextES += "- La respuesta de Población no es correcta.<br>";
                feedbackTextEU += "- Populazioaren erantzuna ez da zuzena.<br>";
            }
            if (!userMuestraValue) {
                feedbackTextES += "- No has respondido la pregunta de Muestra.<br>";
                feedbackTextEU += "- Ez duzu Laginaren galdera erantzun.<br>";
            } else if (!isMuestraCorrect) {
                feedbackTextES += "- La respuesta de Muestra no es correcta.<br>";
                feedbackTextEU += "- Laginaren erantzuna ez da zuzena.<br>";
            }
            if (!userIndividuoValue) {
                feedbackTextES += "- No has respondido la pregunta de Individuo.<br>";
                feedbackTextEU += "- Ez duzu Banakoaren galdera erantzun.<br>";
            } else if (!isIndividuoCorrect) {
                feedbackTextES += "- La respuesta de Individuo no es correcta.";
                feedbackTextEU += "- Banakoaren erantzuna ez da zuzena.";
            }
             feedbackHTML = `<span data-lang-es="${feedbackTextES}" data-lang-eu="${feedbackTextEU}">${currentLang === 'es' ? feedbackTextES : feedbackTextEU}</span>`;
        }

        quizFeedbackMC.innerHTML = feedbackHTML;

        // Re-aplicar idioma al feedback recién insertado (el span ya tiene los data-*)
        langUtils.applyLanguage(currentLang);

        // Hacer visible el feedback
        quizFeedbackMC.style.display = 'block';
    });
}


// ==================================================
// === NUEVO: Lógica del Clasificador de Variables ==
// ==================================================

function initVariableClassifier(langUtils) {
    const classifierContainer = document.getElementById('variable-classifier-tool');
    if (!classifierContainer || !langUtils) {
        // console.warn("Variable classifier container or langUtils not found.");
        return;
    }

    // --- Elementos del DOM ---
    const cardsPool = document.getElementById('cards-pool');
    const dropZones = document.querySelectorAll('.drop-zone');
    const feedbackPopup = document.getElementById('classifier-feedback');
    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
    const statsContainer = document.getElementById('classifier-stats');
    const statsTotal = document.getElementById('stats-total');
    const statsCorrect = document.getElementById('stats-correct');
    const statsIncorrect = document.getElementById('stats-incorrect');
    const statsTime = document.getElementById('stats-time');
    const statsAdvice = document.getElementById('stats-advice');
    const endSessionButton = document.getElementById('end-session-button');
    const addVariableForm = document.getElementById('add-variable-form');

    // --- Datos de las Variables (Ejemplo inicial) ---
    // Intentar cargar desde localStorage, si no, usar los datos por defecto
    let variablesData = JSON.parse(localStorage.getItem('customVariablesData')) || [
        // Nivel Básico
        { id: 'var1', text_es: 'Color de ojos', text_eu: 'Begi-kolorea', category: 'cualitativa', icon: 'fas fa-eye', level: 'basic',
          feedback_correct_es: '¡Exacto! El color es una cualidad, no se mide con números.', feedback_correct_eu: 'Zehatz! Kolorea kualitate bat da, ez da zenbakiekin neurtzen.',
          feedback_incorrect_es: 'El color describe un tipo o categoría.', feedback_incorrect_eu: 'Koloreak mota edo kategoria bat deskribatzen du.' },
        { id: 'var2', text_es: 'Número de hermanos', text_eu: 'Anai-arreba kopurua', category: 'discreta', icon: 'fas fa-users', level: 'basic',
          feedback_correct_es: '¡Bien! Contamos los hermanos (0, 1, 2...), son valores aislados.', feedback_correct_eu: 'Ondo! Anai-arrebak kontatzen ditugu (0, 1, 2...), balio isolatuak dira.',
          feedback_incorrect_es: 'Contamos el número de hermanos, no puede haber 1.5 hermanos.', feedback_incorrect_eu: 'Anai-arreba kopurua kontatzen dugu, ezin da 1.5 anai-arreba egon.' },
        { id: 'var3', text_es: 'Altura (en cm)', text_eu: 'Altuera (cm-tan)', category: 'continua', icon: 'fas fa-ruler-vertical', level: 'basic',
          feedback_correct_es: '¡Correcto! La altura se mide y puede tener cualquier valor intermedio (165.5 cm, 165.58 cm...).', feedback_correct_eu: 'Zuzena! Altuera neurtu egiten da eta edozein tarteko balio izan dezake (165.5 cm, 165.58 cm...).',
          feedback_incorrect_es: 'La altura es una medida, puede haber valores entre 165cm y 166cm.', feedback_incorrect_eu: 'Altuera neurri bat da, 165cm eta 166cm artean balioak egon daitezke.' },
        { id: 'var4', text_es: 'Marca de móvil', text_eu: 'Mugikor marka', category: 'cualitativa', icon: 'fas fa-mobile-alt', level: 'basic',
          feedback_correct_es: '¡Sí! Es una categoría o nombre.', feedback_correct_eu: 'Bai! Kategoria edo izen bat da.',
          feedback_incorrect_es: 'La marca es un nombre, una cualidad.', feedback_incorrect_eu: 'Marka izen bat da, kualitate bat.' },
        { id: 'var5', text_es: 'Número de goles marcados', text_eu: 'Sartutako gol kopurua', category: 'discreta', icon: 'fas fa-futbol', level: 'basic',
           feedback_correct_es: '¡Perfecto! Los goles se cuentan, no puedes marcar 2.7 goles.', feedback_correct_eu: 'Primeran! Golak kontatu egiten dira, ezin dituzu 2.7 gol sartu.',
           feedback_incorrect_es: 'Contamos los goles (0, 1, 2...). Son valores enteros.', feedback_incorrect_eu: 'Golak kontatzen ditugu (0, 1, 2...). Balio osoak dira.' },
        { id: 'var6', text_es: 'Peso (en kg)', text_eu: 'Pisua (kg-tan)', category: 'continua', icon: 'fas fa-weight-hanging', level: 'basic',
          feedback_correct_es: '¡Eso es! El peso se mide y puede tener decimales (60.3 kg, 60.35 kg...).', feedback_correct_eu: 'Hori da! Pisua neurtu egiten da eta dezimalak izan ditzake (60.3 kg, 60.35 kg...).',
          feedback_incorrect_es: 'El peso se mide, puede haber valores entre 60kg y 61kg.', feedback_incorrect_eu: 'Pisua neurtu egiten da, 60kg eta 61kg artean balioak egon daitezke.' },
        // Nivel Avanzado
        { id: 'var7', text_es: 'Nota de examen (0-10 con decimales)', text_eu: 'Azterketako nota (0-10 dezimalekin)', category: 'continua', icon: 'fas fa-graduation-cap', level: 'advanced', // Considerada continua por poder tomar cualquier valor en el rango
          feedback_correct_es: '¡Bien visto! Aunque a veces se limiten los decimales, teóricamente puede tomar infinitos valores entre 0 y 10. Es una medida.', feedback_correct_eu: 'Ondo ikusia! Batzuetan dezimalak mugatzen badira ere, teorian 0 eta 10 artean balio infinituak har ditzake. Neurri bat da.',
          feedback_incorrect_es: 'Piensa: ¿Podría haber una nota de 7.5? ¿Y de 7.55? Si puede haber infinitos valores intermedios, es continua.', feedback_incorrect_eu: 'Pentsatu: 7.5eko nota egon liteke? Eta 7.55ekoa? Tarteko balio infinituak egon badaitezke, jarraitua da.' },
        { id: 'var8', text_es: 'Número de calzado', text_eu: 'Oinetako zenbakia', category: 'discreta', icon: 'fas fa-shoe-prints', level: 'advanced', // Discreta aunque haya medios puntos
          feedback_correct_es: '¡Correcto! Aunque existan tallas como 40.5, no hay infinitas tallas entre 40 y 41 (no existe 40.2, 40.3...). Son valores específicos.', feedback_correct_eu: 'Zuzena! 40.5 bezalako neurriak existitzen badira ere, ez dago neurri infiniturik 40 eta 41 artean (ez dago 40.2, 40.3...). Balio espezifikoak dira.',
          feedback_incorrect_es: 'Aunque hay medias tallas, no puedes tener cualquier valor entre 40 y 41 (ej: 40.7). Son saltos.', feedback_incorrect_eu: 'Neurri erdiak badaude ere, ezin duzu 40 eta 41 arteko edozein balio izan (adib.: 40.7). Jauziak dira.' },
        { id: 'var9', text_es: 'Tiempo para completar una tarea (segundos)', text_eu: 'Zeregin bat osatzeko denbora (segundoak)', category: 'continua', icon: 'fas fa-stopwatch', level: 'advanced',
          feedback_correct_es: '¡Exacto! El tiempo es la variable continua por excelencia, siempre se puede medir con más precisión.', feedback_correct_eu: 'Zehatz! Denbora jarraitua da bikaintasunez, beti neur daiteke zehaztasun handiagoz.',
          feedback_incorrect_es: 'El tiempo se mide. Entre 30s y 31s hay infinitos valores posibles (30.5s, 30.55s...).', feedback_incorrect_eu: 'Denbora neurtu egiten da. 30s eta 31s artean balio posible infinituak daude (30.5s, 30.55s...).' },
        { id: 'var10', text_es: 'Nivel de satisfacción (Escala 1-5)', text_eu: 'Asebetetze maila (Eskala 1-5)', category: 'discreta', icon: 'fas fa-star', level: 'advanced', // Ordinal, pero tratada como discreta en este contexto
          feedback_correct_es: '¡Muy bien! Aunque hay orden, solo se pueden dar valores enteros específicos (1, 2, 3, 4, 5).', feedback_correct_eu: 'Oso ondo! Ordena badago ere, balio oso espezifikoak bakarrik eman daitezke (1, 2, 3, 4, 5).',
          feedback_incorrect_es: 'Solo puedes elegir 1, 2, 3, 4 o 5. No hay valores intermedios con sentido (ej: 3.8). Es discreta.', feedback_incorrect_eu: '1, 2, 3, 4 edo 5 bakarrik aukera ditzakezu. Ez dago zentzuzko tarteko baliorik (adib.: 3.8). Diskretua da.' }
    ];

    // --- Estado de la Herramienta ---
    let currentLevel = 'basic';
    let score = 0;
    let attempts = 0;
    let incorrectAttempts = 0;
    let startTime = null;
    let totalTime = 0;
    let draggedItemId = null;
    let incorrectCategoryCounts = { cualitativa: 0, discreta: 0, continua: 0 }; // Para el consejo

    // --- Funciones Auxiliares ---

    // Fisher-Yates Shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Crear elemento tarjeta HTML
    function createCardElement(variable) {
        const card = document.createElement('div');
        card.classList.add('variable-card');
        card.setAttribute('draggable', 'true');
        card.dataset.id = variable.id;
        card.dataset.correctCategory = variable.category; // Guardar categoría correcta

        const icon = document.createElement('i');
        icon.className = variable.icon || 'fas fa-question-circle'; // Icono por defecto

        const textSpan = document.createElement('span');
        textSpan.dataset.langEs = variable.text_es;
        textSpan.dataset.langEu = variable.text_eu;
        // Establecer texto inicial según idioma actual
        textSpan.textContent = langUtils.getCurrentLang() === 'es' ? variable.text_es : variable.text_eu;

        card.appendChild(icon);
        card.appendChild(textSpan);

        // Añadir listener para dragstart
        card.addEventListener('dragstart', dragStartHandler);
        card.addEventListener('dragend', dragEndHandler);

        return card;
    }

    // Poblar el pool de tarjetas
    function populateCards() {
        if (!cardsPool) return;
        cardsPool.innerHTML = `<h4 data-lang-es="Arrastra las variables:" data-lang-eu="Arrastatu aldagaiak:">${langUtils.getCurrentLang() === 'es' ? 'Arrastra las variables:' : 'Arrastatu aldagaiak:'}</h4>`; // Resetear pool pero mantener título
        const filteredVariables = variablesData.filter(v => v.level === currentLevel);
        const shuffledVariables = shuffleArray(filteredVariables);

        shuffledVariables.forEach(variable => {
            const cardElement = createCardElement(variable);
            cardsPool.appendChild(cardElement);
        });
        // Asegurar traducción del título y nuevas tarjetas
        langUtils.applyLanguage(langUtils.getCurrentLang());
        // Ocultar botón de finalizar y estadísticas
        endSessionButton.style.display = 'none';
        statsContainer.style.display = 'none';
        // Resetear estadísticas
        resetStats();
    }

    // Mostrar Feedback
    let feedbackTimeout = null;
    function showFeedback(isCorrect, variable, targetCategory) {
        if (!feedbackPopup) return;

        clearTimeout(feedbackTimeout); // Limpiar timeout anterior si existe

        const currentLang = langUtils.getCurrentLang();
        feedbackPopup.classList.remove('correct', 'incorrect', 'fade-out'); // Limpiar clases previas
        void feedbackPopup.offsetWidth; // Forzar reflow para reiniciar animación

        let message = '';
        let reason = '';

        if (isCorrect) {
            feedbackPopup.classList.add('correct');
            message = currentLang === 'es' ? '¡Correcto!' : 'Zuzena!';
            reason = currentLang === 'es' ? variable.feedback_correct_es : variable.feedback_correct_eu;
        } else {
            feedbackPopup.classList.add('incorrect');
            const correctText = getCategoryText(variable.category, currentLang);
            message = currentLang === 'es' ? `¡Incorrecto! Era ${correctText}.` : `Okerra! ${correctText} zen.`;
            reason = currentLang === 'es' ? variable.feedback_incorrect_es : variable.feedback_incorrect_eu;
        }

        feedbackPopup.innerHTML = `
            <p>${message}</p>
            <span class="reason">${reason}</span>
        `;
        feedbackPopup.style.display = 'block';

        // Ocultar automáticamente después de unos segundos
        feedbackTimeout = setTimeout(() => {
            feedbackPopup.classList.add('fade-out');
            // Esperar que termine la animación fade-out para ocultar con display none
             feedbackPopup.addEventListener('animationend', function hidePopup() {
                 feedbackPopup.style.display = 'none';
                 feedbackPopup.classList.remove('fade-out');
                 feedbackPopup.removeEventListener('animationend', hidePopup); // Limpiar listener
             });
        }, isCorrect ? 3000 : 4500); // Más tiempo si es incorrecto
    }

    // Obtener texto de categoría traducido
    function getCategoryText(category, lang) {
        switch(category) {
            case 'cualitativa': return lang === 'es' ? 'Cualitativa' : 'Kualitatiboa';
            case 'discreta': return lang === 'es' ? 'Cuantitativa Discreta' : 'Kuantitatibo Diskretua';
            case 'continua': return lang === 'es' ? 'Cuantitativa Continua' : 'Kuantitatibo Jarraitua';
            default: return category;
        }
    }

    // Resetear/Actualizar estadísticas
    function resetStats() {
        score = 0;
        attempts = 0;
        incorrectAttempts = 0;
        startTime = new Date(); // Iniciar crono para la sesión
        totalTime = 0;
        incorrectCategoryCounts = { cualitativa: 0, discreta: 0, continua: 0 };
        updateStatsDisplay();
    }

    function updateStatsDisplay() {
        if (statsTotal) statsTotal.textContent = attempts;
        if (statsCorrect) statsCorrect.textContent = score;
        if (statsIncorrect) statsIncorrect.textContent = incorrectAttempts;
    }

     // Calcular y mostrar resultados finales
     function calculateAndShowResults() {
         if (!statsContainer || !startTime) return;

         totalTime = Math.round((new Date() - startTime) / 1000); // Tiempo total en segundos
         const averageTime = attempts > 0 ? (totalTime / attempts).toFixed(1) : 0;
         const accuracy = attempts > 0 ? ((score / attempts) * 100).toFixed(0) : 0;

         if (statsTime) statsTime.textContent = averageTime;

         // Generar consejo (lógica simple de ejemplo)
         let adviceTextES = `¡Buen trabajo! Has acertado ${accuracy}% de las clasificaciones.`;
         let adviceTextEU = `Lan ona! Sailkapenen %${accuracy} asmatu duzu.`;
         let maxErrors = 0;
         let categoryWithMostErrors = null;

         for (const category in incorrectCategoryCounts) {
             if (incorrectCategoryCounts[category] > maxErrors) {
                 maxErrors = incorrectCategoryCounts[category];
                 categoryWithMostErrors = category;
             }
         }

         if (incorrectAttempts > attempts / 3 && categoryWithMostErrors) { // Si hay >33% errores y un tipo domina
             const catTextES = getCategoryText(categoryWithMostErrors, 'es').toLowerCase();
             const catTextEU = getCategoryText(categoryWithMostErrors, 'eu').toLowerCase();
             adviceTextES = `Parece que tienes más dudas con las variables ${catTextES}. ¡Repasa sus características!`;
             adviceTextEU = `${catTextEU} aldagaiekin zalantza gehiago dituzula dirudi. Berrikusi haien ezaugarriak!`;
         } else if (incorrectAttempts === 0 && attempts > 0) {
              adviceTextES = "¡Felicidades! Has clasificado todo correctamente.";
              adviceTextEU = "Zorionak! Dena zuzen sailkatu duzu.";
         }

        statsAdvice.dataset.langEs = adviceTextES;
        statsAdvice.dataset.langEu = adviceTextEU;
        statsAdvice.textContent = langUtils.getCurrentLang() === 'es' ? adviceTextES : adviceTextEU;
        statsAdvice.style.display = 'block';

        statsContainer.style.display = 'block';
        endSessionButton.style.display = 'none'; // Ocultar botón tras mostrar resultados
     }


    // --- Handlers de Eventos Drag & Drop ---
    function dragStartHandler(event) {
        draggedItemId = event.target.dataset.id;
        event.dataTransfer.setData('text/plain', draggedItemId);
        event.target.classList.add('dragging'); // Estilo visual
        // console.log('Drag Start:', draggedItemId);
    }

    function dragEndHandler(event) {
         event.target.classList.remove('dragging'); // Limpiar estilo
         // console.log('Drag End');
    }

    function dragOverHandler(event) {
        event.preventDefault(); // Necesario para permitir el drop
        // event.target.closest('.drop-zone').classList.add('over'); // Se hace en dragEnter
        // console.log('Drag Over Zone');
    }

    function dragEnterHandler(event) {
        const zone = event.target.closest('.drop-zone');
        if(zone) {
            zone.classList.add('over');
            // console.log('Drag Enter Zone:', zone.id);
        }
    }

    function dragLeaveHandler(event) {
         const zone = event.target.closest('.drop-zone');
        if(zone) {
            zone.classList.remove('over');
            // console.log('Drag Leave Zone:', zone.id);
        }
    }

    function dropHandler(event) {
        event.preventDefault();
        const zone = event.target.closest('.drop-zone');
        if (!zone || !draggedItemId) return;

        zone.classList.remove('over');
        const droppedVariableId = event.dataTransfer.getData('text/plain');
        const targetCategory = zone.dataset.category;
        const variable = variablesData.find(v => v.id === droppedVariableId);
        const draggedCardElement = document.querySelector(`.variable-card[data-id="${droppedVariableId}"]`);

        // console.log(`Drop: Card ${droppedVariableId} (${variable?.category}) into Zone ${targetCategory}`);

        if (variable && draggedCardElement) {
            attempts++;
            const isCorrect = variable.category === targetCategory;

            if (isCorrect) {
                score++;
                // Opcional: Mover visualmente la tarjeta a la zona (añade complejidad)
                // zone.appendChild(draggedCardElement); // Simplificado: solo quitarla del pool
                draggedCardElement.remove();
                 showFeedback(true, variable, targetCategory);
            } else {
                incorrectAttempts++;
                incorrectCategoryCounts[variable.category]++; // Contar error en la categoría correcta
                // Devolver la tarjeta al pool o simplemente mostrar error
                // draggedCardElement.classList.remove('dragging'); // Ya se hace en dragEnd
                showFeedback(false, variable, targetCategory);
                // Podrías añadir una animación de "rebote" o error aquí
            }
            updateStatsDisplay();

             // Comprobar si el pool está vacío
            if (cardsPool.querySelectorAll('.variable-card').length === 0) {
                endSessionButton.style.display = 'inline-block'; // Mostrar botón para ver resultados
            }
        }
        draggedItemId = null; // Resetear item arrastrado
    }

    // --- Añadir Listeners a las Zonas ---
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOverHandler);
        zone.addEventListener('dragenter', dragEnterHandler);
        zone.addEventListener('dragleave', dragLeaveHandler);
        zone.addEventListener('drop', dropHandler);
    });

    // --- Listener para Cambio de Dificultad ---
    difficultyRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            currentLevel = event.target.value;
            // console.log("Difficulty changed to:", currentLevel);
            populateCards(); // Repopular con el nuevo nivel y resetear stats
        });
    });

     // --- Listener para Botón de Fin de Sesión ---
    if (endSessionButton) {
        endSessionButton.addEventListener('click', calculateAndShowResults);
    }

    // --- Listener para Formulario de Añadir Variable (Profesor) ---
    if (addVariableForm) {
        addVariableForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newVar = {
                id: 'var' + (variablesData.length + 1) + Date.now(), // ID único simple
                text_es: document.getElementById('new-var-text-es').value.trim(),
                text_eu: document.getElementById('new-var-text-eu').value.trim(),
                category: document.getElementById('new-var-category').value,
                icon: document.getElementById('new-var-icon').value.trim() || 'fas fa-question-circle',
                level: document.getElementById('new-var-level').value,
                // Añadir feedback genérico o dejarlo vacío
                feedback_correct_es: '¡Correcto!', feedback_correct_eu: 'Zuzena!',
                feedback_incorrect_es: 'Clasificación incorrecta.', feedback_incorrect_eu: 'Sailkapen okerra.'
            };

            if (newVar.text_es && newVar.text_eu && newVar.category) {
                variablesData.push(newVar);
                // Guardar en localStorage para persistencia simple en la sesión del navegador
                localStorage.setItem('customVariablesData', JSON.stringify(variablesData));

                // console.log("Nueva variable añadida:", newVar);
                // Opcional: Actualizar inmediatamente las tarjetas si el nivel coincide
                if(newVar.level === currentLevel) {
                    const cardElement = createCardElement(newVar);
                    cardsPool.appendChild(cardElement);
                    langUtils.applyLanguage(langUtils.getCurrentLang()); // Traducir nueva tarjeta
                }
                addVariableForm.reset(); // Limpiar formulario
                 // Mostrar un mensaje de éxito breve
                 alert(langUtils.getCurrentLang() === 'es' ? 'Variable añadida con éxito.' : 'Aldagaia ondo gehitu da.');

            } else {
                 alert(langUtils.getCurrentLang() === 'es' ? 'Por favor, completa todos los campos requeridos.' : 'Mesedez, bete beharrezko eremu guztiak.');
            }
        });
    }


    // --- Inicialización ---
    populateCards(); // Carga inicial de tarjetas
    console.log("Variable Classifier Initialized");

} // Fin initVariableClassifier