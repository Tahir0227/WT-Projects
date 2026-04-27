let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let form = document.getElementById("expenseForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let amount = document.getElementById("amount").value;
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;

    let expense = {
      name: name,
      amount: amount,
      category: category,
      date: date,
    };

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    alert("Expense Added");

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

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  displayExpenses();
}

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
