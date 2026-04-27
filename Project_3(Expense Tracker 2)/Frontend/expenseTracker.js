(function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentPage = window.location.pathname;

  if (isLoggedIn !== "true" && !currentPage.includes("login.html")) {
    window.location.href = "login.html";
  }

  if (isLoggedIn === "true" && currentPage.includes("login.html")) {
    window.location.href = "index.html";
  }
})();

const logout = () => {
  localStorage.removeItem("isLoggedIn");
  window.location.replace("login.html");
};

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

//ADD EXPENSE
let form = document.getElementById("expenseForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const expense = {
      id: Date.now() + Math.random(),
      name,
      amount,
      category,
      date,
    };

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    alert("Expense added");
    form.reset();
  });
}

//DISPLAY EXPENSE
let table = document.getElementById("table");
if (table) {
  displayExpenses();
}

function displayExpenses() {
  table.innerHTML = "";
  let total = 0;

  expenses.forEach(function (e, index) {
    total += Number(e.amount);
    let row = table.insertRow();

    row.insertCell(0).innerHTML = e.name;
    row.insertCell(1).innerHTML = e.amount;
    row.insertCell(2).innerHTML = e.category;
    row.insertCell(3).innerHTML = e.date;
    row.insertCell(4).innerHTML =
      "<button onclick='editExpense(" + index + ")'>Edit</button>";
    row.insertCell(5).innerHTML =
      "<button onclick='deleteExpense(" + index + ")'>Delete</button>";
  });

  document.getElementById("total").innerHTML = total;
}

//DELETE EXPENSE
const deleteExpense = (index) => {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  displayExpenses();
};

//LOAD CLICKED EXPENSE TO UPDATE
let editIndex = -1;
function editExpense(index) {
  editIndex = index;
  let e = expenses[index];

  document.getElementById("editName").value = e.name;
  document.getElementById("editAmount").value = e.amount;
  document.getElementById("editCategory").value = e.category;
  document.getElementById("editDate").value = e.date;
  document.getElementById("editBox").style.display = "block";
}

//UPDATE EXPENSE
function updateExpense() {
  expenses[editIndex].name = document.getElementById("editName").value;
  expenses[editIndex].amount = document.getElementById("editAmount").value;
  expenses[editIndex].category = document.getElementById("editCategory").value;
  expenses[editIndex].date = document.getElementById("editDate").value;

  localStorage.setItem("expenses", JSON.stringify(expenses));

  displayExpenses();
  closeEdit();
}

function closeEdit() {
  document.getElementById("editBox").style.display = "none";
}

//SORT EXPENSE BY PRICE
function sortExpense(type) {
  if (type == "low") {
    expenses.sort((a, b) => a.amount - b.amount);
  }

  if (type == "high") {
    expenses.sort((a, b) => b.amount - a.amount);
  }

  displayExpenses();
}

//CHANGE THEME
function darkMode() {
  document.body.className = "dark";
}

function lightMode() {
  document.body.className = "";
}

//SEARCH BY CATEGORY
const getSearchMatches = (data, term) => {
  return data.filter((expense) =>
    expense.name.toLowerCase().includes(term.toLowerCase()),
  );
};

const getCategoryMatches = (data, category) => {
  if (category === "All") return data;
  return data.filter((expense) => expense.category === category);
};

const filterExpenses = () => {
  const searchTerm = document.getElementById("searchInput").value;
  const selectedCategory = document.getElementById("categoryFilter").value;

  let filteredResults = expenses;

  filteredResults = getSearchMatches(filteredResults, searchTerm);
  filteredResults = getCategoryMatches(filteredResults, selectedCategory);

  loadTable(filteredResults);
};

//LOAD TABLE AFTER FILTERING
const loadTable = (dataArray) => {
  const table = document.getElementById("table");
  table.innerHTML = "";
  let total = 0;

  dataArray.forEach(({ id, name, amount, category, date }) => {
    total += Number(amount);
    let row = table.insertRow();
    row.insertCell(0).innerHTML = name;
    row.insertCell(1).innerHTML = `₹${amount}`;
    row.insertCell(2).innerHTML = category;
    row.insertCell(3).innerHTML = date;
    row.insertCell(4).innerHTML =
      `<button onclick="editExpense(${id})">Edit</button>`;
    row.insertCell(5).innerHTML =
      `<button onclick="deleteExpense(${id})">Delete</button>`;
  });

  document.getElementById("total").innerHTML = total;
};

//TO GENERATE MONTHLY REPORT
const generateMonthlyReport = () => {
  const selectedMonth = document.getElementById("monthPicker").value;
  if (!selectedMonth) return;

  const monthlyData = expenses.filter((exp) =>
    exp.date.startsWith(selectedMonth),
  );

  const total = monthlyData.reduce(
    (sum, { amount }) => sum + Number(amount),
    0,
  );
  document.getElementById("monthlyTotal").innerText = `₹ ${total}`;

  const reportTotals = monthlyData.reduce((acc, { category, amount }) => {
    acc[category] = (acc[category] || 0) + Number(amount);
    return acc;
  }, {});

  laodMonthlyChart(reportTotals);
  loadMonthlyText(reportTotals);
  loadMonthlyTable(monthlyData);
};

//LOAD PIE CHART
let myChart = null;
const laodMonthlyChart = (data) => {
  const ctx = document.getElementById("monthlyChart").getContext("2d");

  if (myChart) myChart.destroy();

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
};

//LOAD MONTHLY REPOERT CATEGORY WISE
const loadMonthlyText = (data) => {
  const container = document.getElementById("monthlySummary");
  let html = "<h3 style='margin-bottom:15px;'>Category Breakdown</h3>";

  for (let cat in data) {
    html += `
      <div class="category-item">
        <span>${cat}</span>
        <strong>₹${data[cat]}</strong>
      </div>`;
  }

  container.innerHTML = html;
};

//LOAD MONTHLY EXPENSES
const loadMonthlyTable = (data) => {
  const tableBody = document.getElementById("monthlyTableBody");
  tableBody.innerHTML = "";

  data.forEach(({ name, amount, category, date }) => {
    let row = tableBody.insertRow();
    row.insertCell(0).innerHTML = name;
    row.insertCell(1).innerHTML = `₹${amount}`;
    row.insertCell(2).innerHTML = category;
    row.insertCell(3).innerHTML = date;
  });
};
