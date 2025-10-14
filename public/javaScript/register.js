console.log("hello");
const form = document.getElementById("form");
const message = document.getElementById("message");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

//real-time border color changer
function inputHandler(e) {
  const input = e.target;
  if (input.value.trim() !== "") {
    input.classList.remove("boxBorder");
  }
}
usernameInput.addEventListener("input", inputHandler);
passwordInput.addEventListener("input", inputHandler);

async function registerFunc(e) {
  e.preventDefault();

  //get values from the form
  const formData = new FormData(e.target);
  const username = formData.get("username").trim();
  const password = formData.get("password").trim();
  let data = { username, password };

  //check for missing part
  if (!username || !password) {
    if (!username && !password) {
      message.textContent = "Username and password are required!";
      usernameInput.classList.add("boxBorder");
      passwordInput.classList.add("boxBorder");
    } else if (!username) {
      usernameInput.classList.add("boxBorder");
      message.textContent = "Username is required!";
    } else if (!password) {
      passwordInput.classList.add("boxBorder");
      message.textContent = "Password is required!";
    }
    message.style.color = "red";
    return;
  }

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.text();
  message.textContent = result;
  message.style.color = "green";

  //redirect to welcome page
  // setTimeout(()=>{}, 2000)
  if (result.includes("Registered successfully"))
    window.location.href = "/login.html";

  //clear the form fields
  if (response.ok) e.target.reset();
}
form.addEventListener("submit", registerFunc);
