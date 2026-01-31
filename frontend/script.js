let currentOperand = "";
let previousOperand = "";
let operation = null;

const display = document.getElementById("display");

function updateDisplay() {
    display.textContent = currentOperand || "0";
}

function appendNumber(number) {
    if (number === "0" && currentOperand === "0") return;
    currentOperand += number;
    updateDisplay();
}

function appendDecimal() {
    if (currentOperand.includes(".")) return;
    if (currentOperand === "") currentOperand = "0";
    currentOperand += ".";
    updateDisplay();
}

function chooseOperator(op) {
    if (currentOperand === "") return;
    if (previousOperand !== "") compute();
    operation = op;
    previousOperand = currentOperand;
    currentOperand = "";
}

function clearAll() {
    currentOperand = "";
    previousOperand = "";
    operation = null;
    updateDisplay();
}

function toggleSign() {
    if (currentOperand === "") return;
    currentOperand = (parseFloat(currentOperand) * -1).toString();
    updateDisplay();
}

function percent() {
    if (currentOperand === "") return;
    fetch("http://127.0.0.1:8000/modulo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a: parseFloat(currentOperand), b: 100 })
    })
    .then(res => res.json())
    .then(data => { currentOperand = data.result.toString(); updateDisplay(); });
}

async function compute() {
    if (!operation || previousOperand === "" || currentOperand === "") return;

    const a = parseFloat(previousOperand);
    const b = parseFloat(currentOperand);

    let endpoint = "";
    switch (operation) {
        case "+": endpoint = "add"; break;
        case "-": endpoint = "subtract"; break;
        case "*": endpoint = "multiply"; break;
        case "/": endpoint = "divide"; break;
        default: return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ a, b })
        });
        const data = await response.json();
        if (!response.ok) { alert(data.detail); clearAll(); return; }
        currentOperand = data.result.toString();
        previousOperand = "";
        operation = null;
        updateDisplay();
    } catch (err) {
        alert("Backend not running!");
    }
}

function squareRoot() {
    if (currentOperand === "") return;
    fetch("http://127.0.0.1:8000/sqrt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a: parseFloat(currentOperand) })
    })
    .then(res => res.json())
    .then(data => { currentOperand = data.result.toString(); updateDisplay(); });
}

function power() {
    if (currentOperand === "") return;
    fetch("http://127.0.0.1:8000/power", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a: parseFloat(currentOperand), b: 2 })
    })
    .then(res => res.json())
    .then(data => { currentOperand = data.result.toString(); updateDisplay(); });
}
