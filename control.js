// control.js - Manejo de la interfaz de usuario y estado

const controls = {
 explanationEl: document.getElementById('explanation-content'),
 legendEl: document.getElementById('legend'),
 
 init() {
  this.setupEventListeners();
  // Iniciar el motor de la aplicación
  app.init();
 },
 
 setupEventListeners() {
  document.getElementById('btn-ej1').addEventListener('click', () => {
   if (typeof ejercicio1 !== 'undefined' && ejercicio1) {
    this.loadExercise(ejercicio1);
   }
  });
  
  // Los botones para ej2 y ej3 están deshabilitados, pero el código está listo
  document.getElementById('btn-ej2').addEventListener('click', () => {
   if (typeof ejercicio2 !== 'undefined' && ejercicio2) {
    this.loadExercise(ejercicio2);
   }
  });
  document.getElementById('btn-ej3').addEventListener('click', () => {
   if (typeof ejercicio3 !== 'undefined' && ejercicio3) {
    this.loadExercise(ejercicio3);
   }
  });
  
  document.getElementById('btn-reset').addEventListener('click', () => this.reset());
  document.getElementById('btn-prev').addEventListener('click', () => this.prevStep());
  document.getElementById('btn-next').addEventListener('click', () => this.nextStep());
 },
 
 loadExercise(exerciseData) {
  app.state.currentExercise = exerciseData;
  app.state.currentStep = 0;
  this.updateUI();
 },
 
 nextStep() {
  if (!app.state.currentExercise) return;
  const maxSteps = app.state.currentExercise.steps.length - 1;
  if (app.state.currentStep < maxSteps) {
   app.state.currentStep++;
   this.updateUI();
  }
 },
 
 prevStep() {
  if (!app.state.currentExercise) return;
  if (app.state.currentStep > 0) {
   app.state.currentStep--;
   this.updateUI();
  }
 },
 
 reset() {
  if (!app.state.currentExercise) return;
  app.state.currentStep = 0;
  this.updateUI();
 },
 
 updateUI() {
  this.updateExplanation();
  this.updateLegend();
  app.startStepAnimation(); // Inicia la animación si el paso la tiene
  app.draw(); // Dibuja el estado actual
 },
 
 updateExplanation() {
  if (!app.state.currentExercise) {
   this.explanationEl.innerHTML = '<p>Selecciona un ejercicio para comenzar.</p>';
   return;
  }
  const explanationHTML = app.state.currentExercise.steps[app.state.currentStep].explanation;
  this.explanationEl.innerHTML = explanationHTML;
  // Re-renderizar las fórmulas matemáticas con MathJax
  if (window.MathJax) {
   MathJax.typesetPromise([this.explanationEl]);
  }
 },
 
 updateLegend() {
  this.legendEl.innerHTML = '';
  if (!app.state.currentExercise) return;
  
  const { curves, sumCurve } = app.state.currentExercise;
  
  curves.forEach(curve => {
   this.legendEl.innerHTML += this.createLegendItem(curve.color, curve.label);
  });
  
  this.legendEl.innerHTML += this.createLegendItem(sumCurve.color, sumCurve.label);
 },
 
 createLegendItem(color, label) {
  return `
            <div class="legend-item">
                <span class="legend-color" style="background-color: ${color};"></span>
                <span>$${label}$</span>
            </div>
        `;
 }
};

// Iniciar los controles cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => controls.init());