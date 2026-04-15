# ITS Support System

Full-stack IT walk-up support tracking system built with Node.js, MySQL, and JavaScript.

---

## Setup Instructions

### 1. Downloads
Install the following:

- https://nodejs.org/ (Node.js LTS)
- https://dev.mysql.com/downloads/mysql/ (MySQL Server)
- https://code.visualstudio.com/ (VS Code - recommended)

---

### 2. Set Up Database
- Open MySQL (Workbench or command line)
- Open the database.sql file
- Copy and paste the contents into MySQL
- Run the script to create the database and tables

---

### 3. Install Dependencies & Start Server
- Open the project folder in VS Code
- Open server.js and update your MySQL password:

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD_HERE",
  database: "helpIT"
};

- Run the following in the terminal:

npm install

node server.js

---

### 4. Open the Application
- Find index.html in File Explorer
- Open it in a web browser

---

### 5. Use the Application
- Submit tickets
- Click the "Technician" button to enter admin mode
- Manage tickets, assign technicians, and resolve issues

---

## Optional
- VS Code Extension: Live Server

---

## Common Problems

1. "Could not load categories"
- Make sure the server is running:
  node server.js
- Make sure MySQL is running
- Make sure database.sql was executed

2. Tickets not loading / "Failed to load tickets"
- Check that the backend server is running on:
  http://localhost:3000
- Check terminal for errors

3. Form submission not working
- Make sure all fields are filled out
- Email must end with @georgiasouthern.edu

4. Changes not saving in Queue
- Make sure the server is running
- Assign a technician before resolving a ticket
- Resolution notes are required

5. Page looks unstyled
- Make sure styles.css is in the correct folder
- Path should be: css/styles.css
