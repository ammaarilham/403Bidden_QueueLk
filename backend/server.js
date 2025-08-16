// Required Libraries --------------------------------------------------
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend origin exactly
    credentials: true,
  })
);

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

app.use(
  session({
    key: "user_sid",
    secret: "your_secret_key", // change to a strong secret
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 day session
      httpOnly: true,
    },
  })
);

// Login/ Sign up / Logout functions  ----------------------------------------------------------

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Go one level up from backend
//     const dir = path.resolve(
//       __dirname,
//       "../public/assets/images/profile_pictures"
//     );
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     console.log("Saving profile pictures to:", dir);
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     const randomName = crypto.randomBytes(5).toString("hex");
//     const ext = path.extname(file.originalname);
//     cb(null, randomName + ext);
//   },
// });

// const upload = multer({ storage });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    if (file.fieldname === "profile_picture") {
      uploadPath = path.join(
        __dirname,
        "../public/assets/images/profile_pictures"
      );
    } else {
      uploadPath = path.join(
        __dirname,
        "../public/assets/images/other_documents"
      );
    }

    // Ensure folder exists
    fs.mkdirSync(uploadPath, { recursive: true });

    console.log(`Saving ${file.fieldname} to:`, uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

// Fetch logged-in user profile
app.get("/api/profile", async (req, res) => {
  try {
    if (!req.session.user)
      return res.status(401).json({ error: "Not logged in" });

    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      req.session.user.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post(
  "/api/profile/update",
  upload.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "nic_document", maxCount: 1 },
    { name: "birth_certificate_document", maxCount: 1 },
    { name: "driving_license_document", maxCount: 1 },
    { name: "other_document1", maxCount: 1 },
    { name: "other_document2", maxCount: 1 },
    { name: "other_document3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.session.user)
        return res.status(401).json({ error: "Not logged in" });

      const {
        full_name,
        official_title,
        employee_id,
        official_email,
        mobile_number,
        alternative_contact,
        registered_institution,
      } = req.body;

      // Prepare files
      const files = req.files || {};
      const profile_picture = files["profile_picture"]?.[0]?.filename || null;
      const nic_document = files["nic_document"]?.[0]?.filename || null;
      const birth_certificate_document =
        files["birth_certificate_document"]?.[0]?.filename || null;
      const driving_license_document =
        files["driving_license_document"]?.[0]?.filename || null;
      const other_document1 = files["other_document1"]?.[0]?.filename || null;
      const other_document2 = files["other_document2"]?.[0]?.filename || null;
      const other_document3 = files["other_document3"]?.[0]?.filename || null;

      // Update session if profile_picture uploaded
      if (req.session.user && profile_picture) {
        req.session.user.profile_picture = profile_picture;
      }

      // Build query dynamically
      const fields = [];
      const values = [];

      if (full_name) fields.push("full_name = ?") && values.push(full_name);
      if (official_title)
        fields.push("official_title = ?") && values.push(official_title);
      if (employee_id)
        fields.push("employee_id = ?") && values.push(employee_id);
      if (official_email)
        fields.push("official_email = ?") && values.push(official_email);
      if (mobile_number)
        fields.push("mobile_number = ?") && values.push(mobile_number);
      if (alternative_contact)
        fields.push("alternative_contact = ?") &&
          values.push(alternative_contact);
      if (registered_institution)
        fields.push("registered_institution = ?") &&
          values.push(registered_institution);

      if (profile_picture)
        fields.push("profile_picture = ?") && values.push(profile_picture);
      if (nic_document)
        fields.push("nic_document = ?") && values.push(nic_document);
      if (birth_certificate_document)
        fields.push("birth_certificate_document = ?") &&
          values.push(birth_certificate_document);
      if (driving_license_document)
        fields.push("driving_license_document = ?") &&
          values.push(driving_license_document);
      if (other_document1)
        fields.push("other_document1 = ?") && values.push(other_document1);
      if (other_document2)
        fields.push("other_document2 = ?") && values.push(other_document2);
      if (other_document3)
        fields.push("other_document3 = ?") && values.push(other_document3);

      if (fields.length === 0)
        return res.status(400).json({ error: "No fields to update" });

      const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
      values.push(req.session.user.id);

      await pool.query(sql, values);

      res.json({ message: "Profile updated successfully" });
    } catch (err) {
      console.error("Error in profile update route:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);
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
      return res
        .status(401)
        .json({ error: "Invalid username/email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Invalid username/email or password" });
    }

    // Save user info in session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      type: user.type,
      profile_picture: user.profile_picture || null,
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
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("user_sid");
    res.json({ message: "Logout successful" }); // ✅ No redirect here
  });
});

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
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Setting the session on the db  ----------------------------------------------------------

app.get("/api/session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Get & Fetch Inquiries ----------------------------------------------------------

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

    res
      .status(200)
      .json({ message: "Inquiry submitted successfully", id: result.insertId });
  } catch (err) {
    console.error("Error saving inquiry:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get & Fetch Institutions ----------------------------------------------------------

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

app.get("/api/fetch_all_institutions", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         id,
         office_name,
         department_or_ministry,
         office_type,
         office_address,
         district,
         official_email,
         office_phone,
         working_days
       FROM institutions
       ORDER BY id DESC`
    );

    // Convert working_days (comma-separated) into array for frontend
    const formatted = rows.map((inst) => ({
      ...inst,
      working_days: inst.working_days
        ? inst.working_days.split(",").map((d) => d.trim())
        : [],
    }));

    res.json({ institutions: formatted });
  } catch (err) {
    console.error("Error fetching institutions:", err);
    res.status(500).json({ error: "Failed to fetch institutions" });
  }
});

// Get & Fetch Services ----------------------------------------------------------

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

// Get & Fetch Users ----------------------------------------------------------

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
        username, // username
        fullName, // full_name
        officialEmail, // email
        hashedPassword, // password
        1, // type: admin
        officialTitle || null, // optional
        employeeId || null, // optional
        mobileNumber || null, // optional
        alternativeContact || null, // optional
        registeredInstitution || null, // optional
      ]
    );

    res.status(201).json({
      message: "Admin access registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/fetch_admin_records", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
     u.id,
     u.full_name,
     u.username AS username,
     u.email,
     u.mobile_number AS phone,
     u.type AS role,
     u.official_title,
     u.employee_id,
     u.alternative_contact,
     u.registered_institution,
     i.office_name AS institution_name
   FROM users u
   LEFT JOIN institutions i ON u.registered_institution = i.id
   WHERE u.type = 1
   ORDER BY u.id DESC`
    );

    res.json({ users: rows });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/fetch_customer_records", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
     u.id,
     u.full_name,
     u.username AS username,
     u.email,
     u.mobile_number AS phone,
     u.type AS role,
     u.official_title,
     u.employee_id,
     u.alternative_contact,
     u.registered_institution,
     i.office_name AS institution_name
   FROM users u
   LEFT JOIN institutions i ON u.registered_institution = i.id
   WHERE u.type = 2
   ORDER BY u.id DESC`
    );

    res.json({ users: rows });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// Get & Fetch Events ----------------------------------------------------------

app.post("/api/events", async (req, res) => {
  const {
    event_name,
    event_type,
    event_description,
    event_date,
    start_time,
    end_time,
    max_participants,
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO events 
      (event_name, event_type, event_description, event_date, start_time, end_time, max_participants) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        event_name,
        event_type,
        event_description,
        event_date,
        start_time,
        end_time,
        max_participants,
      ]
    );

    res
      .status(200)
      .json({ message: "Event added successfully", eventId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add event" });
  }
});

app.get("/api/fetch_events", async (req, res) => {
  try {
    const [events] = await pool.query(
      `SELECT 
          id, 
          event_name, 
          event_type, 
          event_description, 
          event_date, 
          start_time, 
          end_time, 
          max_participants
       FROM events
       ORDER BY event_date DESC, start_time ASC`
    );

    res.status(200).json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Get & Fetch Bookings ----------------------------------------------------------

// POST /api/add-booking
app.post("/api/add-booking", async (req, res) => {
  try {
    if (!req.session.user)
      return res.status(401).json({ error: "Not logged in" });

    const { type, item_id, booking_date } = req.body;
    const user_id = req.session.user.id;

    if (!type || !["event", "service"].includes(type))
      return res.status(400).json({ error: "Invalid booking type" });

    if (!item_id || !booking_date)
      return res.status(400).json({ error: "Item and date are required" });

    // Fetch event/service details
    let [itemRows] = [];
    if (type === "event") {
      [itemRows] = await pool.query("SELECT * FROM events WHERE id = ?", [
        item_id,
      ]);
    } else {
      [itemRows] = await pool.query("SELECT * FROM services WHERE id = ?", [
        item_id,
      ]);
    }

    if (!itemRows.length)
      return res.status(404).json({ error: "Item not found" });

    const item = itemRows[0];

    // Check date & slot availability
    if (type === "event") {
      if (booking_date !== item.event_date)
        return res
          .status(400)
          .json({ error: "Booking date must match event date" });

      const [[{ count }]] = await pool.query(
        "SELECT COUNT(*) AS count FROM bookings WHERE type=? AND item_id=? AND booking_date=?",
        [type, item_id, booking_date]
      );

      if (count >= item.max_participants)
        return res.status(400).json({ error: "Selected slot is full" });
    } else {
      // service
      const bookingDay = new Date(booking_date).toLocaleDateString("en-US", {
        weekday: "long",
      });

      if (!item.days_of_week.split(",").includes(bookingDay))
        return res
          .status(400)
          .json({ error: `Service not available on ${bookingDay}` });

      const [[{ count }]] = await pool.query(
        "SELECT COUNT(*) AS count FROM bookings WHERE type=? AND item_id=? AND booking_date=?",
        [type, item_id, booking_date]
      );

      if (count >= item.daily_capacity)
        return res.status(400).json({ error: "Selected slot is full" });
    }

    // Add booking
    const [result] = await pool.query(
      "INSERT INTO bookings (user_id, type, item_id, booking_date) VALUES (?, ?, ?, ?)",
      [user_id, type, item_id, booking_date]
    );

    return res.json({
      success: true,
      booking_number: result.insertId,
      message: "Booking confirmed",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/fetch-bookings
// app.get("/api/fetch-bookings", async (req, res) => {
//   try {
//     if (!req.session.user)
//       return res.status(401).json({ error: "Not logged in" });

//     const user_id = req.session.user.id;

//     const [rows] = await pool.query(
//       `SELECT 
//           b.id AS booking_number,
//           b.type, 
//           CASE WHEN b.type='event' THEN e.event_name ELSE s.service_name END AS item_name,
//           b.booking_date, 
//           b.created_at
//        FROM bookings b
//        LEFT JOIN events e ON b.item_id = e.id AND b.type='event'
//        LEFT JOIN services s ON b.item_id = s.id AND b.type='service'
//        WHERE b.user_id=? 
//        ORDER BY b.created_at DESC`,
//       [user_id]
//     );

//     res.json({ bookings: rows });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

app.get("/api/fetch-bookings", async (req, res) => {
  try {
    if (!req.session.user)
      return res.status(401).json({ error: "Not logged in" });

    const user_id = req.session.user.id;

    // Fetch bookings
    const [rows] = await pool.query(
      `SELECT 
          b.id AS booking_number,
          b.type,
          b.item_id,
          b.booking_date,
          b.created_at,
          CASE 
            WHEN b.type='event' THEN e.event_name
            ELSE s.service_name
          END AS item_name,
          CASE 
            WHEN b.type='event' THEN e.daily_capacity
            ELSE s.daily_capacity
          END AS total_capacity
       FROM bookings b
       LEFT JOIN events e ON b.item_id = e.id AND b.type='event'
       LEFT JOIN services s ON b.item_id = s.id AND b.type='service'
       WHERE b.user_id=?
       ORDER BY b.booking_date, b.created_at ASC`,
      [user_id]
    );

    // Calculate slot_id for each booking
    const bookingsWithSlot = await Promise.all(
      rows.map(async (b) => {
        const [countResult] = await pool.query(
          `SELECT COUNT(*) AS booked_count 
           FROM bookings 
           WHERE item_id = ? AND booking_date = ? AND type = ? AND id <= ?`,
          [b.item_id, b.booking_date, b.type, b.booking_number]
        );
        const slot_id = countResult[0].booked_count; // Slot number
        return {
          booking_number: b.booking_number,
          slot_id,
          type: b.type,
          item_name: b.item_name,
          booking_date: b.booking_date,
          created_at: b.created_at,
        };
      })
    );

    res.json({ bookings: bookingsWithSlot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/api/bookings-count", async (req, res) => {
  try {
    if (!req.session.user)
      return res.status(401).json({ error: "Not logged in" });

    const user_id = req.session.user.id;
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS count FROM bookings WHERE user_id = ?",
      [user_id]
    );

    res.json({ count: rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
