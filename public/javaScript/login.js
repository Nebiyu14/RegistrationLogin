const form = document.querySelector(".loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
console.log("Hello");

//input box color controller
form.addEventListener("input", inputHandler);
function inputHandler(e) {
  const input = e.target;
  if (input.value !== "") {
    usernameInput.classList.remove("boxBorder");
    passwordInput.classList.remove("boxBorder");
  }
}

//event listener
async function loginHandler(e) {
  e.preventDefault();
  const formData = new FormData(e.target);

  const username = formData.get("username");
  const password = formData.get("password");
  //   console.log("Üser name", username);
  //check for missing part
  if (!username || !password) {
    if (!username && !password) {
      message.textContent = "Username and password are required!";
      usernameInput.classList.add("boxBorder");
      passwordInput.classList.add("boxBorder");
    } else if (!username) {
      usernameInput.classList.add("boxBorder");
      message.textContent = "Username is missing!";
    } else if (!password) {
      passwordInput.classList.add("boxBorder");
      message.textContent = "Password is missing!";
    }
    message.style.color = "red";
    return;
  }
  const data = { username, password };
  try {
    let response = await fetch("/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });
    let result = await response.text();
    message.innerText = result;
    message.style.color = "red";
    //redirect to welcome page
    if(result.includes("Login successful"))
      window.location.href = "/welcome.html"
  } catch (error) {
    console.log(error);
    message.textContent = "Error occurred while logging in";
    message.style.color = "red";
  }
}
form.addEventListener("submit", loginHandler);
