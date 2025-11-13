/**
 * @file ejercicio3.js
 * @description Define los datos, configuración y pasos del tutorial para el Ejercicio 3.
 *              Este ejercicio demuestra la suma de una hipérbola y una recta inversa,
 *              introduciendo el concepto de "cancelación" donde la suma es cero.
 */

const ejercicio3 = {
    /**
     * @property {string} title - El título descriptivo del ejercicio.
     */
    title: "Ejercicio 3: Hipérbola y Recta Inversa (Cancelación)",

    /**
     * @property {object} config - Configuración específica para la visualización de este ejercicio.
     */
    config: {
        xRange: { min: -5, max: 5 },
        yRange: { min: -5, max: 5 },
        /** 
         * @property {number[]} ticks - Coordenadas X para la animación.
         * Incluye los puntos clave x=1 y x=-1 donde las funciones se cancelan.
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
            id: 'f2', // La recta con pendiente negativa
            func: x => -x,
            color: 'var(--color-f2)',
            label: 'g(x) = -x'
        }
    ],

    /**
     * @property {object} sumCurve - La función que representa la suma de las curvas anteriores.
     */
    sumCurve: {
        id: 'sum',
        func: x => (1 / x) - x,
        color: 'var(--color-sum)',
        label: 'h(x) = 1/x - x'
    },

    /**
     * @property {object[]} tutorialSteps - Array de pasos que guían al usuario a través del ejercicio.
     */
    tutorialSteps: [
        {
            explanation: "<strong>Introducción:</strong> En nuestro último ejercicio, sumaremos la hipérbola <span class='highlight-f1'>$f(x) = \\frac{1}{x}$</span> y la recta <span class='highlight-f2'>$g(x) = -x$</span>. ¿Qué pasará cuando sus valores sean opuestos?",
            action: (app) => { app.highlightCurve('f1'); app.highlightCurve('f2'); }
        },
        {
            explanation: "<strong>Paso 1: Análisis en un Punto.</strong> Comencemos, como siempre, en un punto simple como <span class='highlight-sum'>$x = 2$</span>.",
            action: (app) => app.showVerticalLine(2)
        },
        {
            explanation: "<strong>Paso 2: Altura de la Hipérbola.</strong> La altura de la curva <span class='highlight-f1'>$f(x)$</span> en $x=2$ es: $f(2) = \\frac{1}{2} = $ <span class='highlight-f1'>0.5</span>.",
            action: (app) => app.showHeight('f1', 2)
        },
        {
            explanation: "<strong>Paso 3: Altura de la Recta.</strong> La altura de la curva <span class='highlight-f2'>$g(x)$</span> en $x=2$ es: $g(2) = $ <span class='highlight-f2'>-2.0</span>.",
            action: (app) => app.showHeight('f2', 2)
        },
        {
            explanation: "<strong>Paso 4: Suma en $x=2$.</strong> La suma de las alturas es: $h(2) = f(2) + g(2) = $ <span class='highlight-f1'>0.5</span> $+ ($ <span class='highlight-f2'>-2.0</span> $) = $ <span class='highlight-sum'>-1.5</span>.",
            action: (app) => app.showSumPoint(2)
        },
        {
            explanation: "<strong>Paso 5: Un Punto Especial (Cancelación).</strong> Ahora observemos qué ocurre en <span class='highlight-sum'>$x=1$</span>. Aquí, $f(1)=1$ y $g(1)=-1$. ¡Sus alturas son perfectamente opuestas!",
            action: (app) => app.showHeight('f1', 1) & app.showHeight('f2', 1)
        },
        {
            explanation: "<strong>Paso 6: La Suma es Cero.</strong> Cuando sumamos en $x=1$, obtenemos: $h(1) = f(1) + g(1) = $ <span class='highlight-f1'>1.0</span> $+ ($ <span class='highlight-f2'>-1.0</span> $) = $ <span class='highlight-sum'>0.0</span>. El punto resultante yace sobre el eje $X$.",
            action: (app) => app.showSumPoint(1)
        },
        {
            explanation: "<strong>Paso 7: Construyendo la Curva.</strong> Repitamos el proceso para todos nuestros puntos clave. Presta atención a lo que sucede en $x=1$ y $x=-1$.",
            action: (app) => app.animateAllTicks()
        },
        {
            explanation: "<strong>Paso 8: La Curva Resultante.</strong> La curva suma completa es $h(x) = \\frac{1}{x} - x$. Los puntos donde cruza el eje $X$ son precisamente donde las funciones originales se cancelaron.",
            action: (app) => app.drawFinalCurve()
        },
        {
            explanation: "<strong>Conclusión:</strong> Has visto cómo la suma de dos funciones puede ser cero en puntos específicos. Al igual que en el ejercicio anterior, la recta $g(x)=-x$ actúa como una <strong>asíntota oblicua</strong> para la curva suma, ya que el término $\\frac{1}{x}$ se vuelve insignificante para valores de $x$ muy grandes.",
            action: (app) => {}
        }
    ]
};