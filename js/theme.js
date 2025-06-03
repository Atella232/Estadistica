function initTheme(body, themeToggle) {
    // --- Función para aplicar el tema ---
    const applyTheme = (theme) => {
        if (!body) return; // Safety check
        body.dataset.theme = theme;
        document.documentElement.dataset.theme = theme; // ensure root also changes
        body.dispatchEvent(new CustomEvent('themeChanged', {detail: theme}));
        if (themeToggle) {
             themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('theme', theme);
    };

    // --- Event Listener y Carga Inicial ---
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
        // Aplica tema guardado o por defecto al cargar
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    } else {
        // Aplicar tema aunque no haya botón (p.ej. si se elimina el botón temporalmente)
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    }
}