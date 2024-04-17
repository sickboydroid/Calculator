const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const equals = document.querySelector("#equals");
const display = document.querySelector(".display-text");
const allClear = document.querySelector("#all-clear");
const decimal = document.querySelector("#decimal");
const sign = document.querySelector("#sign");
const percent = document.querySelector("#percent");
const backspace = document.querySelector("#backspace");
const DISPLAY_CHARACTER_LIMIT = 12;

/* EVENT LISTENERS */
numbers.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (isLastEntryNunber()) {
      if (display.textContent.length === DISPLAY_CHARACTER_LIMIT) return;
      display.textContent = String(
        Number(display.textContent + btn.textContent)
      );
    } else {
      display.textContent = btn.textContent;
    }
    addNumber(display.textContent);
  });
});

operators.forEach((btn) => {
  btn.addEventListener("click", () => {
    addOperator(btn.textContent);
  });
});

percent.addEventListener("click", () => {
  display.textContent = String(roundToFit(Number(display.textContent) / 100));
  addNumber(display.textContent);
});

sign.addEventListener("click", () => {
  display.textContent = String(-Number(display.textContent));
  addNumber(display.textContent);
});

equals.addEventListener("click", () => {
  display.textContent = String(addEquals());
});

decimal.addEventListener("click", () => {
  if (isLastEntryNunber()) {
    if (display.textContent.includes(".")) return;
    display.textContent += ".";
  } else {
    display.textContent = "0.";
  }
  addNumber(display.textContent);
});

allClear.addEventListener("click", () => {
  display.textContent = "0";
  resetDeque();
  updateSelectedOperator(null);
});

backspace.addEventListener("click", () => {
  if (!isLastEntryNunber()) return;
  display.textContent = display.textContent.slice(
    0,
    display.textContent.length - 1
  );
  if (display.textContent.length === 0) display.textContent = "0";
  addNumber(display.textContent);
});

/* CALCULATOR STACK MANAGERS */

const calcDeque = [];

function addNumber(number) {
  if (calcDeque.length === 0 || isLastEntryOperator()) calcDeque.push(number);
  else calcDeque[Math.max(0, calcDeque.length - 1)] = number;
}

function addOperator(operator) {
  if (calcDeque.length === 0) calcDeque.push(0, operator);
  else if (isLastEntryOperator()) calcDeque[calcDeque.length - 1] = operator;
  else calcDeque.push(operator);
  updateSelectedOperator(operator);
}

function updateSelectedOperator(operator) {
  operators.forEach((btn) => {
    if (btn.textContent.includes(operator))
      btn.classList.add("selected-operator-button");
    else btn.classList.remove("selected-operator-button");
  });
}

function addEquals() {
  // console.log(calcDeque); // debugging
  updateSelectedOperator(null);
  if (calcDeque.length === 0) return 0;
  while (calcDeque.length >= 3)
    calcDeque.unshift(
      operate(calcDeque.shift(), calcDeque.shift(), calcDeque.shift())
    );
  let res = roundToFit(calcDeque.shift());
  resetDeque();
  calcDeque.push(res);
  // console.log("res: " + res); // debugging
  return res;
}

function operate(operand1, operator, operand2) {
  operand1 = Number(operand1);
  operand2 = Number(operand2);
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "x":
      return operand1 * operand2;
    case "/":
      return operand1 / operand2;
    case "^":
      return Math.pow(operand1, operand2);
    default:
      console.log("INVALID OPERATOR: " + operator);
  }
}

function isNumber(value) {
  return !isNaN(value) && isFinite(value);
}

function isOperator(value) {
  return ["-", "+", "/", "x", "^"].some((operator) => value === operator);
}

function isLastEntryNunber() {
  return isNumber(calcDeque.at(-1));
}

function isLastEntryOperator() {
  return isOperator(calcDeque.at(-1));
}

function roundToFit(number) {
  const strNumber = String(number);
  if (strNumber.length > DISPLAY_CHARACTER_LIMIT) {
    const numDecimalPlaces =
      DISPLAY_CHARACTER_LIMIT - String(parseInt(strNumber)).length - 1;
    if (numDecimalPlaces >= 0) return Number(number.toFixed(numDecimalPlaces));
  }
  return number;
}

function resetDeque() {
  calcDeque.length = 0;
}
