CREATE TABLE Roles (
	RoleID INT IDENTITY(1,1) PRIMARY KEY,
	RoleName VARCHAR(255) NOT NULL
);
GO

CREATE TABLE Users (
	UserID INT IDENTITY(1,1) PRIMARY KEY,
	Username VARCHAR(255) NOT NULL,
	Email VARCHAR(255) NOT NULL UNIQUE,
	PasswordHash VARCHAR(255) NOT NULL,
	CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
	RoleID INT NOT NULL,
	FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);
GO

CREATE TABLE Categories (
	CategoryID INT IDENTITY(1,1) PRIMARY KEY,
	CategoryName VARCHAR(255) NOT NULL
);
GO

CREATE TABLE Habits (
	HabitID INT IDENTITY(1,1) PRIMARY KEY,
	HabitName VARCHAR(255) NOT NULL,
	Difficulty TINYINT CHECK (Difficulty BETWEEN 1 AND 3),
	Priority TINYINT CHECK (Priority BETWEEN 1 AND 5),
	CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
	UserID INT NOT NULL, 
	CategoryID INT NOT NULL,
	FOREIGN KEY (UserID) REFERENCES Users(UserID),
	FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);
GO

CREATE TABLE HabitLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    HabitID INT NOT NULL, 
    CompletionDate DATETIME NOT NULL DEFAULT GETDATE(),
    Status VARCHAR(20) NOT NULL CHECK (Status IN ('Completed', 'Failed', 'Skipped', 'Pending')),
    FOREIGN KEY (HabitID) REFERENCES Habits(HabitID)
);
GO

CREATE TABLE StreakHistory (
    StreakID INT IDENTITY(1,1) PRIMARY KEY,
    HabitID INT NOT NULL,
    CurrentStreak INT NOT NULL DEFAULT 0 CHECK (CurrentStreak >= 0),
    LongestStreak INT NOT NULL DEFAULT 0 CHECK (LongestStreak >= 0),
    LastUpdated DATETIME NOT NULL DEFAULT GETDATE(),
    CHECK (CurrentStreak <= LongestStreak),
    FOREIGN KEY (HabitID) REFERENCES Habits(HabitID)
);
GO

CREATE TABLE HabitNotes (
    NoteID INT IDENTITY(1,1) PRIMARY KEY,
    HabitID INT NOT NULL,
    UserID INT NOT NULL,
    NoteText TEXT NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (HabitID) REFERENCES Habits(HabitID)
);
GO

CREATE TABLE Goals (
    GoalID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    GoalName VARCHAR(255) NOT NULL,
    TargetDate DATETIME NOT NULL,
    Progress DECIMAL(5, 2) DEFAULT 0.00 CHECK (Progress BETWEEN 0 AND 100),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

CREATE TABLE GoalHabit (
    GoalHabitID INT IDENTITY(1,1) PRIMARY KEY,
    GoalID INT NOT NULL, 
    HabitID INT NOT NULL, 
    UNIQUE (GoalID, HabitID), 
    FOREIGN KEY (GoalID) REFERENCES Goals(GoalID),
    FOREIGN KEY (HabitID) REFERENCES Habits(HabitID)
);
GO

CREATE TABLE PerformanceReport(
ReportID INT IDENTITY(1,1) PRIMARY KEY,
UserID INT NOT NULL,
ReportType VARCHAR(50) NOT NULL, 
CompletionRate DECIMAL (5,2) NOT NULL,
ConsistencyScore DECIMAL(5, 2) NOT NULL,
GeneratedDate DATETIME NOT NULL DEFAULT GETDATE(),
FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

CREATE TABLE Achievements(
AchievementID INT IDENTITY(1,1) PRIMARY KEY,
Title VARCHAR(100) NOT NULL,
Description TEXT,
RequiredStreak INT NOT NULL
);
GO

CREATE TABLE UserAchievements(
UserAchievementID INT IDENTITY(1,1) PRIMARY KEY,
UserID INT NOT NULL,
AchievementID INT NOT NULL,
EarnedDate DATETIME NOT NULL DEFAULT GETDATE(),
FOREIGN KEY (UserID) REFERENCES Users(UserID), 
FOREIGN KEY (AchievementID) REFERENCES Achievements(AchievementID)
);
GO

CREATE TABLE Notifications(
NotificationID INT IDENTITY(1,1) PRIMARY KEY,
UserID INT NOT NULL,
Message TEXT NOT NULL, 
Status VARCHAR(20) NOT NULL CHECK (Status IN ('Read', 'Unread', 'Archived')),
CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

CREATE TABLE Reminders(
ReminderID INT IDENTITY(1,1) PRIMARY KEY,
HabitID INT NOT NULL,
ReminderTime TIME NOT NULL, 
Frequency VARCHAR(50) NOT NULL,
Status VARCHAR(20) NOT NULL CHECK (Status IN ('Active', 'Inactive')),
FOREIGN KEY (HabitID) REFERENCES Habits(HabitID)
);
GO

-- Sample Data

INSERT INTO Roles (RoleName)
VALUES ('Admin'), ('User');

INSERT INTO Users (Username, Email, PasswordHash, RoleID)
VALUES
('zara', 'zara@email.com', 'hash123', 2),
('ali', 'ali@email.com', 'hash234', 2),
('sara', 'sara@email.com', 'hash345', 2),
('admin01', 'admin@email.com', 'adminhash', 1);

INSERT INTO Categories (CategoryName)
VALUES ('Health'), ('Study'), ('Spiritual'), ('Productivity'), ('Personal Development');

INSERT INTO Habits (HabitName, Difficulty, Priority, UserID, CategoryID)
VALUES
('Morning Exercise', 2, 4, 1, 1),
('Study Data Science', 3, 5, 1, 2),
('Read Quran', 1, 5, 1, 3),
('Read 20 Pages', 2, 3, 2, 5),
('Meditation', 1, 3, 3, 1),
('Practice SQL', 2, 4, 2, 2),
('Journaling', 1, 2, 3, 4);

INSERT INTO HabitLogs (HabitID, CompletionDate, Status)
VALUES
(1, '2026-03-01 08:00:00', 'Completed'),
(2, '2026-03-01 14:00:00', 'Completed'),
(3, '2026-03-01 05:00:00', 'Completed'),
(4, '2026-03-01 21:00:00', 'Skipped'),
(5, '2026-03-01 17:30:00', 'Completed');

INSERT INTO StreakHistory (HabitID, CurrentStreak, LongestStreak)
VALUES
(1, 5, 12), 
(2, 3, 3),  
(3, 10, 15);

INSERT INTO HabitNotes (HabitID, UserID, NoteText)
VALUES
(2, 1, 'Finished the module on Linear Regression today!'),
(6, 2, 'Struggled with JOINs, but feeling better after practice.');

INSERT INTO Goals (UserID, GoalName, TargetDate, Progress)
VALUES
(1, 'Become a Data Scientist', '2026-12-31', 25.50),
(2, 'Master Backend Development', '2026-08-15', 10.00);

INSERT INTO GoalHabit (GoalID, HabitID)
VALUES
(1, 2), (1, 6), (2, 6);

INSERT INTO PerformanceReport (UserID, ReportType, CompletionRate, ConsistencyScore)
VALUES
(1, 'Weekly', 85.50, 7.2),
(2, 'Monthly', 60.00, 5.1),
(1, 'Monthly', 92.00, 8.5);

INSERT INTO Achievements (Title, Description, RequiredStreak)
VALUES
('Habit Starter', 'Complete your first habit.', 1),
('Week Warrior', 'Maintain a 7-day streak on any habit.', 7),
('Consistency Champion', 'Reach a 30-day streak.', 30);

INSERT INTO UserAchievements (UserID, AchievementID, EarnedDate)
VALUES
(1, 1, '2026-03-01 08:30:00'),
(2, 1, '2026-03-01 09:15:00'),
(1, 2, '2026-03-07 10:00:00');

INSERT INTO Notifications (UserID, Message, Status)
VALUES
(1, 'Welcome to ProdigyFlow!', 'Unread'),
(2, 'Remember to complete "Study Data Science" habit today.', 'Read'),
(1, 'You just earned the "Week Warrior" achievement!', 'Unread');

INSERT INTO Reminders (HabitID, ReminderTime, Frequency, Status)
VALUES
(1, '07:30:00', 'Daily', 'Active'),
(2, '14:00:00', 'Mon-Fri', 'Active'),
(3, '05:00:00', 'Daily', 'Active'),
(5, '21:00:00', 'Daily', 'Inactive');