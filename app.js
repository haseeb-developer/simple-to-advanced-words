document.addEventListener("DOMContentLoaded", function () {
  const expressionForm = document.getElementById("expression-form");
  const addExpressionBtn = document.getElementById("add-expression");
  const searchBtn = document.getElementById("search-btn");
  const clearBtn = document.getElementById("clear-btn");
  const expressionTableBody = document.getElementById("expression-body");
  const searchInput = document.getElementById("search-input");
  const errorMessage = document.getElementById("error-message");
  const deleteAllBtn = document.getElementById("delete-all");
  const entryCount = document.getElementById("count");
  const historyTableBody = document.getElementById("history-body");
  const clearHistoryBtn = document.getElementById("clear-history");

  let expressions = [];
  let history = [];

  addExpressionBtn.addEventListener("click", addExpression);
  expressionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addExpression();
  });
  searchBtn.addEventListener("click", filterExpressions);
  clearBtn.addEventListener("click", clearFilter);
  deleteAllBtn.addEventListener("click", confirmDeleteAll);
  clearHistoryBtn.addEventListener("click", clearHistory);

  loadExpressions();
  loadHistory();

  function addExpression() {
    const expressionInput = capitalizeFirstLetter(
      document.getElementById("expressions").value.trim()
    );
    const advancedWordsInput = capitalizeFirstLetter(
      document.getElementById("advanced-words").value.trim()
    );

    if (expressionInput === "" || advancedWordsInput === "") {
      alert("Please fill in both fields.");
      return;
    }

    expressions.push({
      id: expressions.length + 1,
      expression: expressionInput,
      advancedWords: advancedWordsInput,
    });
    renderExpressions();
    expressionForm.reset();
    saveExpressions();
    updateEntryCount();
  }

  // Function to capitalize the first letter of a string
  function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }

  // Function to render all expressions
  function renderExpressions() {
    expressionTableBody.innerHTML = "";
    expressions.forEach((expression, index) => {
      const row = `<tr>
                    <td>${index + 1}</td>
                    <td>${expression.expression}</td>
                    <td>${expression.advancedWords}</td>
                    <td><button class="delete-expression" data-index="${index}">Delete</button></td>
                  </tr>`;
      expressionTableBody.insertAdjacentHTML("beforeend", row);
    });

    addDeleteEventListeners();
  }

  // Function to add event listeners to delete buttons
  function addDeleteEventListeners() {
    document.querySelectorAll(".delete-expression").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        const deletedEntry = expressions[index];
        expressions.splice(index, 1);
        renderExpressions();
        saveExpressions();
        updateEntryCount();
        addToHistory(deletedEntry);
      });
    });
  }

  // Function to add entry to history
  function addToHistory(deletedEntry) {
    history.push(deletedEntry);
    renderHistory();
    saveHistory();
  }

  // Function to render the history table
  function renderHistory() {
    historyTableBody.innerHTML = "";
    history.forEach((entry) => {
      const row = `<tr>
                    <td>${entry.id}</td>
                    <td>${entry.expression}</td>
                    <td>${entry.advancedWords}</td>
                    <td><button class="delete-from-history" data-id="${entry.id}">Delete</button></td>
                  </tr>`;
      historyTableBody.insertAdjacentHTML("beforeend", row);
    });

    addDeleteFromHistoryEventListeners();
  }

  // Function to add event listeners to delete buttons in history
  function addDeleteFromHistoryEventListeners() {
    document.querySelectorAll(".delete-from-history").forEach((button) => {
      button.addEventListener("click", function () {
        const id = parseInt(this.getAttribute("data-id"));
        const index = history.findIndex((entry) => entry.id === id);
        history.splice(index, 1);
        renderHistory();
        saveHistory();
      });
    });
  }

  // Function to filter expressions
  function filterExpressions() {
    const searchText = searchInput.value.toLowerCase();
    const filteredExpressions = expressions.filter((expression) => {
      return expression.expression.toLowerCase().includes(searchText);
    });
    renderFilteredExpressions(filteredExpressions);
  }

  // Function to render filtered expressions
  function renderFilteredExpressions(filteredExpressions) {
    expressionTableBody.innerHTML = "";
    if (filteredExpressions.length === 0) {
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";
      filteredExpressions.forEach((expression, index) => {
        const row = `<tr>
                      <td>${index + 1}</td>
                      <td>${expression.expression}</td>
                      <td>${expression.advancedWords}</td>
                      <td><button class="delete-expression" data-index="${expressions.indexOf(
                        expression
                      )}">Delete</button></td>
                    </tr>`;
        expressionTableBody.insertAdjacentHTML("beforeend", row);
      });
    }

    addDeleteEventListeners();
  }

  // Function to clear search filter
  function clearFilter() {
    searchInput.value = "";
    renderExpressions();
  }

  // Function to confirm deletion of all entries
  function confirmDeleteAll() {
    const confirmDelete = confirm(
      "Are you sure you want to delete all entries?"
    );
    if (confirmDelete) {
      deleteAllExpressions();
    }
  }

  // Function to delete all expressions
  function deleteAllExpressions() {
    expressions = [];
    renderExpressions();
    saveExpressions();
    updateEntryCount();
  }

  // Function to clear history
  function clearHistory() {
    const confirmClear = confirm("Are you sure you want to clear history?");
    if (confirmClear) {
      history = [];
      renderHistory();
      saveHistory();
    }
  }

  // Function to save expressions to localStorage
  function saveExpressions() {
    localStorage.setItem("expressions", JSON.stringify(expressions));
  }

  // Function to load expressions from localStorage
  function loadExpressions() {
    const savedExpressions = localStorage.getItem("expressions");
    if (savedExpressions) {
      expressions = JSON.parse(savedExpressions);
      if (expressions.length > 0) {
        renderExpressions();
      }
    }
  }

  // Function to save history to localStorage
  function saveHistory() {
    localStorage.setItem("history", JSON.stringify(history));
  }

  // Function to load history from localStorage
  function loadHistory() {
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
      history = JSON.parse(savedHistory);
      if (history.length > 0) {
        renderHistory();
      }
    }
  }

  // Function to update entry count
  function updateEntryCount() {
    entryCount.textContent = "Total entries: " + expressions.length;
  }
});
