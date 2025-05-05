document.addEventListener('DOMContentLoaded', () => {
    const cardsPool = document.getElementById('cards-pool');
    const dropZones = document.querySelectorAll('.drop-zone');
    const difficultyInputs = document.querySelectorAll('input[name="difficulty"]');

    // Variables for different difficulty levels
    const basicVariables = [
        { textEs: 'Color de ojos', textEu: 'Begi-kolorea', category: 'cualitativa' },
        { textEs: 'Número de hermanos', textEu: 'Anai-arreba kopurua', category: 'discreta' },
        { textEs: 'Altura en metros', textEu: 'Altuera metrotan', category: 'continua' },
        { textEs: 'Tipo de mascota', textEu: 'Maskota mota', category: 'cualitativa' },
        { textEs: 'Edad en años', textEu: 'Adina urteetan', category: 'discreta' },
        { textEs: 'Peso en kg', textEu: 'Pisua kg-tan', category: 'continua' }
    ];

    const advancedVariables = [
        { textEs: 'Medio de transporte habitual', textEu: 'Ohiko garraiobidea', category: 'cualitativa' },
        { textEs: 'Veces que usó transporte público la semana pasada', textEu: 'Joan den astean garraio publikoa erabilitako aldiak', category: 'discreta' },
        { textEs: 'Tiempo del último trayecto (minutos)', textEu: 'Azken ibilbidearen denbora (minutuak)', category: 'continua' },
        { textEs: 'Satisfecho con el servicio (Sí/No)', textEu: 'Zerbitzuarekin pozik (Bai/Ez)', category: 'cualitativa' },
        { textEs: 'Coste mensual aproximado (€)', textEu: 'Gutxi gorabeherako hileko kostua (€)', category: 'continua' },
        { textEs: 'Número de calzado', textEu: 'Oinetako zenbakia', category: 'discreta' }
    ];

    // Function to create a draggable card
    function createDraggableCard(variable) {
        const card = document.createElement('div');
        card.classList.add('variable-card');
        card.setAttribute('draggable', 'true');
        
        // Get current language from localStorage or default to 'es'
        const currentLang = localStorage.getItem('language') || 'es';
        card.textContent = currentLang === 'eu' ? variable.textEu : variable.textEs;
        card.dataset.category = variable.category;

        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.textContent);
            e.target.classList.add('dragging');
        });

        card.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });

        return card;
    }

    // Function to populate cards pool
    function populateCardsPool(variables) {
        cardsPool.innerHTML = '<h4 data-lang-es="Arrastra las variables:" data-lang-eu="Arrastatu aldagaiak:">Arrastra las variables:</h4>';
        variables.forEach(variable => {
            const card = createDraggableCard(variable);
            cardsPool.appendChild(card);
        });
    }

    // Setup drop zones
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const cardText = e.dataTransfer.getData('text/plain');
            const droppedCard = Array.from(cardsPool.children)
                .find(card => card.textContent === cardText);

            if (droppedCard) {
                const expectedCategory = droppedCard.dataset.category;
                const dropCategory = zone.dataset.category;

                if (expectedCategory === dropCategory) {
                    droppedCard.classList.add('correct');
                } else {
                    droppedCard.classList.add('incorrect');
                }

                // Move card to drop zone
                zone.appendChild(droppedCard);
            }
        });
    });

    // Difficulty level change
    difficultyInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const level = e.target.value;
            populateCardsPool(level === 'basic' ? basicVariables : advancedVariables);
        });
    });

    // Language change support
    function updateLanguage() {
        const currentLevel = document.querySelector('input[name="difficulty"]:checked').value;
        const currentLang = localStorage.getItem('language') || 'es';
        
        // Reapply language to existing cards
        const cardsPool = document.getElementById('cards-pool');
        Array.from(cardsPool.children)
            .filter(el => el.classList.contains('variable-card'))
            .forEach(card => {
                const variable = currentLevel === 'basic' ? 
                    basicVariables.find(v => v.textEs === card.textContent || v.textEu === card.textContent) :
                    advancedVariables.find(v => v.textEs === card.textContent || v.textEu === card.textContent);
                
                if (variable) {
                    card.textContent = currentLang === 'eu' ? variable.textEu : variable.textEs;
                }
            });
    }

    // Add language change listener if language.js is used
    if (typeof initLanguage === 'function') {
        document.addEventListener('languageChanged', updateLanguage);
    }

    // Initial population of cards
    populateCardsPool(basicVariables);
});
