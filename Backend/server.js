const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();

const axios = require("axios");

const app = express();
app.use(bodyParser.json());
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

app.use(
  "/generate-habit-suggestions",
  createProxyMiddleware({
    target: "http://127.0.0.1:5000",
    changeOrigin: true,
  })
);

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to the database");
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
};

// Routes
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).send("Error registering user");
      res.status(201).send("User registered successfully");
    }
  );
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(404).send("User not found");

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(403).send("Invalid credentials");

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    }
  );
});

app.get("/api/habits", authenticateToken, (req, res) => {
  db.query(
    "SELECT * FROM habits WHERE user_id = ?",
    [req.user.userId],
    (err, results) => {
      if (err) return res.status(500).send("Error fetching habits");
      res.json(results);
    }
  );
});

app.post("/api/habits", authenticateToken, (req, res) => {
  const { habit_title, frequency, start_date } = req.body;

  db.query(
    "INSERT INTO habits (user_id, habit_title, frequency, start_date, status) VALUES (?, ?, ?, ?, ?)",
    [req.user.userId, habit_title, frequency, start_date, "Active"],
    (err) => {
      if (err) return res.status(500).send("Error creating habit");
      res.status(201).send("Habit created successfully");
    }
  );
});

app.put("/api/habits/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE habits SET status = ? WHERE id = ? AND user_id = ?",
    [status, id, req.user.userId],
    (err) => {
      if (err) return res.status(500).send("Error updating habit");
      res.send("Habit updated successfully");
    }
  );
});

app.delete("/api/habits/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM habits WHERE id = ? AND user_id = ?",
    [id, req.user.userId],
    (err) => {
      if (err) return res.status(500).send("Error deleting habit");
      res.send("Habit deleted successfully");
    }
  );
});

app.get("/api/ai-suggestions", authenticateToken, (req, res) => {
  db.query(
    "SELECT habit_title FROM habits WHERE user_id = ? ORDER BY start_date DESC LIMIT 3",
    [req.user.userId], // Fetch user's habits based on their ID
    async (err, results) => {
      if (err) return res.status(500).send("Error fetching habits");

      const userHabits = results.map((habit) => habit.habit_title);
      if (userHabits.length === 0) {
        return res.status(400).send("No habits found for the user.");
      }

      try {
        const aiResponse = await axios.post(
          "http://127.0.0.1:5000/generate-habit-suggestions",
          { habits: userHabits },
          { headers: { "Content-Type": "application/json" } }
        );

        res.json(aiResponse.data); // Return AI-generated suggestions
      } catch (error) {
        console.error("Error communicating with AI API:", error);
        res.status(500).send("Failed to fetch habit suggestions from AI.");
      }
    }
  );
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port ${PORT}"));
