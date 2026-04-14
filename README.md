# ITS-Support-System
Full stack IT Walk Up Support tracking system. Built with Node.js, MySQL, and JavaScript

# SETUP INSTRUCTIONS
1. Set Up Database
- Open MySQL (Workbench or command line)
- Open the 'database.sql' file
- Copy and Paste the contents into your MySQL workbench
- Run the script to create the tables and database

2. Install Dependencies & Start Server.
- Open all project files in VS CODE
- run the following in the terminal:

npm install

node server.js

3. Open Application
- Find 'index.html' in file explorer
- open it in a web browser

4. Use Application!
- Submit tickets
- Click "Technician" button for admin mode
- Manage tickets, assign technicians, and resolve issues

# Optional
- VS Code Extension: Live Server

# Common Problems:
1. "Could not load categories"
- Ensure the server is running:
node server.js
- Ensure MySQL database is running
- Verify Database was created using the database.sql file

2. Tickets not loading / "Failed to load tickets"
- Check that the backend server is running on:
  http://localhost:3000
- Make sure there are no errors in the terminal

3. Form submission not working
- Ensure all fields are filled out correctly
- Email must end with '@georgiasouthern.edu'

4. Changes not saving in Queue
- Make sure the server is running
- Check that a technician is assigned before resolving a ticket
- Resolution notes are required for resolved tickets

5. Page looks unstyled
- Make sure 'styles.css' is in the correct folder
- Verify the file path matches:
  css/styles.css
