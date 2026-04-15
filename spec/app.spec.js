// spec/app.spec.js

// The core calculation function is defined here for testing purposes
// because the original `calculateResult` in app.js is not directly accessible.
// This logic is extracted from the calculateResult function in app.js.
function calculate(expression) {
    try {
        // Final cleaning before evaluation
        const sanitizedExpression = expression.replace(/[^0-9+\-*/%.()]/g, '');
        
        if (!sanitizedExpression) {
            return '0';
        }

        // Avoid error if the expression ends with an operator
        if (['+', '-', '*', '/', '%', '.'].includes(sanitizedExpression.slice(-1))) {
             return 'Error';
        }

        const result = eval(sanitizedExpression);

        if (isNaN(result) || !isFinite(result)) {
            return 'Error';
        } else {
            // Round to avoid floating point inaccuracies
            return parseFloat(result.toFixed(10)).toString();
        }
    } catch (error) {
        return 'Error';
    }
}

// 1. THE SUITE (The group of tests for the calculator's logic)
describe('Calculator Logic', () => {

  // A nested suite for basic arithmetic operations
  describe('Basic Arithmetic Operations', () => {
    
    // 2. FIRST SPEC (Unit Test 1)
    it('should handle addition correctly', () => {
      // This test checks if the sum of two numbers is calculated correctly.
      expect(calculate('2+2')).toBe('4');
    });

    // 3. SECOND SPEC (Unit Test 2)
    it('should handle subtraction correctly', () => {
      // This test verifies that the subtraction of two numbers works as expected.
      expect(calculate('5-3')).toBe('2');
    });

    it('should handle multiplication correctly', () => {
      // This test ensures that the multiplication of two numbers is accurate.
      expect(calculate('3*4')).toBe('12');
    });

    it('should handle division correctly', () => {
      // This test checks if the division of two numbers provides the correct result.
      expect(calculate('10/2')).toBe('5');
    });
  });

  // A nested suite for more complex scenarios
  describe('Complex Expressions and Edge Cases', () => {

    it('should respect the order of operations', () => {
      // This test verifies that multiplication is performed before addition.
      expect(calculate('2+3*4')).toBe('14'); // Expected: 2 + 12 = 14
    });

    it('should handle decimal numbers correctly', () => {
      // This test ensures that calculations with decimal numbers are correct.
      expect(calculate('1.5+2.5')).toBe('4');
    });

    it('should return "Error" when dividing by zero', () => {
      // Division by zero results in Infinity in JavaScript. This test checks if our function correctly identifies it as an error.
      expect(calculate('5/0')).toBe('Error');
    });

    it('should return "Error" for an expression ending with an operator', () => {
      // An expression should not end with an operator. This test ensures the function flags it as an error.
      expect(calculate('5+')).toBe('Error');
    });

    it('should return "0" for an empty expression', () => {
        // If the expression is empty, the result should be '0'.
        expect(calculate('')).toBe('0');
    });
  });
});
