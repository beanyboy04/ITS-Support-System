-- Create Database
CREATE DATABASE IF NOT EXISTS helpIT;
USE helpIT;

-- Drop tables in dependency order so script can be rerun cleanly
DROP TABLE IF EXISTS Ticket;
DROP TABLE IF EXISTS Technician;
DROP TABLE IF EXISTS ServiceCategory;
DROP TABLE IF EXISTS Users;

-- Users Table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Role ENUM('Student', 'Faculty') NOT NULL
);

-- ServiceCategory Table
CREATE TABLE ServiceCategory (
    CatID INT AUTO_INCREMENT PRIMARY KEY,
    CatName VARCHAR(100) NOT NULL
);

-- Technician Table
CREATE TABLE Technician (
    TechID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Specialty VARCHAR(100) NOT NULL
);

-- Ticket Table
CREATE TABLE Ticket (
    TicketID INT AUTO_INCREMENT PRIMARY KEY,
    CheckInTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CheckOutTime DATETIME,
    Status ENUM('Active', 'On Hold', 'Resolved') NOT NULL DEFAULT 'Active',
    ResolutionNotes TEXT,
    UserID INT NOT NULL,
    CatID INT NOT NULL,
    TechID INT,

    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (CatID) REFERENCES ServiceCategory(CatID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (TechID) REFERENCES Technician(TechID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Indexes
CREATE INDEX idx_ticket_user ON Ticket(UserID);
CREATE INDEX idx_ticket_category ON Ticket(CatID);
CREATE INDEX idx_ticket_technician ON Ticket(TechID);

-- Service Categories
INSERT INTO ServiceCategory (CatName) VALUES
('Wi-Fi'),
('Hardware'),
('Software'),
('Account Issues');

-- Users
INSERT INTO Users (Name, Email, Role) VALUES
('John Doe', 'john@example.com', 'Student'),
('Jane Smith', 'jane@example.com', 'Faculty');

-- Technicians
INSERT INTO Technician (Name, Specialty) VALUES
('Ben Durham', 'Wi-Fi'),
('Freddy Ellison', 'Hardware'),
('George Vachon', 'Software'),
('Joshua Barnard', 'Account Issues');

-- Tickets
INSERT INTO Ticket (CheckOutTime, Status, ResolutionNotes, UserID, CatID, TechID) VALUES
(NULL, 'Active', NULL, 1, 1, NULL),
('2026-04-01 14:30:00', 'Resolved', 'Reinstalled drivers', 2, 2, 2);