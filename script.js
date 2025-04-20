const display = document.getElementById('display');
let currentInput = '';
let currentOperator = null;
let operand1 = null;
let shouldResetDisplay = false;


// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key; // Map Enter to "="
    if (key === 'Enter') e.preventDefault(); // prevent auto-clicking first button
    const validKeys = ['+', '-', '*', '/', 'Enter', 'Backspace', 'Escape', '.', 's', ...Array.from({ length: 10 }, (_, i) => i.toString())];
    if (!validKeys.includes(key)) return;
    const button = document.querySelector(`button[data-key="${key}"]`);
    if (button) {
        button.classList.add('pressed');
        button.click();
    }
});

document.addEventListener('keyup', (e) => {
    const button = document.querySelector(`button[data-key="${e.key}"]`);
    if (button) {
        button.classList.remove('pressed');
    }
});


// Handle digit and decimal input
document.querySelectorAll('.digit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.textContent;
        if (shouldResetDisplay) {
            currentInput = '';
            shouldResetDisplay = false;
        }

        if (value === '.' && currentInput.includes('.')) return;
        currentInput += value;
        updateDisplay();
    });
});

// Handle operator buttons
document.querySelectorAll('.operator').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.textContent;

        if (value === '=') {
            calculate();
            return;
        }

        if (operand1 !== null && currentInput !== '') {
            calculate();
        } else if (currentInput !== '') {
            operand1 = parseFloat(currentInput);
        }

        currentOperator = value;
        shouldResetDisplay = true;
    });
});

// Handle clear button
document.getElementById('clear-button').addEventListener('click', () => {
    console.log('Clear button clicked');
    currentInput = '';
    currentOperator = null;
    operand1 = null;
    shouldResetDisplay = false;
    updateDisplay();
});

// Handle backspace
document.getElementById('backspace-button').addEventListener('click', () => {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    };
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
});

// Handle +/- sign toggle
document.getElementById('sign-button').addEventListener('click', () => {
    if (currentInput.startsWith('-')) {
        currentInput = currentInput.slice(1);
    } else if (currentInput !== '') {
        currentInput = '-' + currentInput;
    }
    updateDisplay();
});

// Helpers
function updateDisplay() {
    display.value = currentInput || '0';
}

function formatResult(value) {
    return parseFloat(value.toFixed(4)).toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

function calculate() {
    if (currentOperator === null || currentInput === '') return;

    const operand2 = parseFloat(currentInput);

    switch (currentOperator) {
        case '+':
            operand1 += operand2;
            break;
        case '-':
            operand1 -= operand2;
            break;
        case '/':
            if (operand2 === 0) {
                alert("Cannot divide by 0");
                return;
            }
            operand1 /= operand2;
            break;
        case 'x':
            operand1 *= operand2;
            break;
    }

    currentInput = formatResult(operand1);
    updateDisplay();
    currentOperator = null;
    shouldResetDisplay = true;
}
