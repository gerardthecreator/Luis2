/**
 * @file main.js
 * @description Motor principal para el tutorial interactivo de suma de curvas usando SVG.
 * @author Tu Nombre (o el del AI)
 * @version 2.0.1 - Corregido error 'yRange is not defined'
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * Gestiona toda la lógica, el estado y el renderizado del tutorial interactivo.
     */
    class SvgCurveSumTutorial {
        // --- PROPIEDADES PRIVADAS ---

        /** @private Referencias a los elementos clave del DOM. */
        #dom = {};
        
        /** @private El estado actual de la aplicación, incluyendo el ejercicio y el paso actual. */
        #state = {};

        /** @private Constantes de configuración para el sistema de coordenadas SVG. */
        #config = {
            SVG_NS: "http://www.w3.org/2000/svg",
            VIEW_BOX: { width: 800, height: 600 },
            VIEW_MARGIN: { top: 50, right: 50, bottom: 50, left: 50 },
            get VIEW_WIDTH() { return this.VIEW_BOX.width - this.VIEW_MARGIN.left - this.VIEW_MARGIN.right; },
            get VIEW_HEIGHT() { return this.VIEW_BOX.height - this.VIEW_MARGIN.top - this.VIEW_MARGIN.bottom; }
        };

        // --- MÉTODOS PÚBLICOS (PUNTO DE ENTRADA) ---

        /**
         * Inicializa la aplicación.
         */
        constructor() {
            if (!this.#queryDOMElements()) return; // Detener si faltan elementos
            this.#setupEventListeners();
            this.#resetState();
        }

        // --- CONFIGURACIÓN INICIAL ---

        /**
         * @private
         * Busca y almacena las referencias del DOM.
         * @returns {boolean} Verdadero si todos los elementos se encontraron, falso en caso contrario.
         */
        #queryDOMElements() {
            const elements = {
                svg: document.getElementById('main-svg'),
                plane: document.getElementById('cartesian-plane'),
                curvesGroup: document.getElementById('curves-group'),
                tutorialGroup: document.getElementById('tutorial-elements'),
                persistentGroup: document.getElementById('persistent-elements'),
                explanationDiv: document.getElementById('explanation'),
                calculationDiv: document.getElementById('calculation-display'),
                prevButton: document.getElementById('prev-step'),
                nextButton: document.getElementById('next-step'),
                navigation: document.querySelector('.navigation'),
                exerciseButtons: {
                    ej1: document.getElementById('btn-ej1'),
                    ej2: document.getElementById('btn-ej2'),
                    ej3: document.getElementById('btn-ej3')
                }
            };

            for (const key in elements) {
                if (!elements[key]) {
                    console.error(`Error crítico: Elemento del DOM no encontrado -> #${key}`);
                    return false;
                }
            }
            this.#dom = elements;
            return true;
        }

        /**
         * @private
         * Asigna los manejadores de eventos a los elementos del DOM.
         */
        #setupEventListeners() {
            this.#dom.nextButton.addEventListener('click', () => this.#handleNextStep());
            this.#dom.prevButton.addEventListener('click', () => this.#handlePrevStep());
            this.#dom.exerciseButtons.ej1.addEventListener('click', () => this.#handleLoadExercise(ejercicio1));
            this.#dom.exerciseButtons.ej2.addEventListener('click', () => this.#handleLoadExercise(ejercicio2));
            this.#dom.exerciseButtons.ej3.addEventListener('click', () => this.#handleLoadExercise(ejercicio3));
        }

        // --- GESTIÓN DE ESTADO ---

        /**
         * @private
         * (Re)inicia el estado de la aplicación a sus valores por defecto.
         */
        #resetState() {
            this.#state = {
                currentExercise: null,
                currentStepIndex: -1,
                precomputedPaths: {},
                animationTimeoutId: null
            };
        }

        /**
         * @private
         * Maneja la carga de un nuevo ejercicio.
         * @param {object} exerciseData - El objeto del ejercicio a cargar.
         */
        #handleLoadExercise(exerciseData) {
            if (!exerciseData) {
                console.error("Intento de cargar un ejercicio no válido.");
                return;
            }
            this.#fullReset();
            this.#state.currentExercise = exerciseData;

            // Actualizar la UI de los botones
            Object.values(this.#dom.exerciseButtons).forEach(btn => btn?.classList.remove('active'));
            const btnId = `ej${exerciseData === ejercicio1 ? 1 : 2}`;
            this.#dom.exerciseButtons[btnId]?.classList.add('active');

            this.#renderGrid();
            this.#renderBaseCurves();
            
            this.#dom.navigation.style.visibility = 'visible';
            this.#handleNextStep(); // Iniciar con el primer paso
        }

        /** @private Maneja el evento de clic en "Siguiente". */
        #handleNextStep() {
            if (!this.#state.currentExercise || this.#state.currentStepIndex >= this.#state.currentExercise.tutorialSteps.length - 1) return;
            this.#state.currentStepIndex++;
            this.#updateStep();
        }

        /** @private Maneja el evento de clic en "Anterior". */
        #handlePrevStep() {
            if (!this.#state.currentExercise || this.#state.currentStepIndex <= 0) return;
            this.#state.currentStepIndex--;
            this.#updateStep();
        }

        /**
         * @private
         * Orquesta la actualización de la UI para el paso actual.
         */
        #updateStep() {
            this.#softReset();
            const step = this.#state.currentExercise.tutorialSteps[this.#state.currentStepIndex];
            
            this.#renderExplanation(step.explanation);
            step.action(this); // Ejecuta la acción definida en el ejercicio
            
            this.#updateNavButtons();
        }

        // --- LÓGICA DE RENDERIZADO Y DOM ---

        /**
         * @private
         * Dibuja la cuadrícula y los ejes cartesianos.
         */
        #renderGrid() {
            const { xRange, yRange } = this.#state.currentExercise.config;
            const origin = { x: this.#worldToViewX(0), y: this.#worldToViewY(0) };
            
            const createLine = (attrs) => this.#createSVGElement('line', { class: 'grid-line', ...attrs });
            const createText = (attrs, content) => {
                const text = this.#createSVGElement('text', { class: 'tick-label', ...attrs });
                text.textContent = content;
                return text;
            };

            // Líneas verticales y etiquetas
            for (let i = Math.ceil(xRange.min); i <= xRange.max; i++) {
                const x = this.#worldToViewX(i);
                this.#dom.plane.appendChild(createLine({ x1: x, y1: this.#config.VIEW_MARGIN.top, x2: x, y2: this.#config.VIEW_BOX.height - this.#config.VIEW_MARGIN.bottom }));
                if (i !== 0) this.#dom.plane.appendChild(createText({ x: x, y: origin.y + 15, 'text-anchor': 'middle' }, i));
            }
            // Líneas horizontales y etiquetas
            for (let i = Math.ceil(yRange.min); i <= yRange.max; i++) {
                const y = this.#worldToViewY(i);
                this.#dom.plane.appendChild(createLine({ x1: this.#config.VIEW_MARGIN.left, y1: y, x2: this.#config.VIEW_BOX.width - this.#config.VIEW_MARGIN.right, y2: y }));
                if (i !== 0) this.#dom.plane.appendChild(createText({ x: origin.x - 8, y: y, 'dominant-baseline': 'middle', 'text-anchor': 'end' }, i));
            }

            // Ejes principales
            this.#dom.plane.appendChild(this.#createSVGElement('line', { class: 'axis', x1: this.#config.VIEW_MARGIN.left, y1: origin.y, x2: this.#config.VIEW_BOX.width - this.#config.VIEW_MARGIN.right, y2: origin.y }));
            this.#dom.plane.appendChild(this.#createSVGElement('line', { class: 'axis', x1: origin.x, y1: this.#config.VIEW_MARGIN.top, x2: origin.x, y2: this.#config.VIEW_BOX.height - this.#config.VIEW_MARGIN.bottom }));
        }
        
        /**
         * @private
         * Genera y dibuja las curvas base del ejercicio (f1, f2, y la curva suma oculta).
         */
        #renderBaseCurves() {
            const allCurves = [...this.#state.currentExercise.curves, this.#state.currentExercise.sumCurve];
            allCurves.forEach(curve => {
                const pathData = this.#generatePathData(curve.func);
                const pathEl = this.#createSVGElement('path', {
                    id: curve.id,
                    class: 'curve',
                    d: pathData,
                    stroke: curve.color
                });
                if (curve.id === 'sum') {
                    pathEl.id = 'sum-curve';
                    pathEl.style.opacity = 0; // Oculta por defecto
                }
                this.#dom.curvesGroup.appendChild(pathEl);
                this.#precomputePathPoints(pathEl, curve.id);
            });
        }
        
        /**
         * @private
         * Actualiza el panel de explicación con una transición de fundido.
         * @param {string} htmlContent - El contenido HTML para la explicación.
         */
        #renderExplanation(htmlContent) {
            this.#dom.explanationDiv.style.opacity = 0;
            setTimeout(() => {
                this.#dom.explanationDiv.innerHTML = `<p>${htmlContent}</p>`;
                if (window.MathJax) {
                    MathJax.typesetPromise([this.#dom.explanationDiv]);
                }
                this.#dom.explanationDiv.style.opacity = 1;
            }, 300); // Duración de la transición CSS
        }
        
        /**
         * @private
         * Actualiza el estado de habilitación de los botones de navegación.
         */
        #updateNavButtons() {
            if (!this.#state.currentExercise) return;
            this.#dom.prevButton.disabled = this.#state.currentStepIndex <= 0;
            this.#dom.nextButton.disabled = this.#state.currentStepIndex >= this.#state.currentExercise.tutorialSteps.length - 1;
        }

        // --- LÓGICA DE CÁLCULO Y MAPEADO ---

        #map(val, in_min, in_max, out_min, out_max) { return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min; }
        #worldToViewX(wx) { return this.#map(wx, this.#state.currentExercise.config.xRange.min, this.#state.currentExercise.config.xRange.max, this.#config.VIEW_MARGIN.left, this.#config.VIEW_BOX.width - this.#config.VIEW_MARGIN.right); }
        #worldToViewY(wy) { return this.#map(wy, this.#state.currentExercise.config.yRange.min, this.#state.currentExercise.config.yRange.max, this.#config.VIEW_BOX.height - this.#config.VIEW_MARGIN.bottom, this.#config.VIEW_MARGIN.top); }
        #viewToWorldY(vy) { return this.#map(vy, this.#config.VIEW_BOX.height - this.#config.VIEW_MARGIN.bottom, this.#config.VIEW_MARGIN.top, this.#state.currentExercise.config.yRange.min, this.#state.currentExercise.config.yRange.max); }

        /**
         * @private
         * Genera el atributo 'd' para un path SVG a partir de una función matemática.
         * @param {Function} func - La función matemática (x) => y.
         * @returns {string} La cadena de datos del path.
         */
        #generatePathData(func) {
            // ***** LÍNEA CORREGIDA *****
            const { xRange, yRange } = this.#state.currentExercise.config;
            // ***************************
            let path = "";
            let newSegment = true;
            for (let px = 0; px <= this.#config.VIEW_WIDTH; px++) {
                const wx = this.#map(px, 0, this.#config.VIEW_WIDTH, xRange.min, xRange.max);
                const wy = func(wx);
                if (isFinite(wy) && wy >= yRange.min && wy <= yRange.max) {
                    const vx = this.#worldToViewX(wx);
                    const vy = this.#worldToViewY(wy);
                    path += `${newSegment ? 'M' : 'L'} ${vx.toFixed(2)},${vy.toFixed(2)} `;
                    newSegment = false;
                } else {
                    newSegment = true;
                }
            }
            return path;
        }
        
        /**
         * @private
         * Pre-calcula y almacena los puntos de un path para búsquedas rápidas de la coordenada Y.
         * @param {SVGPathElement} pathElement - El elemento del path.
         * @param {string} key - El identificador para almacenar los puntos.
         */
        #precomputePathPoints(pathElement, key) {
            const totalLength = pathElement.getTotalLength();
            const points = new Map();
            if (totalLength === 0) return;
            for (let l = 0; l <= totalLength; l += 0.25) { // Muestreo fino
                const pt = pathElement.getPointAtLength(l);
                points.set(Math.round(pt.x), pt.y);
            }
            this.#state.precomputedPaths[key] = points;
        }

        /**
         * @private
         * Obtiene la coordenada Y en píxeles para una coordenada X dada en un path pre-calculado.
         * @param {string} pathKey - El id de la curva ('f1', 'f2').
         * @param {number} viewX - La coordenada X en el espacio del SVG.
         * @returns {number|null} La coordenada Y o null si no se encuentra.
         */
        #getYAtX(pathKey, viewX) {
            const points = this.#state.precomputedPaths[pathKey];
            return points?.get(Math.round(viewX)) || null;
        }

        /**
         * @private
         * Calcula todos los datos necesarios (coordenadas de vista y de mundo) para un punto X dado.
         * @param {number} worldX - La coordenada X en el espacio matemático.
         * @returns {object|null} Un objeto con todos los datos o null si algún valor es inválido.
         */
        #getSumPointData(worldX) {
            const viewX = this.#worldToViewX(worldX);
            const y1_px = this.#getYAtX('f1', viewX);
            const y2_px = this.#getYAtX('f2', viewX);
            if (y1_px === null || y2_px === null) return null;
            
            const originY_px = this.#worldToViewY(0);
            const sumY_px = originY_px - (originY_px - y1_px) - (originY_px - y2_px);
            
            return {
                view: { x: viewX, y1: y1_px, y2: y2_px, sumY: sumY_px, originY: originY_px },
                world: { y1: this.#viewToWorldY(y1_px), y2: this.#viewToWorldY(y2_px), sumY: this.#viewToWorldY(sumY_px) }
            };
        }
        
        // --- UTILIDADES Y RESETEO ---

        /** @private Crea un elemento SVG con los atributos dados. */
        #createSVGElement(type, attrs) {
            const el = document.createElementNS(this.#config.SVG_NS, type);
            for (const key in attrs) el.setAttribute(key, attrs[key]);
            return el;
        }

        /** @private Limpia los elementos visuales temporales del tutorial. */
        #softReset() {
            clearTimeout(this.#state.animationTimeoutId);
            this.#dom.tutorialGroup.innerHTML = '';
            this.#dom.persistentGroup.innerHTML = '';
            this.#dom.calculationDiv.classList.remove('visible');
            this.#dom.curvesGroup.querySelectorAll('.curve').forEach(el => el.classList.remove('highlight', 'faded'));
            document.getElementById('sum-curve')?.classList.remove('visible');
        }

        /** @private Restablece completamente el área de visualización para un nuevo ejercicio. */
        #fullReset() {
            this.#softReset();
            this.#dom.plane.innerHTML = '';
            this.#dom.curvesGroup.innerHTML = '';
            this.#dom.navigation.style.visibility = 'hidden';
            this.#resetState();
        }

        // --- MÉTODOS PÚBLICOS PARA SER LLAMADOS DESDE LAS ACCIONES DEL EJERCICIO ---
        
        showVerticalLine(worldX) {
            this.#softReset();
            const viewX = this.#worldToViewX(worldX);
            const line = this.#createSVGElement('line', {
                class: 'vertical-line',
                x1: viewX, y1: this.#config.VIEW_MARGIN.top,
                x2: viewX, y2: this.#config.VIEW_BOX.height - this.#config.VIEW_MARGIN.bottom
            });
            this.#dom.tutorialGroup.appendChild(line);
        }

        showHeight(curveId, worldX) {
            this.showVerticalLine(worldX); // Muestra la línea de referencia
            const data = this.#getSumPointData(worldX);
            if (!data) return;

            const y = curveId === 'f1' ? data.view.y1 : data.view.y2;
            const curve = this.#state.currentExercise.curves.find(c => c.id === curveId);
            
            this.highlightCurve(curveId);
            const line = this.#createSVGElement('line', {
                class: 'height-line',
                x1: data.view.x, y1: data.view.originY,
                x2: data.view.x, y2: y,
                stroke: curve.color
            });
            this.#dom.tutorialGroup.appendChild(line);
        }

        showSumPoint(worldX) {
            this.showHeight('f1', worldX);
            this.showHeight('f2', worldX);
            const data = this.#getSumPointData(worldX);
            if (!data) return;
            
            const point = this.#createSVGElement('circle', {
                class: 'sum-point',
                cx: data.view.x, cy: data.view.sumY, r: 8,
                fill: this.#state.currentExercise.sumCurve.color
            });
            this.#dom.tutorialGroup.appendChild(point);

            this.#dom.calculationDiv.innerHTML = `
                <span class="highlight-f1">${data.world.y1.toFixed(1)}</span> + 
                <span class="highlight-f2">${data.world.y2.toFixed(1)}</span> = 
                <span class="highlight-sum">${data.world.sumY.toFixed(1)}</span>
            `;
            this.#dom.calculationDiv.classList.add('visible');
        }
        
        animateAllTicks() {
            this.#softReset();
            this.fadeAllCurves();
            const ticks = this.#state.currentExercise.config.ticks;
            let i = 0;

            const nextTick = () => {
                if (i >= ticks.length) { this.#handleNextStep(); return; } // Auto-avanzar al final
                const data = this.#getSumPointData(ticks[i]);
                if (data) {
                    const p = this.#createSVGElement('circle', {
                        class: 'persistent-point',
                        cx: data.view.x, cy: data.view.sumY, r: 6,
                        fill: this.#state.currentExercise.sumCurve.color
                    });
                    this.#dom.persistentGroup.appendChild(p);
                }
                i++;
                this.#state.animationTimeoutId = setTimeout(nextTick, 300);
            };
            nextTick();
        }

        drawFinalCurve() {
            this.#softReset();
            this.#dom.curvesGroup.querySelectorAll('.curve').forEach(c => c.classList.add('faded'));
            const sumCurveEl = document.getElementById('sum-curve');
            sumCurveEl.style.opacity = 1;
            sumCurveEl.classList.remove('faded');
            sumCurveEl.classList.add('visible');
        }

        highlightCurve(curveId) {
            this.#dom.curvesGroup.querySelectorAll('.curve').forEach(el => {
                el.classList.toggle('highlight', el.id === curveId);
                el.classList.toggle('faded', el.id !== curveId && el.id !== 'sum-curve');
            });
        }
        
        fadeAllCurves() {
            this.#dom.curvesGroup.querySelectorAll('.curve').forEach(c => c.classList.add('faded'));
        }
    }

    // --- INICIAR LA APLICACIÓN ---
    new SvgCurveSumTutorial();
});