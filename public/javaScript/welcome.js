const user = document.querySelector("#user");
const body = document.body;
const logoutBtn = document.querySelector("#logoutBtn");

async function getUser() {
  let response = await fetch("/me");
  let data = await response.json();
  if (!data.username) {
    console.log("No account with this usermane");
    window.location.href = "/login.html";
  } else {
    user.textContent = `Hello ${data.username} welcome to ASTU`;
  }
}
getUser();

//logout
logoutBtn.addEventListener("click", logoutFunc);

async function logoutFunc() {
  let res = await fetch("/logout");
  result = await res.text();
  user.textContent = result;
  alert("Logging out");
  console.log(result);
  setTimeout(() => {
    window.location.href = "/login.html";
  }, 3000);
}
