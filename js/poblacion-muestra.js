document.addEventListener('DOMContentLoaded', () => {
    const sampleSizeInput = document.getElementById('sample-size-input');
    const takeSampleButton = document.getElementById('take-sample-button');
    const populationDisplay = document.getElementById('population-display');
    const sampleDisplay = document.getElementById('sample-display');
    const sampleInfo = document.getElementById('sample-info');
    const populationSizeInput = document.getElementById('population-size-input');
    const populationSizeDisplay = document.getElementById('population-size-display');

    // Update population size display
    populationSizeInput.addEventListener('input', () => {
        populationSizeDisplay.textContent = populationSizeInput.value;
        generatePopulation();
    });

    // Generate initial population
    function generatePopulation() {
        const populationSize = parseInt(populationSizeInput.value);
        const bluePercentage = 0.6;
        const orangePercentage = 0.4;

        populationDisplay.innerHTML = ''; // Clear previous population

        for (let i = 0; i < populationSize; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.classList.add(Math.random() < bluePercentage ? 'blue' : 'orange');
            populationDisplay.appendChild(dot);
        }
    }

    // Take sample function
    function takeSample() {
        const populationDots = Array.from(populationDisplay.querySelectorAll('.dot'));
        const sampleSize = parseInt(sampleSizeInput.value);

        // Clear previous sample
        sampleDisplay.innerHTML = '';

        // Randomly select dots for sample
        const sampledDots = [];
        for (let i = 0; i < sampleSize; i++) {
            if (populationDots.length === 0) break;
            
            const randomIndex = Math.floor(Math.random() * populationDots.length);
            const selectedDot = populationDots.splice(randomIndex, 1)[0];
            
            const sampleDot = selectedDot.cloneNode(true);
            sampleDot.classList.add('sampled');
            sampleDisplay.appendChild(sampleDot);
            sampledDots.push(sampleDot);
        }

        // Calculate sample statistics
        const blueDots = sampledDots.filter(dot => dot.classList.contains('blue'));
        const orangeDots = sampledDots.filter(dot => dot.classList.contains('orange'));
        
        const bluePercentage = (blueDots.length / sampledDots.length * 100).toFixed(1);
        const orangePercentage = (orangeDots.length / sampledDots.length * 100).toFixed(1);

        sampleInfo.textContent = `Muestra: ${blueDots.length} 🔵 (${bluePercentage}%), ${orangeDots.length} 🟠 (${orangePercentage}%)`;
    }

    // Initialize population and sample button
    generatePopulation();
    takeSampleButton.addEventListener('click', takeSample);
});
