const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "bigwin",
  host: "dpg-d0q55m8dl3ps73bb4420-a.oregon-postgres.render.com",
  database: "bigwin_db",
  password: "MkaKasRvZ5VkPD3ENlbc68smlazGwrxH",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

pool.query("SELECT NOW()")
  .then(res => console.log("✅ Connected to remote DB at:", res.rows[0].now))
  .catch(err => console.error("❌ DB connection error:", err));

// 🔧 Create tables
(async () => {
  try {
    await pool.query(`
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

      CREATE TABLE IF NOT EXISTS deposit_requests (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending'
      );

      CREATE TABLE IF NOT EXISTS withdrawal_requests (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending'
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        message TEXT,
        is_read BOOLEAN DEFAULT false
      );
    `);
    console.log("✅ Tables created or already exist");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  }
})();

// 🔐 Register
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, password]
    );
    res.status(200).json({ message: "Registered successfully", userId: result.rows[0].id });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === '23505') {
      res.status(400).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Server error during registration" });
    }
  }
});


// 🔐 Login
// 🔐 Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  
  // 1) Basic validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, username, is_admin, password FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      // no such user
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = result.rows[0];
    // 2) Plain‐text check (better to hash in production)
    if (password !== user.password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // 3) Success
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
});

// 👑 Admin: view all users
app.get("/api/admin/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 👑 Admin: delete user
app.delete("/api/admin/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(200).json({ message: "User  deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 🆙 Request upgrade
app.post("/api/upgrade", async (req, res) => {
  const { userId } = req.body;
  try {
    await pool.query("INSERT INTO upgrade_requests (user_id) VALUES ($1)", [userId]);
    res.status(200).json({ message: "Upgrade request submitted" });
  } catch (error) {
    console.error("Upgrade error:", error);
    res.status(500).json({ error: "Failed to submit request" });
  }
});

// 👑 Admin: view upgrade requests
app.get("/api/admin/requests", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT upgrade_requests.id, users.username, upgrade_requests.status
      FROM upgrade_requests
      JOIN users ON upgrade_requests.user_id = users.id
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch upgrade requests error:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// 👑 Admin: respond to upgrade
app.post("/api/admin/respond", async (req, res) => {
  const { requestId, status } = req.body;
  try {
    await pool.query("UPDATE upgrade_requests SET status = $1 WHERE id = $2", [status, requestId]);
    res.status(200).json({ message: "Status updated" });
  } catch (error) {
    console.error("Update request error:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// 💰 Deposit
app.post("/api/deposit", async (req, res) => {
  const { userId, amount } = req.body;
  try {
    await pool.query("INSERT INTO deposit_requests (user_id, amount) VALUES ($1, $2)", [userId, amount]);
    res.status(200).json({ message: "Deposit request submitted" });
  } catch (error) {
    console.error("Deposit error:", error);
    res.status(500).json({ error: "Deposit failed" });
  }
});

// Admin: view deposit requests
app.get("/api/admin/deposit-requests", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id, u.username, d.amount, d.status
      FROM deposit_requests d
      JOIN users u ON d.user_id = u.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching deposits" });
  }
});

// Admin: respond to deposit requests
app.post("/api/admin/deposit-requests/:id/:action", async (req, res) => {
  const { id, action } = req.params;
  if (!["approve", "reject"].includes(action)) return res.status(400).json({ error: "Invalid action" });

  try {
    await pool.query("UPDATE deposit_requests SET status = $1 WHERE id = $2", [action, id]);
    res.json({ message: `Deposit ${action}d` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating deposit status" });
  }
});

// 💸 Withdrawals
app.post("/api/withdrawal", async (req, res) => {
  const { userId, amount } = req.body;
  try {
    await pool.query("INSERT INTO withdrawal_requests (user_id, amount) VALUES ($1, $2)", [userId, amount]);
    res.status(200).json({ message: "Withdrawal request submitted" });
  } catch (error) {
    console.error("Withdrawal error:", error);
    res.status(500).json({ error: "Withdrawal failed" });
  }
});

// Admin: view withdrawal requests
app.get("/api/admin/withdrawal-requests", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.id, u.username, w.amount, w.status
      FROM withdrawal_requests w
      JOIN users u ON w.user_id = u.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching withdrawals" });
  }
});

// Admin: respond to withdrawal requests
app.post("/api/admin/withdrawal-requests/:id/:action", async (req, res) => {
  const { id, action } = req.params;
  if (!["approve", "reject"].includes(action)) return res.status(400).json({ error: "Invalid action" });

  try {
    await pool.query("UPDATE withdrawal_requests SET status = $1 WHERE id = $2", [action, id]);
    res.json({ message: `Withdrawal ${action}d` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating withdrawal status" });
  }
});

// 🔔 Notifications
app.post("/api/notifications", async (req, res) => {
  const { userId, message } = req.body;
  try {
    await pool.query("INSERT INTO notifications (user_id, message) VALUES ($1, $2)", [userId, message]);
    res.status(200).json({ message: "Notification created" });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

app.get("/api/notifications/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY id DESC",
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: "Error fetching notifications" });
  }
});

app.put("/api/notifications/:id/read", async (req, res) => {
  try {
    await pool.query("UPDATE notifications SET is_read = true WHERE id = $1", [req.params.id]);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Read notification error:", error);
    res.status(500).json({ error: "Error updating notification" });
  }
});

// 🎮 Game endpoints (simple)
app.post("/api/claim", (req, res) => {
  res.json({ message: "Claimed 50 tokens!" });
});

app.post("/api/spin", (req, res) => {
  const outcomes = [0, 10, 20, 50, 100];
  const reward = outcomes[Math.floor(Math.random() * outcomes.length)];
  res.json({ message: "Spin complete", reward });
});

app.post("/api/aviator", (req, res) => {
  const multiplier = Math.random() * 5;
  res.json({ multiplier: multiplier.toFixed(2) });
});

// Serve frontend
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
