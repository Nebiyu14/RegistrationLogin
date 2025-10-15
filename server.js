require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
//middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// connect to the database
const database = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.db_PASSWORD,
  database: process.env.DB_NAME,
});
database.connect();

//routing: checking GET
app.get("/", (req, res) => {
  window.location.href = "index.html"
  res.send("Welcome to the registeration form - from Backend!");
});

//routing: registering
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  //check for username and passowrd filled or not
  if (!username || !password)
    return res.send("Username and password required.");

  //check whether the user already registered or not by using username
  const hashedPassword = await bcrypt.hash(password, 10);
  const checkUser = "SELECT * FROM users WHERE username = ?";
  database.query(checkUser, [username], (error, result) => {
    // console.log("Result length: ", result.length);
    // console.log("Result output: ", result);
    // console.log("Username is: ", result[0].username);
    if (error) return res.send("Database error");
    if (result.length > 0) return res.send("⚠️ User already exists");

    //register the new comers/users
    const newUser = "INSERT INTO users (username, password) VALUES (?, ?)";
    database.query(newUser, [username, hashedPassword], (error, result) => {
      if (error) return res.send("Error saving user");
      res.send(`✅ Registered successfully! Welcome🙋‍♂️, ${username}!`);
    });
  });
});

//routing: login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const userLogin = `SELECT * FROM users WHERE username = ?`;
  database.query(userLogin, [username], async (error, result) => {
    if (error) return res.send("Database error", error);
    if (result.length == 0) return res.send("User Not Found");
    const validPassword = await bcrypt.compare(password, result[0].password);
    console.log("password checking: ", validPassword);
    if (!validPassword) return res.send("Incorrect password ❌⚠️");
    //save username in session
    req.session.username = username;
    return res.send(`✅Login successful! \nWelcome back, ${username}!`);
  });
});

//routing: check logged in user
app.get("/me", (req, res) => {
  if (req.session.username) res.json({ username: req.session.username });
  else res.json({ username: null });
});

//routing: logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    return res.send("Logged out!");
  });
});

//connect to the port
const PORT = process.env.PORT || 5002;
app.listen(PORT, (error) => {
  if (error) {
    console.log("Can't connect to server", error);
    return;
  }
  console.log(`The server is running...http://localhost:${PORT}`);
});
