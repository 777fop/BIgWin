const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path"); // Added for serving frontend static files

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "bigwin",
  host: "dpg-d0q55m8dl3ps73bb4420-a.oregon-postgres.render.com",
  database: "bigwin_db",
  password: "MkaKasRvZ5VkPD3ENlbc68smlazGwrxH",
  port: 5432,
  ssl: { rejectUnauthorized: false }, // required for Render Postgres
});

// Check DB connection on server start
pool.query("SELECT NOW()")
  .then(res => console.log("✅ Connected to remote DB at:", res.rows[0].now))
  .catch(err => console.error("❌ DB connection error:", err));

// Create tables separately
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT false
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS upgrade_requests (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'pending'
      )
    `);
    console.log("✅ Tables created or already exist");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  }
})();

// REGISTER endpoint
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, password]
    );
    console.log(`User registered with ID ${result.rows[0].id}`);
    res.status(200).json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Username may already exist or server error" });
  }
});

// LOGIN endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).json({ success: true, user: { id: user.id, username: user.username, is_admin: user.is_admin } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// REQUEST UPGRADE endpoint
app.post("/api/upgrade", async (req, res) => {
  const { userId } = req.body;
  try {
    await pool.query("INSERT INTO upgrade_requests (user_id) VALUES ($1)", [userId]);
    res.status(200).json({ message: "Upgrade request submitted" });
  } catch (error) {
    console.error("Error submitting upgrade request:", error);
    res.status(500).json({ error: "Failed to submit request" });
  }
});

// ADMIN VIEW REQUESTS
app.get("/api/admin/requests", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT upgrade_requests.id, users.username, upgrade_requests.status
      FROM upgrade_requests
      JOIN users ON upgrade_requests.user_id = users.id
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching admin requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// ADMIN RESPOND
app.post("/api/admin/respond", async (req, res) => {
  const { requestId, status } = req.body;
  try {
    await pool.query("UPDATE upgrade_requests SET status = $1 WHERE id = $2", [status, requestId]);
    res.status(200).json({ message: "Status updated" });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// --- Serve frontend static files ---
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html on all other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
