let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

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

const deleteExpense = (index) => {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  displayExpenses();
};

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

function sortExpense(type) {
  if (type == "low") {
    expenses.sort(function (a, b) {
      return a.amount - b.amount;
    });
  }

  if (type == "high") {
    expenses.sort(function (a, b) {
      return b.amount - a.amount;
    });
  }

  displayExpenses();
}

function darkMode() {
  document.body.className = "dark";
}

function lightMode() {
  document.body.className = "";
}

const filterExpenses = () => {
  // 1. Get values from the DOM
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;

  // 2. Use the filter() method to find matches
  const filtered = expenses.filter((expense) => {
    const matchesName = expense.name.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory === "All" || expense.category === selectedCategory;

    return matchesName && matchesCategory; // Only return if both are true
  });

  // 3. Render only the filtered results
  renderTable(filtered);
};

// We need a helper function to render the table so we don't repeat code
const renderTable = (dataArray) => {
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

let myChart = null;

const generateMonthlyReport = () => {
  const selectedMonth = document.getElementById("monthPicker").value;
  if (!selectedMonth) return;

  // 1. Filter: Extract only this month's data [cite: 169, 170]
  const monthlyData = expenses.filter((exp) =>
    exp.date.startsWith(selectedMonth),
  );

  // 2. Reduce: Create category totals for the chart [cite: 171, 172]
  const reportTotals = monthlyData.reduce((acc, { category, amount }) => {
    acc[category] = (acc[category] || 0) + Number(amount);
    return acc;
  }, {});

  renderMonthlyChart(reportTotals);
  renderMonthlyText(reportTotals);
  renderMonthlyTable(monthlyData); // New function call
};

const renderMonthlyChart = (data) => {
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

// Add this function to your expenseTracker.js
const renderMonthlyText = (data) => {
  const container = document.getElementById("monthlySummary");
  let html = "<h3 style='margin-bottom:15px;'>Category Breakdown</h3>";

  // Object Loop to iterate through processed data [cite: 212, 214]
  for (let cat in data) {
    html += `
      <div class="category-item">
        <span>${cat}</span>
        <strong>₹${data[cat]}</strong>
      </div>`;
  }

  // Handle empty state [cite: 198, 200]
  if (Object.keys(data).length === 0) {
    html =
      "<p style='text-align:center;'>No expenses found for this month.</p>";
  }

  container.innerHTML = html;
};

const renderMonthlyTable = (data) => {
  const tableBody = document.getElementById("monthlyTableBody");
  tableBody.innerHTML = ""; // DOM Manipulation [cite: 223]

  // Use forEach to iterate through the filtered array [cite: 209]
  data.forEach(({ name, amount, category, date }) => {
    let row = tableBody.insertRow();
    row.insertCell(0).innerHTML = name;
    row.insertCell(1).innerHTML = `₹${amount}`;
    row.insertCell(2).innerHTML = category;
    row.insertCell(3).innerHTML = date;
  });
};
