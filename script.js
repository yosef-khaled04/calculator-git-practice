const currentEl = document.getElementById("current");
const previousEl = document.getElementById("previous");

let currentValue = "0";
let previousValue = "";
let operator = null;
let resetNext = false;

function updateDisplay() {
    currentEl.textContent = currentValue;
    previousEl.textContent = operator ? previousValue + " " + operator : "";
}

function appendNumber(num) {
    if (resetNext) {
        currentValue = "0";
        resetNext = false;
    }
    if (currentValue === "0") {
        currentValue = num;
    } else {
        currentValue += num;
    }
    updateDisplay();
}

function appendDecimal() {
    if (resetNext) {
        currentValue = "0";
        resetNext = false;
    }
    if (!currentValue.includes(".")) {
        currentValue += ".";
    }
    updateDisplay();
}

function chooseOperator(op) {
    if (operator && !resetNext) {
        calculate();
    }
    operator = op;
    previousValue = currentValue;
    resetNext = true;
    updateDisplay();
}

function calculate() {
    if (!operator) return;

    const a = parseFloat(previousValue);
    const b = parseFloat(currentValue);
    let result;

    switch (operator) {
        case "+":
            result = a + b;
            break;
        case "−":
            result = a - b;
            break;
        case "×":
            result = a * b;
            break;
        case "÷":
            if (b === 0) {
                currentValue = "لا يمكن القسمة على صفر";
                previousValue = "";
                operator = null;
                resetNext = true;
                updateDisplay();
                return;
            }
            result = a / b;
            break;
    }

    currentValue = String(parseFloat(result.toFixed(10)));
    previousValue = "";
    operator = null;
    resetNext = true;
    updateDisplay();
}

function clearAll() {
    currentValue = "0";
    previousValue = "";
    operator = null;
    resetNext = false;
    updateDisplay();
}

function deleteLast() {
    if (resetNext) return;
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
    updateDisplay();
}

function percent() {
    currentValue = String(parseFloat(currentValue) / 100);
    updateDisplay();
}

function negate() {
    if (currentValue === "0") return;
    currentValue = currentValue.startsWith("-")
        ? currentValue.slice(1)
        : "-" + currentValue;
    updateDisplay();
}

// ربط الأزرار
document.querySelectorAll("[data-number]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        appendNumber(btn.dataset.number);
    });
});

document.querySelectorAll("[data-operator]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        chooseOperator(btn.dataset.operator);
    });
});

document.querySelectorAll("[data-action]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        switch (btn.dataset.action) {
            case "clear":
                clearAll();
                break;
            case "delete":
                deleteLast();
                break;
            case "percent":
                percent();
                break;
            case "negate":
                negate();
                break;
            case "decimal":
                appendDecimal();
                break;
            case "equals":
                calculate();
                break;
        }
    });
});

updateDisplay();

// دعم لوحة المفاتيح
document.addEventListener("keydown", function (e) {
    if (e.key >= "0" && e.key <= "9") {
        appendNumber(e.key);
    } else if (e.key === ".") {
        appendDecimal();
    } else if (e.key === "+") {
        chooseOperator("+");
    } else if (e.key === "-") {
        chooseOperator("−");
    } else if (e.key === "*") {
        chooseOperator("×");
    } else if (e.key === "/") {
        e.preventDefault();
        chooseOperator("÷");
    } else if (e.key === "Enter" || e.key === "=") {
        calculate();
    } else if (e.key === "Backspace") {
        deleteLast();
    } else if (e.key === "Escape") {
        clearAll();
    }
});