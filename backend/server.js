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

// Database connection pool - localdb
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "project_queue",
//   waitForConnections: true,
// });

// hosted VPS DB
const pool = mysql.createPool({
  host: "194.163.171.205",
  user: "project_queue",
  password: "project_queue123",
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

app.post("/api/institutions", async (req, res) => {
  try {
    const {
      office_name,
      department_or_ministry,
      office_type,
      office_address,
      district,
      official_email,
      office_phone,
      working_days,
    } = req.body;

    // Validation
    if (
      !office_name ||
      !department_or_ministry ||
      !office_type ||
      !office_address ||
      !district ||
      !official_email ||
      !working_days ||
      !Array.isArray(working_days) ||
      working_days.length === 0
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [result] = await pool.query(
      `INSERT INTO institutions 
      (office_name, department_or_ministry, office_type, office_address, district, official_email, office_phone, working_days) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        office_name,
        department_or_ministry,
        office_type,
        office_address,
        district,
        official_email,
        office_phone || null,
        working_days.join(","), // store as comma-separated string
      ]
    );

    res.status(201).json({
      message: "Institution added successfully",
      institutionId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/admin-access", async (req, res) => {
  try {
    const {
      username,
      fullName,
      officialEmail,
      password,
      confirmPassword,
      officialTitle,
      employeeId,
      mobileNumber,
      alternativeContact,
      registeredInstitution,
    } = req.body;

    // Only check the absolutely required fields
    if (
      !username?.trim() ||
      !fullName?.trim() ||
      !officialEmail?.trim() ||
      !password?.trim() ||
      !confirmPassword?.trim()
    ) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table
    const [result] = await pool.query(
      `INSERT INTO users 
        (username, full_name, email, password, type, official_title, employee_id, mobile_number, alternative_contact, registered_institution) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,                // username
        fullName,                // full_name
        officialEmail,           // email
        hashedPassword,          // password
        1,                       // type: admin
        officialTitle || null,   // optional
        employeeId || null,      // optional
        mobileNumber || null,    // optional
        alternativeContact || null, // optional
        registeredInstitution || null // optional
      ]
    );

    res.status(201).json({
      message: "Admin access registered successfully",
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


app.get("/api/fetch_institutions", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, office_name FROM institutions ORDER BY office_name ASC`
    );

    res.status(200).json({
      institutions: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/api/services", async (req, res) => {
  try {
    const {
      service_name,
      institution_id,
      service_description,
      appointment_duration,
      daily_capacity,
      days_of_week,
    } = req.body;

    if (
      !service_name?.trim() ||
      !institution_id ||
      !appointment_duration ||
      !daily_capacity ||
      !Array.isArray(days_of_week) ||
      days_of_week.length === 0
    ) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const [result] = await pool.query(
      `INSERT INTO services
        (service_name, institution_id, service_description, appointment_duration, daily_capacity, days_of_week)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        service_name,
        institution_id,
        service_description || null,
        appointment_duration,
        daily_capacity,
        days_of_week.join(","),
      ]
    );

    res.status(201).json({
      message: "Service created successfully",
      serviceId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});



app.get("/api/fetch_services", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         s.id,
         s.service_name,
         s.service_description,
         s.appointment_duration,
         s.daily_capacity,
         s.days_of_week,
         i.office_name AS institution_name
       FROM services s
       JOIN institutions i ON s.institution_id = i.id
       ORDER BY s.id DESC`
    );

    res.json({ services: rows });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});



app.listen(5000, () => console.log("Server running on port 5000"));
