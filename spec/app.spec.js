// spec/app.spec.js

function calculate(expression) {
    try {
        const sanitizedExpression = expression.replace(/[^0-9+\-*/%.()]/g, '');
        if (!sanitizedExpression) return '0';
        if (['+', '-', '*', '/', '%', '.'].includes(sanitizedExpression.slice(-1))) return 'Error';
        
        const result = eval(sanitizedExpression);

        if (isNaN(result) || !isFinite(result)) {
            return 'Error';
        } else {
            return parseFloat(result.toFixed(10)).toString();
        }
    } catch (error) {
        return 'Error';
    }
}

// --- SUITE PRINCIPAL REESTRUCTURADA CON 3 NIVELES ---
describe('Función calculate()', () => {

  // Nivel 2: Suite para operaciones aritméticas
  describe('cuando realiza operaciones aritméticas básicas', () => {
    it('debería devolver el resultado correcto para la suma', () => {
      expect(calculate('2+2')).toBe('4');
    });
    it('debería devolver el resultado correcto para la resta', () => {
      expect(calculate('5-3')).toBe('2');
    });
    it('debería devolver el resultado correcto para la multiplicación', () => {
      expect(calculate('3*4')).toBe('12');
    });
    it('debería devolver el resultado correcto para la división', () => {
      expect(calculate('10/2')).toBe('5');
    });
  });

  // Nivel 2: Suite para la lógica de negocio más compleja
  describe('cuando maneja lógica de cálculo avanzada', () => {
    it('debería respetar la precedencia de operadores', () => {
      expect(calculate('2+3*4')).toBe('14');
    });
    it('debería realizar cálculos con números decimales', () => {
      expect(calculate('1.5+2.5')).toBe('4');
    });
  });

  // Nivel 2: Suite para todos los casos de error y entradas inválidas
  describe('cuando maneja casos límite y errores', () => {
    // Nivel 3: Sub-suite para operaciones matemáticamente imposibles
    describe('para operaciones matemáticamente indefinidas', () => {
      it('debería devolver "Error" al dividir por cero', () => {
        expect(calculate('5/0')).toBe('Error');
      });
    });
    // Nivel 3: Sub-suite para sintaxis de entrada incorrecta
    describe('para entradas inválidas', () => {
      it('debería devolver "Error" si la expresión termina con un operador', () => {
        expect(calculate('5+')).toBe('Error');
      });
      it('debería devolver "0" para una expresión vacía o nula', () => {
          expect(calculate('')).toBe('0');
      });
    });
  });
});

// --- SUITE: DEMOSTRACIÓN DE DIVERSOS MATCHERS (COMPLETA) ---
describe('Demostración de Matchers de Jasmine', () => {
    it('debería usar toBe para igualdad estricta', () => { expect(calculate('2+2')).toBe('4'); });
    it('debería comparar objetos por su valor con toEqual', () => { expect({ a: 1 }).toEqual({ a: 1 }); });
    it('debería evaluar valores truthy y falsy', () => { expect('Hola').toBeTruthy(); expect(0).toBeFalsy(); });
    it('debería verificar si una variable está definida o no', () => { let a = 1; let b; expect(a).toBeDefined(); expect(b).toBeUndefined(); });
    it('debería verificar si un valor es null', () => { let a = null; expect(a).toBeNull(); });
    it('debería verificar si un valor es NaN', () => { expect(parseInt('abc')).toBeNaN(); });
    it('debería verificar si un elemento está contenido en otro', () => { expect(['a', 'b']).toContain('a'); });
    it('debería verificar si un string coincide con un patrón (RegEx)', () => { expect('a@b.com').toMatch(/@/); });
    it('debería verificar si una función lanza un error', () => { const err = () => { throw new Error(); }; expect(err).toThrow(); });
});

// --- SUITE: PRUEBA DEL MATCHER PERSONALIZADO (COMPLETA Y CORREGIDA) ---
describe('Prueba del Matcher Personalizado "toBeCalculatorResult"', () => {
  beforeEach(() => { jasmine.addMatchers(customMatchers); });
  it('debería validar correctamente un resultado numérico', () => { expect(calculate('10 / 2')).toBeCalculatorResult(); });
  it('debería validar correctamente el resultado "Error"', () => { expect(calculate('5 / 0')).toBeCalculatorResult(); });
  it('debería fallar para un string que no es un resultado válido', () => { expect('abc').not.toBeCalculatorResult(); });
  it('debería fallar para un objeto o un número', () => { 
    expect({}).not.toBeCalculatorResult(); 
    expect(123).not.toBeCalculatorResult(); // Corregido de la versión anterior
  });
});
