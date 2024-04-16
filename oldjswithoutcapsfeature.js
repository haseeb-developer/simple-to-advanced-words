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

  let expressions = [];
  let filteredExpressions = [];

  addExpressionBtn.addEventListener("click", addExpression);
  expressionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addExpression();
  });
  searchBtn.addEventListener("click", filterExpressions);
  clearBtn.addEventListener("click", clearFilter);
  deleteAllBtn.addEventListener("click", confirmDeleteAll);

  loadExpressions();

  function addExpression() {
    const expressionInput = document.getElementById("expressions").value.trim();
    const advancedWordsInput = document
      .getElementById("advanced-words")
      .value.trim();

    if (expressionInput === "" || advancedWordsInput === "") {
      alert("Please fill in both fields.");
      return;
    }

    expressions.push({
      expression: expressionInput,
      advancedWords: advancedWordsInput,
    });
    renderExpressions();
    expressionForm.reset();
    saveExpressions();
    updateEntryCount();
  }

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

    document.querySelectorAll(".delete-expression").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        expressions.splice(index, 1);
        renderExpressions();
        saveExpressions();
        updateEntryCount();
      });
    });
  }

  function filterExpressions() {
    const searchText = searchInput.value.toLowerCase();
    filteredExpressions = expressions.filter((expression) => {
      return expression.expression.toLowerCase().includes(searchText);
    });
    renderFilteredExpressions(filteredExpressions);
  }

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

    document.querySelectorAll(".delete-expression").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        expressions.splice(index, 1);
        renderExpressions();
        saveExpressions();
        updateEntryCount();
      });
    });
  }

  function clearFilter() {
    searchInput.value = "";
    renderExpressions();
  }

  function confirmDeleteAll() {
    const confirmDelete = confirm(
      "Are you sure you want to delete all entries?"
    );
    if (confirmDelete) {
      deleteAllExpressions();
    }
  }

  function deleteAllExpressions() {
    expressions = [];
    renderExpressions();
    saveExpressions();
    updateEntryCount();
  }

  function saveExpressions() {
    localStorage.setItem("expressions", JSON.stringify(expressions));
  }

  function loadExpressions() {
    const savedExpressions = localStorage.getItem("expressions");
    if (savedExpressions) {
      expressions = JSON.parse(savedExpressions);
      renderExpressions();
      updateEntryCount();
    }
  }

  function updateEntryCount() {
    entryCount.textContent = "Total entries: " + expressions.length;
  }
});
