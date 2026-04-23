// spec/customMatcher.js

const customMatchers = {
  toBeCalculatorResult: function(util, customEqualityTesters) {
    return {
      // La función 'compare' es el corazón del matcher.
      // 'actual' es el valor que recibe el expect() (ej. expect(valor).toBe... )
      compare: function(actual) {
        const result = {};

        // Lógica de nuestro matcher:
        // Un resultado es válido si es un string que representa un número,
        // o si es el string 'Error'.
        const isNumericString = (typeof actual === 'string' && !isNaN(parseFloat(actual)) && isFinite(actual));
        const isErrorString = (actual === 'Error');

        // 'pass' debe ser true si el test pasa, y false si falla.
        result.pass = isNumericString || isErrorString;

        // 'message' se usa para mostrar el error cuando el test falla.
        if (result.pass) {
          // Este mensaje se mostrará si el test falla al usar .not
          // ej. expect('5').not.toBeCalculatorResult();
          result.message = `Se esperaba que '${actual}' NO fuera un resultado válido de la calculadora, pero lo fue.`;
        } else {
          // Este mensaje se mostrará si el test falla de forma normal
          // ej. expect('hola').toBeCalculatorResult();
          result.message = `Se esperaba que '${actual}' fuera un resultado válido de la calculadora (un número o 'Error'), pero no lo fue.`;
        }
        
        return result;
      }
    };
  }
};
