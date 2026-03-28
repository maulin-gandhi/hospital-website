const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ DB CONNECTION
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "clinic"
});

// =============================
// ✅ ADD APPOINTMENT (FINAL)
// =============================
app.post("/appointment", (req, res) => {

  const data = req.body;

  console.log("Incoming:", data); // DEBUG

  const sql = `
    INSERT INTO appointments 
    (name, phone, email, date, time, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    data.name || "",
    data.phone || "",
    data.email || "",
    data.date || "",
    data.time || "",
    data.message || ""
  ], (err) => {

    if (err) {
      console.log("❌ SQL ERROR:", err); // IMPORTANT
      return res.send("Error saving appointment");
    }

    res.send("Appointment Booked Successfully ✅");
  });

});

// =============================
// ✅ GET DATA
// =============================
app.get("/appointments", (req, res) => {
  db.query("SELECT * FROM appointments ORDER BY id DESC", (err, result) => {
    if (err) return res.send("Error");
    res.json(result);
  });
});

// =============================
// ✅ DELETE
// =============================
app.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM appointments WHERE id=?", [req.params.id], (err) => {
    if (err) return res.send("Error");
    res.send("Deleted");
  });
});

// START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});