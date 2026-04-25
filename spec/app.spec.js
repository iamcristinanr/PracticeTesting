// spec/app.spec.js

function calculate(expression) {
    // ... (código de la función sin cambios)
    try {
        const sanitizedExpression = expression.replace(/[^0-9+\-*/%.()]/g, '');
        if (!sanitizedExpression) return '0';
        if (['+', '-', '*', '/', '%', '.'].includes(sanitizedExpression.slice(-1))) return 'Error';
        const result = eval(sanitizedExpression);
        if (isNaN(result) || !isFinite(result)) return 'Error';
        return parseFloat(result.toFixed(10)).toString();
    } catch (error) {
        return 'Error';
    }
}

// ... (Suites de pruebas anteriores)
describe('Función calculate()', function() { /* ... */ });
describe('Demostración de Matchers de Jasmine', function() { /* ... */ });
describe('Prueba del Matcher Personalizado "toBeCalculatorResult"', function() { /* ... */ });
describe('Demostración del Ciclo de Vida (Setup y Teardown)', function() { /* ... */ });
describe('Demostración de Pruebas del DOM', function() { /* ... */ });


// --- NUEVA SUITE: DEMOSTRACIÓN DEL USO DE 'this' ---
// Nota: Usamos 'function()' en lugar de '() =>' para que 'this' funcione correctamente.
describe('Demostración del uso de "this" para compartir estado', function() {

  // En beforeEach, adjuntamos propiedades a 'this'.
  // 'this' actúa como un objeto compartido para toda la suite.
  beforeEach(function() {
    // Creamos una propiedad 'valor' en el contexto 'this' de la suite.
    this.valor = 10;

    // También podemos adjuntar elementos del DOM.
    this.miElemento = document.createElement('p');
    this.miElemento.innerText = 'Texto original';
    document.body.appendChild(this.miElemento);
  });

  // En afterEach, limpiamos lo que creamos en 'this'.
  afterEach(function() {
    // Eliminamos el elemento del DOM.
    document.body.removeChild(this.miElemento);
    // Es buena práctica limpiar las propiedades de 'this'.
    this.valor = 0;
    this.miElemento = null;
  });

  // En el test, accedemos a las propiedades directamente desde 'this'.
  // No necesitamos declarar variables 'let' al inicio del 'describe'.
  it('debería poder acceder a las propiedades adjuntas a "this"', function() {
    // Verificamos el valor de la propiedad que establecimos en beforeEach.
    expect(this.valor).toBe(10);
  });

  it('debería poder modificar las propiedades de "this" dentro de un test', function() {
    // Modificamos el valor solo para este test.
    this.valor = 20;
    expect(this.valor).toBe(20);

    // El siguiente test tendrá un 'valor' de 10 de nuevo, gracias al beforeEach.
  });

  it('debería poder acceder a los elementos del DOM adjuntos a "this"', function() {
    // No necesitamos hacer un querySelector, ya tenemos la referencia en 'this.miElemento'.
    // Esto es más eficiente.
    expect(this.miElemento.innerText).toBe('Texto original');

    // Modificamos el elemento
    this.miElemento.innerText = 'Texto modificado';
    expect(this.miElemento.innerText).toBe('Texto modificado');
  });

});
