let users = ["john", "alex", "rahul", "admin"];

let form = document.getElementById("userForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let username = document.getElementById("username").value;
  username = username.toLowerCase();
  let result = document.getElementById("result");

  let error = document.getElementById("error");
  if (username == "") {
    error.innerHTML = "Enter Username";
    error.style.color = "red";
    return;
  }

  if (users.includes(username)) {
    result.innerHTML = "Username Already Taken";
    result.style.color = "red";
  } else {
    result.innerHTML = "Username Available and Registered";
    result.style.color = "green";
    users.push(username);
  }

  form.reset();
});

function showUsers() {
  let list = document.getElementById("userList");
  let title = document.getElementById("userTitle");
  list.innerHTML = "";

  title.innerHTML = "Registered Users";

  users.forEach(function (u) {
    let li = document.createElement("li");
    li.innerHTML = u;
    list.appendChild(li);
  });

  document.getElementById("closeBtn").style.display = "block";
}

function hideUsers() {
  document.getElementById("userList").innerHTML = "";
  document.getElementById("userTitle").innerHTML = "";
  document.getElementById("closeBtn").style.display = "none";
}
