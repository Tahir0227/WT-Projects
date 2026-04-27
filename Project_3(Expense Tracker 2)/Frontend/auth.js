const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (isValid()) {
      if (user === "admin" && pass === "123456") {
        localStorage.setItem("isLoggedIn", "true");
        window.location.replace("index.html");
      } else {
        document.getElementById("loginError").innerHTML =
          "Invalid username or password";
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
