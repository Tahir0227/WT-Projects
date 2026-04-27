let allExpenses = [];

(function () {
  const token = localStorage.getItem("token");

  if (!token && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
  }
})();

const logout = () => {
  localStorage.removeItem("token");
  window.location.replace("login.html");
};

//ADD EXPENSE
let form = document.getElementById("expenseForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/expenses/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        name,
        amount,
        category,
        date,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      alert("Expense Added");
      form.reset();
    }
  });
}

//DISPLAY EXPENSE
async function displayExpenses() {
  const table = document.getElementById("table");
  if (!table) return;

  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:3000/expenses/list", {
      headers: { token: token },
    });
    const data = await response.json();
    allExpenses = data.expenses || [];
    renderTable(allExpenses);
  } catch (err) {
    console.error("Error loading expenses:", err);
  }
}

//render table
function renderTable(expenses) {
  const table = document.getElementById("table");
  if (!table) return;

  table.innerHTML = "";
  let total = 0;

  expenses.forEach((expense) => {
    total += Number(expense.amount);

    let row = table.insertRow();
    row.insertCell(0).innerHTML = expense.name;
    row.insertCell(1).innerHTML = "₹" + expense.amount;
    row.insertCell(2).innerHTML = expense.category;
    row.insertCell(3).innerHTML = expense.date.split("T")[0];

    row.insertCell(4).innerHTML =
      `<button onclick="editExpense(${expense.expense_id}, '${expense.name}', ${expense.amount}, '${expense.category}', '${cleanDate}')" style="background: #ffc107; color: black;">Edit</button>`;

    row.insertCell(5).innerHTML =
      `<button onclick="deleteExpense(${expense.expense_id})">Delete</button>`;
  });

  const totalEl = document.getElementById("total");
  if (totalEl) totalEl.innerText = total;
}

//DELETE EXPENSE
async function deleteExpense(id) {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:3000/expenses/delete/${id}`, {
    method: "DELETE",
    headers: {
      token: token,
    },
  });

  displayExpenses();
}

//LOAD CLICKED EXPENSE TO UPDATE
let editId = null;

function editExpense(id, name, amount, category, date) {
  editId = id;

  document.getElementById("editBox").style.display = "block";

  document.getElementById("editName").value = name;
  document.getElementById("editAmount").value = amount;
  document.getElementById("editCategory").value = category;
  document.getElementById("editDate").value = date;
}

//UPDATE EXPENSE
async function updateExpense() {
  const token = localStorage.getItem("token");

  const updatedExpense = {
    name: document.getElementById("editName").value,
    amount: document.getElementById("editAmount").value,
    category: document.getElementById("editCategory").value,
    date: document.getElementById("editDate").value,
  };

  try {
    await fetch(`http://localhost:3000/expenses/update/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(updatedExpense),
    });

    displayExpenses();
    closeEdit();
  } catch (err) {
    console.log(err);
  }
}

function closeEdit() {
  document.getElementById("editBox").style.display = "none";
}

//SORT EXPENSE BY PRICE
function sortExpense(type) {
  let sortedExpenses = [...allExpenses];

  if (type === "low") {
    sortedExpenses.sort((a, b) => a.amount - b.amount);
  }

  if (type === "high") {
    sortedExpenses.sort((a, b) => b.amount - a.amount);
  }

  renderTable(sortedExpenses);
}

//CHANGE THEME
function darkMode() {
  document.body.className = "dark";
}

function lightMode() {
  document.body.className = "";
}

//SEARCH BY CATEGORY
function filterExpenses() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  const selectedCategory = document.getElementById("categoryFilter").value;

  let filtered = allExpenses.filter((expense) => {
    const matchName = expense.name.toLowerCase().includes(searchTerm);

    const matchCategory =
      selectedCategory === "All" || expense.category === selectedCategory;

    return matchName && matchCategory;
  });

  renderTable(filtered);
}

//TO GENERATE MONTHLY REPORT
let myChart = null;

async function generateMonthlyReport() {
  const selectedMonth = document.getElementById("monthPicker").value;

  if (!selectedMonth) return;

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/expenses/list", {
      headers: {
        token: token,
      },
    });

    const data = await response.json();

    const monthlyData = data.expenses.filter((exp) =>
      exp.date.startsWith(selectedMonth),
    );

    let total = 0;

    monthlyData.forEach((exp) => {
      total += Number(exp.amount);
    });

    document.getElementById("monthlyTotal").innerText = "₹ " + total;

    /******** CATEGORY TOTALS ********/
    const reportTotals = {};

    monthlyData.forEach((exp) => {
      if (!reportTotals[exp.category]) {
        reportTotals[exp.category] = 0;
      }

      reportTotals[exp.category] += Number(exp.amount);
    });

    loadMonthlyChart(reportTotals);

    loadMonthlyText(reportTotals);

    loadMonthlyTable(monthlyData);
  } catch (err) {
    console.log(err);
  }
}

//LOAD PIE CHART
function loadMonthlyChart(data) {
  const ctx = document.getElementById("monthlyChart").getContext("2d");

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data),
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffce56",
            "#4bc0c0",
            "#9966ff",
          ],
        },
      ],
    },
  });
}

//LOAD MONTHLY REPOERT CATEGORY WISE
function loadMonthlyText(data) {
  const container = document.getElementById("monthlySummary");

  let html = "<h3>Category Breakdown</h3>";

  for (let cat in data) {
    html += `
      <div class="category-item">
        <span>${cat}</span>
        <strong>₹${data[cat]}</strong>
      </div>
    `;
  }

  container.innerHTML = html;
}

//LOAD MONTHLY EXPENSES
function loadMonthlyTable(data) {
  const tableBody = document.getElementById("monthlyTableBody");

  tableBody.innerHTML = "";

  data.forEach((exp) => {
    let row = tableBody.insertRow();

    row.insertCell(0).innerHTML = exp.name;
    row.insertCell(1).innerHTML = "₹" + exp.amount;
    row.insertCell(2).innerHTML = exp.category;
    row.insertCell(3).innerHTML = exp.date.split("T")[0];
  });
}

async function loadHomeTotal() {
  const token = localStorage.getItem("token");
  const homeTotalDisplay = document.getElementById("homeTotal");

  if (!homeTotalDisplay || !token) return;

  try {
    const response = await fetch("http://localhost:3000/expenses/list", {
      headers: { token: token },
    });
    const data = await response.json();

    if (data.status === "success") {
      const total = data.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
      homeTotalDisplay.innerText = `₹ ${total.toLocaleString()}`;
    }
  } catch (err) {
    console.error("Error loading home total:", err);
  }
}

// Call it immediately
loadHomeTotal();
