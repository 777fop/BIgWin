const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: "bigwin",
    host: "dpg-d0q55m8dl3ps73bb4420-a.oregon-postgres.render.com",
    database: "bigwin_db",
    password: "MkaKasRvZ5VkPD3ENlbc68smlazGwrxH",
    port: 5432,
    ssl: { rejectUnauthorized: false }, // important for Render Postgres
  });
  


// Create tables if not exist
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT false
  );

  CREATE TABLE IF NOT EXISTS upgrade_requests (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending'
  );
`);

// REGISTER
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]);
    res.status(200).json({ message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Username may already exist" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password]);
  if (result.rows.length > 0) {
    const user = result.rows[0];
    res.status(200).json({ success: true, user: { id: user.id, username: user.username, is_admin: user.is_admin } });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// REQUEST UPGRADE
app.post("/api/upgrade", async (req, res) => {
  const { userId } = req.body;
  await pool.query("INSERT INTO upgrade_requests (user_id) VALUES ($1)", [userId]);
  res.status(200).json({ message: "Upgrade request submitted" });
});

// ADMIN VIEW REQUESTS
app.get("/api/admin/requests", async (req, res) => {
  const result = await pool.query(`
    SELECT upgrade_requests.id, users.username, upgrade_requests.status
    FROM upgrade_requests
    JOIN users ON upgrade_requests.user_id = users.id
  `);
  res.status(200).json(result.rows);
});

// ADMIN RESPOND
app.post("/api/admin/respond", async (req, res) => {
  const { requestId, status } = req.body;
  await pool.query("UPDATE upgrade_requests SET status = $1 WHERE id = $2", [status, requestId]);
  res.status(200).json({ message: "Status updated" });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
