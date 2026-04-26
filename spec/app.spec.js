// spec/app.spec.js

// =================================================================================
// ARCHIVO TUTORIAL COMPLETO DE JASMINE
// Este archivo contiene demostraciones de los conceptos clave de Jasmine.
// =================================================================================


// ---------------------------------------------------------------------------------
// FUNCIÓN A PROBAR
// ---------------------------------------------------------------------------------
function calculate(expression) {
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


// ---------------------------------------------------------------------------------
// SUITE 1: SUITES ANIDADAS (Nested Describes)
// Organiza los tests en grupos lógicos para mayor claridad.
// ---------------------------------------------------------------------------------
describe('SUITE 1: Función calculate() con Suites Anidadas', function() {
  describe('cuando realiza operaciones aritméticas básicas', function() {
    it('debería devolver el resultado correcto para la suma', function() { expect(calculate('2+2')).toBe('4'); });
  });
  describe('cuando maneja casos límite y errores', function() {
    describe('para operaciones matemáticamente indefinidas', function() {
      it('debería devolver "Error" al dividir por cero', function() { expect(calculate('5/0')).toBe('Error'); });
    });
  });
});


// ---------------------------------------------------------------------------------
// SUITE 2: DEMOSTRACIÓN DE MATCHERS
// Los matchers son las funciones que realizan las comparaciones en los tests.
// ---------------------------------------------------------------------------------
describe('SUITE 2: Demostración de Matchers de Jasmine', function() {
    it('toBe: Comprueba igualdad estricta (===)', function() { expect('a').toBe('a'); });
    it('toEqual: Compara el contenido de objetos o arrays', function() { expect({ a: 1 }).toEqual({ a: 1 }); });
    it('toBeTruthy / toBeFalsy: Evalúa si un valor es verdadero o falso en un contexto booleano', function() { expect(1).toBeTruthy(); expect(0).toBeFalsy(); });
    it('not: Niega cualquier matcher', function() { expect('a').not.toBe('b'); });
    it('toContain: Verifica si un elemento está en un array o una subcadena en un string', function() { expect(['a', 'b']).toContain('a'); });
    it('toBeDefined / toBeUndefined: Verifica si una variable está definida o no', function() { let a = 1; let b; expect(a).toBeDefined(); expect(b).toBeUndefined(); });
    it('toBeNull: Verifica si un valor es estrictamente null', function() { let a = null; expect(a).toBeNull(); });
    it('toBeNaN: Verifica si un valor es Not-a-Number', function() { expect(parseInt('abc')).toBeNaN(); });
    it('toMatch: Compara un string contra una expresión regular', function() { expect('a@b.com').toMatch(/@/); });
    it('toThrow: Verifica si una función lanza un error', function() { const err = () => { throw new Error(); }; expect(err).toThrow(); });
});


// ---------------------------------------------------------------------------------
// SUITE 3: MATCHER PERSONALIZADO
// Permite crear tus propias funciones de aserción para tests más legibles.
// ---------------------------------------------------------------------------------
describe('SUITE 3: Prueba del Matcher Personalizado "toBeCalculatorResult"', function() {
  beforeEach(function() { jasmine.addMatchers(customMatchers); });
  it('debería validar un resultado numérico y el de "Error"', function() {
    expect(calculate('10 / 2')).toBeCalculatorResult();
    expect(calculate('5 / 0')).toBeCalculatorResult();
    expect('abc').not.toBeCalculatorResult();
  });
});


// ---------------------------------------------------------------------------------
// SUITE 4: CICLO DE VIDA (Setup y Teardown)
// Funciones que se ejecutan antes y después de los tests para preparar y limpiar el entorno.
// ---------------------------------------------------------------------------------
describe('SUITE 4: Demostración del Ciclo de Vida', function() {
  let contador = 0;
  beforeAll(function() { console.log('CICLO DE VIDA: beforeAll - Se ejecuta una vez al inicio de la suite.'); });
  afterAll(function() { console.log('CICLO DE VIDA: afterAll - Se ejecuta una vez al final de la suite.'); });
  beforeEach(function() { contador = 1; console.log('CICLO DE VIDA: beforeEach - Se ejecuta antes de cada test.'); });
  afterEach(function() { console.log('CICLO DE VIDA: afterEach - Se ejecuta después de cada test.'); });
  
  it('modifica el contador', function() { contador++; expect(contador).toBe(2); });
  it('el contador es reseteado a 1 por beforeEach', function() { expect(contador).toBe(1); });
});


// ---------------------------------------------------------------------------------
// SUITE 5: PRUEBAS DEL DOM Y USO DE 'this'
// Cómo crear elementos, probarlos y usar 'this' para compartir estado.
// ---------------------------------------------------------------------------------
describe('SUITE 5: Pruebas del DOM y uso de "this"', function() {
  beforeEach(function() {
    this.miDiv = document.createElement('div');
    this.miDiv.innerText = 'Hola';
    document.body.appendChild(this.miDiv);
  });
  afterEach(function() {
    document.body.removeChild(this.miDiv);
  });
  it('debería crear un elemento y acceder a él con "this"', function() {
    expect(this.miDiv.parentNode).toBe(document.body);
    expect(this.miDiv.innerText).toBe('Hola');
  });
});


// ---------------------------------------------------------------------------------
// SUITE 6: SPIES
// "Espías" que interceptan llamadas a funciones para probar interacciones.
// ---------------------------------------------------------------------------------
const SpyLogger = { log: function(msg) { console.log(msg); } };
const SpyCalculator = { addAndLog: function(a, b) { SpyLogger.log(`R: ${a+b}`); return a+b; } };

describe('SUITE 6: Demostración de Spies', function() {
  beforeEach(function() {
    spyOn(SpyLogger, 'log');
  });
  it('debería espiar la llamada al logger', function() {
    SpyCalculator.addAndLog(7, 8);
    expect(SpyLogger.log).toHaveBeenCalledWith('R: 15');
    expect(SpyLogger.log).toHaveBeenCalledTimes(1);
  });


// ---------------------------------------------------------------------------------
// SUITE 7: SPIES EN PROTOTIPOS (Caso Real)
// ---------------------------------------------------------------------------------
    describe('SUITE 7: Validación de integración con Clase Calculator', function() {

        beforeEach(function() {
            // Si ya existe un espía (por un test anterior), Jasmine puede quejarse.
            // Usamos el prototipo de forma limpia:
            if (!jasmine.isSpy(Calculator.prototype.multiply)) {
                spyOn(Calculator.prototype, 'multiply').and.callThrough();
            }
        });

        it('debería llamar al método multiply del prototipo', function() {
            const calc = new Calculator();
            calc.multiply(5, 5);
            expect(Calculator.prototype.multiply).toHaveBeenCalled();
        });

        it('debería permitirnos falsear el resultado', function() {
            // En lugar de un nuevo spyOn, modificamos el comportamiento del que ya existe
            Calculator.prototype.multiply.and.returnValue(99);
            const calc = new Calculator();
            expect(calc.multiply(2, 2)).toBe(99);
        });
    });
});

// ---------------------------------------------------------------------------------
// SUITE 8: SPYING CON IMPLEMENTACIÓN REAL: and.callThrough()
// ---------------------------------------------------------------------------------
describe('SUITE 8: Spying con Implementación Real: and.callThrough()', function() {
    // ¿Qué es callThrough?
    // Por defecto, un Spy reemplaza la función original. and.callThrough() permite que, además de espiar, la función original se ejecute.
    
    beforeEach(function() {
        // Creamos un espía en el prototipo y le decimos que también ejecute la función real.
        spyOn(Calculator.prototype, 'multiply').and.callThrough();
    });

    it('debería espiar y a la vez ejecutar la implementación real del prototipo', function() {
        const calc = new Calculator();
        const result = calc.multiply(5, 5);

        // Verificamos que el espía en el prototipo fue llamado con los argumentos correctos.
        expect(Calculator.prototype.multiply).toHaveBeenCalledWith(5, 5);

        // Y también verificamos que la función original se ejecutó, devolviendo el resultado correcto.
        expect(result).toBe(25);
    });
});

// ---------------------------------------------------------------------------------
// SUITE 9: CONTROLANDO EL RESULTADO CON RETURN VALUES
// ---------------------------------------------------------------------------------
describe('SUITE 9: Controlando el resultado: Return Values', function() {
    let calculadora;
    beforeEach(function() {
        calculadora = new Calculator();
    });

    // 1. .and.returnValue(valor)
    // Fuerza a la función espiada a devolver siempre el mismo valor, ignorando su lógica original.
    it('debería usar el valor devuelto por el espía con .and.returnValue()', function() {
        // Espiamos el método 'add' del prototipo.
        const spy = spyOn(Calculator.prototype, 'add');
        
        // Forzamos que siempre devuelva 100, sin importar los argumentos.
        spy.and.returnValue(100);

        // Aunque 2 + 2 es 4, el espía fuerza el resultado a 100.
        expect(calculadora.add(2, 2)).toBe(100);
    });

    // 2. .and.returnValues(v1, v2, ...)
    // Ideal cuando la función se llama varias veces y necesitas que cada vez responda algo distinto.
    it('debería devolver valores distintos en cada llamada con .and.returnValues()', function() {
        // Espiamos el método 'generateId' del prototipo.
        const spy = spyOn(Calculator.prototype, 'generateId');
        
        // Definimos la secuencia de respuestas para llamadas sucesivas.
        spy.and.returnValues('ID_A', 'ID_B', 'ID_C');

        expect(calculadora.generateId()).toBe('ID_A'); // 1ª llamada
        expect(calculadora.generateId()).toBe('ID_B'); // 2ª llamada
        expect(calculadora.generateId()).toBe('ID_C'); // 3ª llamada
        expect(calculadora.generateId()).toBeUndefined(); // 4ª llamada (ya no hay valores definidos, devuelve undefined)
    });
});

// ---------------------------------------------------------------------------------
// SUITE 10: CONTROL DE ERRORES Y AISLAMIENTO: throwError
// ---------------------------------------------------------------------------------
describe('SUITE 10: Control de Errores y Aislamiento: throwError', function() {
    let calculadora;
    beforeEach(function() {
        calculadora = new Calculator();
    });

    // .and.throwError("Mensaje de error")
    // Fuerza a la función a lanzar una excepción inmediatamente al ser llamada.
    // Es la mejor forma de testear tus bloques try...catch.
    it('debería simular un error con .and.throwError()', function() {
        // Espiamos el método 'divide' y forzamos que lance un error.
        spyOn(Calculator.prototype, 'divide').and.throwError('ERROR_SIMULADO');

        // Para probar errores, envolvemos la llamada en una función anónima.
        // El matcher 'toThrowError' verifica que la excepción fue lanzada y puede
        // opcionalmente comprobar el mensaje.
        expect(function() {
            calculadora.divide(10, 2);
        }).toThrowError('ERROR_SIMULADO');
    });
});

// ---------------------------------------------------------------------------------
// SUITE 11: ESPIANDO PROPIEDADES: GETTERS
// ---------------------------------------------------------------------------------
describe('SUITE 11: Espiando Propiedades: Getters con spyOnProperty', function() {
    let calculadora;
    beforeEach(function() {
        calculadora = new Calculator();
    });

    // spyOnProperty(obj, 'propiedad', 'get')
    // Permite interceptar el acceso a una propiedad que usa un getter.
    // spyOnProperty(obj, 'propiedad', 'get')
    // Permite interceptar el acceso a una propiedad que usa un getter.
    it('debería espiar un getter y falsear su valor de retorno', function() {
        // Espiamos el getter 'version' del prototipo de Calculator.
        // El 'get' indica que estamos interceptando la lectura de la propiedad.
        const spy = spyOnProperty(Calculator.prototype, 'version', 'get');

        // Forzamos que el getter devuelva una versión "beta".
        spy.and.returnValue('2.0-beta');

        // Al acceder a la propiedad 'version', obtenemos el valor del espía.
        expect(calculadora.version).toBe('2.0-beta');

        // El espía también registra que la propiedad fue accedida.
        expect(spy).toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------------
// SUITE 12: TESTING CÓDIGO ASÍNCRONO (PROMESAS)
// ---------------------------------------------------------------------------------
describe('SUITE 12: Testing Código Asíncrono (Promesas)', function() {
    let calculadora;
    beforeEach(function() {
        calculadora = new Calculator();
    });

    // Test con el callback 'done'
    it('debería obtener la versión usando el callback done', function(done) {
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(
            new Response('{ "version": "0.1.2" }')
        ));

        calculadora.version.then(function(version) {
            expect(version).toBe('0.1.2');
            done();
        });
    });

    // Test con sintaxis async/await
    it('debería obtener la versión usando async/await', async function() {
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(
            new Response('{ "version": "0.2.3" }')
        ));

        const version = await calculadora.version;
        expect(version).toBe('0.2.3');
    });
});

// ---------------------------------------------------------------------------------
// SUITE 13: COMPARATIVA DE ASINCRONÍA: done vs async/await
// ---------------------------------------------------------------------------------
describe('SUITE 13: Comparativa de Asincronía: done vs async/await', function() {
    let calculadora;
    beforeEach(function() {
        calculadora = new Calculator();
        // Simulamos una función que devuelve una promesa después de un pequeño retardo
        spyOn(Calculator.prototype, 'add').and.callFake(function(a, b) {
            return new Promise(function(resolve) {
                setTimeout(function() {
                    resolve(a + b);
                }, 50);
            });
        });
    });

    // Enfoque Clásico: Callback 'done'
    // Necesitas pasar 'done' como argumento y llamarlo explícitamente.
    it('debería sumar de forma asíncrona usando done()', function(done) {
        calculadora.add(2, 3).then(function(resultado) {
            expect(resultado).toBe(5);
            done(); // <-- Esencial: avisa a Jasmine que el test ha terminado.
        });
    });

    // Enfoque Moderno: async/await
    // El código es más limpio y se lee de forma secuencial. No se necesita 'done'.
    it('debería sumar de forma asíncrona usando async/await', async function() {
        const resultado = await calculadora.add(2, 3);
        expect(resultado).toBe(5);
        // <-- No hay 'done()'. Jasmine gestiona la espera automáticamente.
    });
});
