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

// Suite original para la lógica de la calculadora
describe('Calculator Logic', () => {
  describe('Basic Arithmetic Operations', () => {
    it('should handle addition correctly', () => {
      expect(calculate('2+2')).toBe('4');
    });
    it('should handle subtraction correctly', () => {
      expect(calculate('5-3')).toBe('2');
    });
    it('should handle multiplication correctly', () => {
      expect(calculate('3*4')).toBe('12');
    });
    it('should handle division correctly', () => {
      expect(calculate('10/2')).toBe('5');
    });
  });
  describe('Complex Expressions and Edge Cases', () => {
    it('should respect the order of operations', () => {
      expect(calculate('2+3*4')).toBe('14');
    });
    it('should handle decimal numbers correctly', () => {
      expect(calculate('1.5+2.5')).toBe('4');
    });
    it('should return "Error" when dividing by zero', () => {
      expect(calculate('5/0')).toBe('Error');
    });
    it('should return "Error" for an expression ending with an operator', () => {
      expect(calculate('5+')).toBe('Error');
    });
    it('should return "0" for an empty expression', () => {
        expect(calculate('')).toBe('0');
    });
  });
});

// --- SUITE: DEMOSTRACIÓN DE DIVERSOS MATCHERS ---
describe('Demostración de Matchers de Jasmine', () => {
    // ... (tests de la suite de demostración de matchers)
    it('debería usar toBe para igualdad estricta', () => {
        expect(calculate('2+2')).toBe('4');
    });

    // toEqual: Para comparar objetos o arrays (compara contenido, no referencia)
    it('debería comparar objetos por su valor con toEqual', () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { a: 1, b: 2 };
        // expect(obj1).toBe(obj2); // Esto fallaría porque no son el MISMO objeto en memoria.
        expect(obj1).toEqual(obj2); // Esto pasa porque su contenido es idéntico.
    });

    // toBeTruthy y toBeFalsy: Para evaluar valores en un contexto booleano
    it('debería evaluar valores truthy y falsy', () => {
        expect('Hola').toBeTruthy();      // Un string no vacío es truthy
        expect(0).toBeFalsy();           // El número 0 es falsy
        expect('').toBeFalsy();          // Un string vacío es falsy
        expect(null).toBeFalsy();
        expect(undefined).toBeFalsy();
        expect(1).toBeTruthy();
    });

    // toBeDefined y toBeUndefined: Para comprobar si algo existe
    it('debería verificar si una variable está definida o no', () => {
        const resultado = calculate('2+2');
        let variableNoDefinida;
        expect(resultado).toBeDefined();
        expect(variableNoDefinida).toBeUndefined();
    });

    // toBeNull: Para comprobar si algo es estrictamente null
    it('debería verificar si un valor es null', () => {
        let valorNulo = null;
        let valorNoNulo = 'Hola';
        expect(valorNulo).toBeNull();
        expect(valorNoNulo).not.toBeNull();
    });

    // toBeNaN: Para comprobar si el resultado es Not-a-Number
    it('debería verificar si un valor es NaN', () => {
        const resultado = parseInt('esto no es un número');
        expect(resultado).toBeNaN();
    });

    // toContain: Para verificar elementos en arrays o substrings en strings
    it('debería verificar si un elemento está contenido en otro', () => {
        const miArray = ['manzana', 'pera', 'naranja'];
        const mensajeError = 'Error: Entrada inválida';
        expect(miArray).toContain('pera');
        expect(miArray).not.toContain('plátano'); // Negación con .not
        expect(mensajeError).toContain('Error');
    });

    // toMatch: Para comparar strings contra expresiones regulares (RegEx)
    it('debería verificar si un string coincide con un patrón (RegEx)', () => {
        const emailValido = 'test@dominio.com';
        const emailInvalido = 'esto-no-es-un-email';
        const patronEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        expect(emailValido).toMatch(patronEmail);
        expect(emailInvalido).not.toMatch(patronEmail);
    });

    // toThrow: Para verificar que una función lanza un error
    it('debería verificar si una función lanza un error', () => {
        const funcionQueLanzaError = () => {
            throw new Error("¡Esto es un error intencional!");
        };
        // Nota: Debes envolver la llamada a la función en otra función anónima.
        expect(funcionQueLanzaError).toThrow();
        // También puedes verificar el mensaje exacto del error
        expect(funcionQueLanzaError).toThrow(new Error("¡Esto es un error intencional!"));
    });
});

// --- NUEVA SUITE: PRUEBA DEL MATCHER PERSONALIZADO ---
describe('Prueba del Matcher Personalizado "toBeCalculatorResult"', () => {

  // Antes de cada test en esta suite, registramos nuestro matcher personalizado.
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  // Ahora podemos usar nuestro matcher como si fuera uno nativo de Jasmine.
  it('debería validar correctamente un resultado numérico', () => {
    const resultado = calculate('10 / 2'); // resultado es '5'
    expect(resultado).toBeCalculatorResult();
  });

  it('debería validar correctamente el resultado "Error"', () => {
    const resultado = calculate('5 / 0'); // resultado es 'Error'
    expect(resultado).toBeCalculatorResult();
  });

  it('debería fallar para un string que no es un resultado válido', () => {
    const resultadoInvalido = 'esto no es un resultado';
    expect(resultadoInvalido).not.toBeCalculatorResult();
  });

  it('debería fallar para un objeto o un número, ya que esperamos un string', () => {
    expect({}).not.toBeCalculatorResult();
    expect(123).not.toBeCalculatorResult();
  });

});
