document.addEventListener("DOMContentLoaded", () => {
  let currentInput = "0";
  let firstOperand = null;
  let operator = null;
  let waitingForSecondOperand = false;
  const display = document.querySelector(".display span");
  const themeSwitch = document.querySelector(".switch");

  // Button click handler
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.textContent;

      if (button.classList.contains("number")) {
        handleNumber(value);
      } else if (button.classList.contains("operator")) {
        handleOperator(value);
      } else if (button.classList.contains("decimal")) {
        handleDecimal();
      } else if (button.classList.contains("del")) {
        handleDelete();
      } else if (button.classList.contains("reset")) {
        handleReset();
      } else if (button.classList.contains("equals")) {
        handleEquals();
      }

      updateDisplay();
    });
  });

  // Theme switching
  themeSwitch.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    let newTheme;

    switch (currentTheme) {
      case "1":
        newTheme = "2";
        break;
      case "2":
        newTheme = "3";
        break;
      case "3":
        newTheme = "1";
        break;
      default:
        newTheme = "1";
    }

    document.body.setAttribute("data-theme", newTheme);
    themeSwitch.setAttribute("data-theme", newTheme);

    const positions = { 1: "3px", 2: "27px", 3: "50px" };
    themeSwitch.style.left = positions[newTheme];
  });

  function handleNumber(num) {
    if (waitingForSecondOperand) {
      currentInput = num;
      waitingForSecondOperand = false;
    } else {
      currentInput = currentInput === "0" ? num : currentInput + num;
    }
  }

  function handleOperator(op) {
    const inputValue = parseFloat(currentInput);

    if (op === "-" && currentInput === "0") {
      currentInput = "-";
      return;
    }

    if (operator && waitingForSecondOperand) {
      operator = op;
      return;
    }

    if (firstOperand === null) {
      firstOperand = inputValue;
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      currentInput = String(result);
      firstOperand = result;
    }

    operator = op;
    waitingForSecondOperand = true;
  }

  function handleDecimal() {
    if (!currentInput.includes(".")) {
      currentInput += ".";
    }
  }

  function handleDelete() {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
  }

  function handleReset() {
    currentInput = "0";
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
  }

  function handleEquals() {
    if (!operator) return;

    const inputValue = parseFloat(currentInput);
    const result = calculate(firstOperand, inputValue, operator);
    currentInput = String(result);
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
  }

  function calculate(first, second, operator) {
    switch (operator) {
      case "+":
        return first + second;
      case "-":
        return first - second;
      case "×":
        return first * second;
      case "/":
        return first / second;
      default:
        return second;
    }
  }

  function updateDisplay() {
    let displayValue;

    if (firstOperand !== null && operator !== null) {
      if (waitingForSecondOperand) {
        displayValue = `${firstOperand} ${operator}`;
      } else {
        displayValue = `${firstOperand} ${operator} ${currentInput}`;
      }
    } else {
      displayValue = currentInput;
    }

    if (displayValue.length > 20) {
      const num = parseFloat(displayValue);
      display.textContent = Number.isInteger(num)
        ? num.toExponential(5)
        : num.toPrecision(8);
    } else {
      display.textContent = displayValue;
    }
  }
});
