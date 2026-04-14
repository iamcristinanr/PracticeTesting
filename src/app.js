document.addEventListener('DOMContentLoaded', function() {
    const display = document.querySelector('.display');
    const buttons = document.querySelector('.buttons');

    // --- Lógica de Clics en Botones ---
    buttons.addEventListener('click', function(event) {
        if (!event.target.matches('button')) return;

        const action = event.target.dataset.action;
        const content = event.target.innerText;
        
        if (display.value === '0' && content !== '.') {
            if (action !== 'calculate' && !['+', '*', '/', '%'].includes(content)) {
                display.value = '';
            }
        }

        if (action === 'clear') {
            display.value = '0';
        } else if (action === 'backspace') {
            display.value = display.value.slice(0, -1) || '0';
        } else if (action === 'calculate') {
            calculateResult();
        } else {
            display.value += content;
        }
    });

    // --- Lógica de Validación para ESCRITURA MANUAL ---
    display.addEventListener('input', function() {
        // Reemplaza múltiples operadores seguidos por solo el último
        // Ej: 5++ se convierte en 5+, 5*- se convierte en 5-
        display.value = display.value.replace(/([+\-*/%.])([+\-*/%.])/g, '$2');
    });


    // --- Lógica de Teclado (solo para Enter) ---
    display.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            calculateResult();
        }
    });

    // --- Función Principal de Cálculo ---
    function calculateResult() {
        try {
            let expression = display.value;
            // Limpieza final antes de evaluar
            const sanitizedExpression = expression.replace(/[^0-9+\-*/%.()]/g, '');
            
            if (!sanitizedExpression) {
                display.value = '0';
                return;
            }

            // Evitar error si la expresión termina en un operador
            if (['+', '-', '*', '/', '%', '.'].includes(sanitizedExpression.slice(-1))) {
                 display.value = 'Error';
                 return;
            }

            const result = eval(sanitizedExpression);

            if (isNaN(result) || !isFinite(result)) {
                display.value = 'Error';
            } else {
                display.value = parseFloat(result.toFixed(10));
            }
        } catch (error) {
            display.value = 'Error';
        }
    }
});
