const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (isValid()) {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        alert("Login Successfully");
        window.location.href = "index.html";
      } else {
        document.getElementById("loginError").innerText = data.message;
      }
    }
  });
}

function isValid() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  let valid = true;

  document.getElementById("userError").innerHTML = "";
  document.getElementById("passError").innerHTML = "";
  document.getElementById("loginError").innerHTML = "";

  if (user === "") {
    document.getElementById("userError").innerHTML = "Username is required";
    valid = false;
  }

  if (pass === "") {
    document.getElementById("passError").innerHTML = "Password is required";
    valid = false;
  } else if (pass.length < 6) {
    document.getElementById("passError").innerHTML =
      "Password must be at least 6 characters";
    valid = false;
  }

  return valid;
}
