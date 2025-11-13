/**
 * @file ejercicio2.js
 * @description Define los datos, configuración y pasos del tutorial para el Ejercicio 2.
 *              Este ejercicio demuestra la suma de una hipérbola y una recta, introduciendo el
 *              concepto de asíntota oblicua.
 * @version 2.2.0 - Versión final con renderizado MathJax corregido y explicaciones robustas.
 */

const ejercicio2 = {
    /**
     * @property {string} title - El título descriptivo del ejercicio, destacando el concepto clave.
     */
    title: "Ejercicio 2: Hipérbola y Recta (Asíntota Oblicua)",

    /**
     * @property {object} config - Configuración específica para la visualización de este ejercicio.
     */
    config: {
        /** @property {object} xRange - Rango del eje X en unidades del mundo. */
        xRange: { min: -5, max: 5 },
        /** @property {object} yRange - Rango del eje Y en unidades del mundo. */
        yRange: { min: -5, max: 5 },
        /** 
         * @property {number[]} ticks - Coordenadas X específicas para la animación.
         * Se eligieron para mostrar el comportamiento cerca y lejos del origen,
         * y se evita x=0 donde la hipérbola no está definida.
         */
        ticks: [-4, -2, -1, -0.5, 0.5, 1, 2, 4]
    },

    /**
     * @property {object[]} curves - Array de las funciones originales a sumar.
     */
    curves: [
        {
            id: 'f1', // La hipérbola
            func: x => 1 / x,
            color: 'var(--color-f1)',
            label: 'f(x) = 1/x'
        },
        {
            id: 'f2', // La recta
            func: x => x,
            color: 'var(--color-f2)',
            label: 'g(x) = x'
        }
    ],

    /**
     * @property {object} sumCurve - La función que representa la suma de las curvas anteriores.
     */
    sumCurve: {
        id: 'sum',
        func: x => (1 / x) + x,
        color: 'var(--color-sum)',
        label: 'h(x) = 1/x + x'
    },

    /**
     * @property {object[]} tutorialSteps - Array de pasos que guían al usuario a través del ejercicio.
     */
    tutorialSteps: [
        {
            explanation: "<strong>Introducción:</strong> Ahora sumaremos la hipérbola <span class='highlight-f1'>$f(x) = \\frac{1}{x}$</span> y la recta <span class='highlight-f2'>$g(x) = x$</span>. Observa la <strong>asíntota vertical</strong> en $x=0$, donde $f(x)$ no está definida.",
            action: (app) => { app.highlightCurve('f1'); app.highlightCurve('f2'); }
        },
        {
            explanation: "<strong>Paso 1: Análisis en el Lado Positivo.</strong> Comencemos en el lado derecho del gráfico, en el punto <span class='highlight-sum'>$x = 2$</span>.",
            action: (app) => app.showVerticalLine(2)
        },
        {
            explanation: "<strong>Paso 2: Altura de la Hipérbola.</strong> La altura de la curva <span class='highlight-f1'>$f(x)$</span> en $x=2$ se calcula como: $f(2) = \\frac{1}{2} = $ <span class='highlight-f1'>0.5</span>.",
            action: (app) => app.showHeight('f1', 2)
        },
        {
            explanation: "<strong>Paso 3: Altura de la Recta.</strong> Para la curva <span class='highlight-f2'>$g(x)$</span>, la altura es simplemente el mismo valor de $x$: $g(2) = $ <span class='highlight-f2'>2.0</span>.",
            action: (app) => app.showHeight('f2', 2)
        },
        {
            explanation: "<strong>Paso 4: Cálculo de la Suma.</strong> La altura de la curva suma, $h(x)$, es: $h(2) = f(2) + g(2) = $ <span class='highlight-f1'>0.5</span> $+ $ <span class='highlight-f2'>2.0</span> $= $ <span class='highlight-sum'>2.5</span>.",
            action: (app) => app.showSumPoint(2)
        },
        {
            explanation: "<strong>Paso 5: Construyendo la Curva Completa.</strong> Repetiremos este proceso en todos nuestros puntos de interés para construir la forma de la nueva curva.",
            action: (app) => app.animateAllTicks()
        },
        {
            explanation: "<strong>Paso 6: La Curva Resultante.</strong> La curva suma completa es $h(x) = \\frac{1}{x} + x$. Observa cómo hereda la asíntota vertical en $x=0$ de la hipérbola original.",
            action: (app) => app.drawFinalCurve()
        },
        {
            explanation: "<strong>Conclusión: ¡Asíntota Oblicua!</strong> Nota cómo la curva suma $h(x)$ (<span class='highlight-sum'>verde</span>) se aproxima a la recta $g(x)$ (<span class='highlight-f2'>roja</span>) cuando $x$ se aleja de cero. Esto se debe a que el término $\\frac{1}{x}$ en la suma $h(x) = x + \\frac{1}{x}$ se vuelve insignificante. Por esto, $g(x)=x$ es una <strong>asíntota oblicua</strong> de $h(x)$.",
            action: (app) => {}
        }
    ]
};