const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // your frontend origin exactly
  credentials: true,
}));

app.use(bodyParser.json());

// Database connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "project_queue",
  waitForConnections: true,
});

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const sessionStore = new MySQLStore({}, pool.promise ? pool.promise() : pool); // connect store to your pool

app.use(session({
  key: 'user_sid',
  secret: 'your_secret_key', // change to a strong secret
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 day session
    httpOnly: true,
  }
}));

// Sign up route
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (username, email, password, type) VALUES (?, ?, ?, 2)`,
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Username or email already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login route without session
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const [rows] = await pool.query(
      `SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1`,
      [username, username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username/email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username/email or password" });
    }

    // Save user info in session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      type: user.type,
    };

    res.json({
      message: "Login successful",
      userId: user.id,
      username: user.username,
      email: user.email,
      type: user.type,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie('user_sid');
    res.json({ message: "Logout successful" }); // ✅ No redirect here
  });
});


app.get("/api/session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/api/add-inquiries", async (req, res) => {
  try {
    const { name, email, inquiry } = req.body; // POST data from frontend

    if (!name || !email || !inquiry) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save to database
    const [result] = await pool.query(
      `INSERT INTO inquiries (name, email, inquiry) VALUES (?, ?, ?)`,
      [name, email, inquiry]
    );

    console.log("New inquiry saved:", { name, email, inquiry });

    res.status(200).json({ message: "Inquiry submitted successfully", id: result.insertId });
  } catch (err) {
    console.error("Error saving inquiry:", err);
    res.status(500).json({ error: "Server error" });
  }
});




app.listen(5000, () => console.log("Server running on port 5000"));
