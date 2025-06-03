# Estadística 1º ESO

Este repositorio contiene una página web bilingüe (castellano/euskera) para introducir los conceptos básicos de estadística en 1º de ESO.

## Estructura
- **index.html** enlaza a las distintas secciones dentro de `pages/`.
- **pages/** alberga cada tema: población y muestra, variables, frecuencias, gráficos y medidas.
- **js/** incluye los scripts para el cambio de idioma, el tema claro/oscuro, componentes de interfaz y las herramientas interactivas.
- **css/** contiene los estilos divididos por temática (layout, componentes, temas, etc.).

Las páginas cargan sólo los scripts necesarios para mantener un tamaño ligero. La mayor parte de la lógica se inicializa desde `js/main.js` cuando el DOM está listo.

## Uso
1. Clona el repositorio y abre `index.html` en tu navegador.
2. Activa o desactiva el modo oscuro con el botón de la esquina superior.
3. Cambia entre euskera y castellano usando el interruptor "ES/EU".
4. Explora las herramientas interactivas como el simulador de muestreo o el clasificador de variables.

La web utiliza Chart.js y MathJax desde CDN, por lo que se requiere conexión a Internet para visualizar gráficas y fórmulas correctamente.

---

