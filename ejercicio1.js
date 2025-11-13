/**
 * @file ejercicio1.js
 * @description Define los datos, configuración y pasos del tutorial para el Ejercicio 1.
 *              Versión con renderizado MathJax mejorado en todas las explicaciones.
 */

const ejercicio1 = {
    /**
     * @property {string} title - El título descriptivo del ejercicio.
     */
    title: "Ejercicio 1: Parábolas Simétricas y Suma Cero",

    /**
     * @property {object} config - Configuración específica para la visualización de este ejercicio.
     */
    config: {
        xRange: { min: -2, max: 10 },
        yRange: { min: -7, max: 7 },
        ticks: [0, 2, 4, 6, 8]
    },

    /**
     * @property {object[]} curves - Array de las funciones originales a sumar.
     */
    curves: [
        {
            id: 'f1',
            func: x => 0.25 * Math.pow(x - 4, 2) + 2,
            color: 'var(--color-f1)',
            label: 'f(x) = 0.25(x-4)^2 + 2'
        },
        {
            id: 'f2',
            func: x => -0.25 * Math.pow(x - 4, 2) - 2,
            color: 'var(--color-f2)',
            label: 'g(x) = -0.25(x-4)^2 - 2'
        }
    ],

    /**
     * @property {object} sumCurve - La función que representa la suma de las curvas anteriores.
     */
    sumCurve: {
        id: 'sum',
        func: x => 0,
        color: 'var(--color-sum)',
        label: 'h(x) = f(x) + g(x) = 0'
    },

    /**
     * @property {object[]} tutorialSteps - Array de pasos que guían al usuario a través del ejercicio.
     */
    tutorialSteps: [
        {
            explanation: "<strong>Introducción:</strong> Vamos a sumar dos parábolas que son imágenes especulares. La primera es <span class='highlight-f1'>$f(x) = 0.25(x-4)^2 + 2$</span> y la segunda es <span class='highlight-f2'>$g(x) = -0.25(x-4)^2 - 2$</span>.",
            action: (app) => { app.highlightCurve('f1'); app.highlightCurve('f2'); }
        },
        {
            explanation: "<strong>Paso 1: Análisis en un Punto.</strong> Para entender la suma, enfoquémonos en un único valor de $x$. Tomaremos como ejemplo el punto <span class='highlight-sum'>$x = 8$</span>.",
            action: (app) => app.showVerticalLine(8)
        },
        {
            explanation: "<strong>Paso 2: Altura de la Primera Curva.</strong> Medimos la altura de la curva <span class='highlight-f1'>$f(x)$</span> en $x=8$. El cálculo es: $f(8) = 0.25(8-4)^2 + 2 = $ <span class='highlight-f1'>6.0</span>.",
            action: (app) => app.showHeight('f1', 8)
        },
        {
            explanation: "<strong>Paso 3: Altura de la Segunda Curva.</strong> Hacemos lo mismo para la curva <span class='highlight-f2'>$g(x)$</span>. El cálculo es: $g(8) = -0.25(8-4)^2 - 2 = $ <span class='highlight-f2'>-6.0</span>.",
            action: (app) => app.showHeight('f2', 8)
        },
        {
            explanation: "<strong>Paso 4: Cálculo de la Suma.</strong> La altura de la nueva curva, $h(x)$, es la suma de las alturas individuales: $h(8) = f(8) + g(8) = $ <span class='highlight-f1'>6.0</span> $+ ($ <span class='highlight-f2'>-6.0</span> $) = $ <span class='highlight-sum'>0.0</span>.",
            action: (app) => app.showSumPoint(8)
        },
        {
            explanation: "<strong>Paso 5: Construyendo el Patrón.</strong> Ahora, la magia. Repetiremos este proceso de suma para todos nuestros puntos clave a lo largo del eje $X$ para descubrir el patrón que forman.",
            action: (app) => app.animateAllTicks()
        },
        {
            explanation: "<strong>Paso 6: La Curva Resultante.</strong> Al conectar todos los puntos posibles, el resultado es una <strong>línea recta</strong> sobre el eje $X$. La función suma es, por tanto, $h(x) = 0$.",
            action: (app) => app.drawFinalCurve()
        },
        {
            explanation: "<strong>Conclusión:</strong> ¡Lo lograste! La suma de estas dos funciones es cero. Esto ocurre porque para <strong>cualquier</strong> valor de $x$, la altura positiva de $f(x)$ es cancelada exactamente por la altura negativa de $g(x)$.",
            action: (app) => {}
        }
    ]
};