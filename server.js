/*
  Purpose: Implements the mysql server with the frontend API routes.
  Keeps the server running while updating the database live.
*/

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "YOUR_MYSQL_PASSWORD_HERE",
  database: "helpIT"
};

let db;

/* Connect to MySQL */
async function connectDB() {
  try {
    db = await mysql.createPool(dbConfig);
    console.log("Connected to MySQL database.");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

/* Validate Georgia Southern email */
function isGeorgiaSouthernEmail(email) {
  return typeof email === "string" &&
    email.trim().toLowerCase().endsWith("@georgiasouthern.edu");
}

/* Categories */
app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT CatID, CatName FROM ServiceCategory ORDER BY CatName"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error loading categories:", error);
    res.status(500).json({ error: "Failed to load categories." });
  }
});

/* Technicians */
app.get("/api/technicians", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT TechID, Name, Specialty FROM Technician ORDER BY Name"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error loading technicians:", error);
    res.status(500).json({ error: "Failed to load technicians." });
  }
});

/* Create ticket */
app.post("/api/tickets", async (req, res) => {
  try {
    const { name, email, role, catId } = req.body;

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanRole = typeof role === "string" ? role.trim() : "";
    const cleanCatId = Number(catId);

    if (!cleanName || !cleanEmail || !cleanRole || !cleanCatId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!isGeorgiaSouthernEmail(cleanEmail)) {
      return res.status(400).json({
        error: "Only Georgia Southern email addresses are allowed."
      });
    }

    if (!["Student", "Faculty"].includes(cleanRole)) {
      return res.status(400).json({
        error: "Role must be Student or Faculty."
      });
    }

    const [validCategory] = await db.query(
      "SELECT CatID FROM ServiceCategory WHERE CatID = ?",
      [cleanCatId]
    );

    if (validCategory.length === 0) {
      return res.status(400).json({ error: "Invalid category selected." });
    }

    /* Find or create user */
    const [existingUsers] = await db.query(
      "SELECT UserID FROM Users WHERE Email = ?",
      [cleanEmail]
    );

    let userId;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].UserID;

      await db.query(
        "UPDATE Users SET Name = ?, Role = ? WHERE UserID = ?",
        [cleanName, cleanRole, userId]
      );
    } else {
      const [userResult] = await db.query(
        "INSERT INTO Users (Name, Email, Role) VALUES (?, ?, ?)",
        [cleanName, cleanEmail, cleanRole]
      );
      userId = userResult.insertId;
    }

    /* Create ticket */
    const [ticketResult] = await db.query(
      `INSERT INTO Ticket (UserID, CatID, Status, TechID, ResolutionNotes)
       VALUES (?, ?, 'Active', NULL, NULL)`,
      [userId, cleanCatId]
    );

    res.status(201).json({
      message: "Ticket created successfully.",
      ticketId: ticketResult.insertId
    });

  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Failed to create ticket." });
  }
});

/* Get tickets */
app.get("/api/tickets", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        Ticket.TicketID,
        Ticket.CheckInTime,
        Ticket.CheckOutTime,
        Ticket.Status,
        Ticket.ResolutionNotes,
        Users.Name AS UserName,
        Users.Email,
        Users.Role,
        ServiceCategory.CatName,
        Technician.TechID,
        Technician.Name AS TechName
      FROM Ticket
      JOIN Users ON Ticket.UserID = Users.UserID
      JOIN ServiceCategory ON Ticket.CatID = ServiceCategory.CatID
      LEFT JOIN Technician ON Ticket.TechID = Technician.TechID
      ORDER BY Ticket.CheckInTime DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error loading tickets:", error);
    res.status(500).json({ error: "Failed to load tickets." });
  }
});

/* Update ticket */
app.put("/api/tickets/:id", async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status, techId, resolutionNotes } = req.body;

    const cleanStatus = typeof status === "string" ? status.trim() : "";
    const cleanTechId = techId ? Number(techId) : null;
    const cleanNotes = typeof resolutionNotes === "string"
      ? resolutionNotes.trim()
      : "";

    if (!cleanStatus) {
      return res.status(400).json({ error: "Status is required." });
    }

    if (!["Active", "On Hold", "Resolved"].includes(cleanStatus)) {
      return res.status(400).json({ error: "Invalid status selected." });
    }

    if (cleanStatus === "Resolved") {
      if (!cleanTechId) {
        return res.status(400).json({
          error: "Technician must be assigned before resolving."
        });
      }

      if (!cleanNotes) {
        return res.status(400).json({
          error: "Resolution notes are required."
        });
      }
    }

    const checkOutTime = cleanStatus === "Resolved" ? new Date() : null;

    const [result] = await db.query(
      `
      UPDATE Ticket
      SET Status = ?,
          TechID = ?,
          ResolutionNotes = ?,
          CheckOutTime = ?
      WHERE TicketID = ?
      `,
      [
        cleanStatus,
        cleanTechId,
        cleanNotes || null,
        checkOutTime,
        ticketId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    res.json({ message: "Ticket updated successfully." });

  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Failed to update ticket." });
  }
});

/* Start server AFTER DB connects */
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
