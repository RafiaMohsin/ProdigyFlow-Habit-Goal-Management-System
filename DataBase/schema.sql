
CREATE DATABASE ProdigyFlow;
GO
USE ProdigyFlow;
GO

-- Rafia Mohsin 24L-2595

CREATE TABLE Roles (
	RoleID INT IDENTITY(1,1) PRIMARY KEY,
	RoleName VARCHAR(255) NOT NULL
);
GO
CREATE TABLE Users (
	UserID INT IDENTITY(1,1) PRIMARY KEY,
	Username VARCHAR(255) NOT NULL,
	Email VARCHAR(255) NOT NULL  Unique,
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
ALTER TABLE Users
ADD CONSTRAINT UQ_Username UNIQUE (Username);
GO

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


--Users with their Role
-- Feature relation: User Management
SELECT U.Username, U.Email, R.RoleName
FROM Users U
JOIN Roles R ON U.RoleID = R.RoleID;

--Feature relation: Habit Management
-- Display habits along with their category
SELECT H.HabitName, C.CategoryName
FROM Habits H
JOIN Categories C ON H.CategoryID = C.CategoryID;

--Feature relation: Priority based habit tracking
-- Find high priority habits
SELECT HabitName, Priority
FROM Habits
WHERE Priority >= 4;

--Feature relation: Productivity analytics
-- Count total habits created by each user
SELECT UserID, COUNT(*) AS TotalHabits
FROM Habits
GROUP BY UserID;

--Feature relation: Important habits appear first
-- Display habits ordered by priority
SELECT HabitName, Priority
FROM Habits
ORDER BY Priority DESC;

--Feature relation: Habit modification
-- Update priority of a habit
UPDATE Habits
SET Priority = 5
WHERE HabitID = 2;

--Feature relation: Removing a habit
-- Delete a habit
--DELETE FROM Habits
--WHERE HabitID = 4;

--Feature relation: Category based habit tracking
-- Find habits belonging to the Health category
SELECT H.HabitName
FROM Habits H
JOIN Categories C ON H.CategoryID = C.CategoryID
WHERE C.CategoryName = 'Health';

-------------------- for backend api testing -----------------------------
--/api/habits/details
SELECT 
    h.HabitID,
    h.HabitName,
    u.Username,
    c.CategoryName,
    h.Priority,
    h.Difficulty
FROM Habits h
JOIN Users u ON h.UserID = u.UserID
JOIN Categories c ON h.CategoryID = c.CategoryID;

--/api/users/stats
SELECT u.Username, COUNT(h.HabitID) AS TotalHabits
FROM Users u
LEFT JOIN Habits h ON u.UserID = h.UserID
GROUP BY u.Username;

--/api/habits/view
CREATE VIEW vw_HabitDetails AS
SELECT 
    h.HabitID,
    h.HabitName,
    u.Username,
    c.CategoryName,
    h.Priority,
    h.Difficulty
FROM Habits h
JOIN Users u ON h.UserID = u.UserID
JOIN Categories c ON h.CategoryID = c.CategoryID;

SELECT * FROM vw_HabitDetails;

--/api/users/stats-view
CREATE VIEW vw_UserHabitStats AS
SELECT 
    u.Username,
    COUNT(h.HabitID) AS TotalHabits
FROM Users u
LEFT JOIN Habits h ON u.UserID = h.UserID
GROUP BY u.Username;

SELECT * FROM vw_UserHabitStats;

--/api/habits/sp
CREATE PROCEDURE sp_AddHabit
    @HabitName VARCHAR(255),
    @Difficulty TINYINT,
    @Priority TINYINT,
    @UserID INT,
    @CategoryID INT
AS
BEGIN
    INSERT INTO Habits (HabitName, Difficulty, Priority, UserID, CategoryID)
    VALUES (@HabitName, @Difficulty, @Priority, @UserID, @CategoryID);
END;
--/api/habits/user/{id}
CREATE PROCEDURE sp_GetHabitsByUser
    @UserID INT
AS
BEGIN
    SELECT * FROM Habits WHERE UserID = @UserID;
END;
--/api/categories/sp
CREATE PROCEDURE sp_AddCategory
    @CategoryName VARCHAR(255)
AS
BEGIN
    INSERT INTO Categories (CategoryName)
    VALUES (@CategoryName);
END;
GO

-- Delete Category stored procedure
-- /api/categories/{id}/sp
CREATE PROCEDURE sp_DeleteCategory
    @CategoryID INT
AS
BEGIN
    DELETE FROM Categories WHERE CategoryID = @CategoryID;
END;
GO
---------------------------------------------------------------------------
-- Farwa Batool Naqvi 24L-2508

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
GO


UPDATE Goals 
SET Progress = 75.50 
WHERE GoalName = 'Become a Data Scientist';

--DELETE FROM HabitNotes 
--WHERE HabitID = 7;


UPDATE Habits
SET Priority = 5
WHERE CategoryID = (SELECT CategoryID FROM Categories WHERE CategoryName = 'Study');

UPDATE StreakHistory
SET CurrentStreak = 0
WHERE LastUpdated < GETDATE(); 


UPDATE HabitNotes 
SET NoteText = 'Update: Finally mastered JOINs and Subqueries!' 
WHERE NoteID = 2;

UPDATE Categories 
SET CategoryName = 'Mindfulness & Spiritual' 
WHERE CategoryName = 'Spiritual';

DELETE FROM HabitNotes
WHERE UserID = (SELECT UserID FROM Users WHERE Username = 'ali');

DELETE FROM Goals 
WHERE GoalName = 'Master Backend Development' AND UserID = 2;

DELETE FROM StreakHistory 
WHERE HabitID = 1;

UPDATE HabitLogs
SET Status = 'Completed'
WHERE LogID = 4;

DELETE FROM GoalHabit
WHERE GoalID IN (SELECT GoalID FROM Goals WHERE Progress = 100);


DELETE FROM HabitLogs
WHERE Status = 'Pending' 
  AND CompletionDate < (GETDATE() - 7);

SELECT U.Username, H.HabitName, C.CategoryName, H.Priority
FROM Users U
JOIN Habits H ON U.UserID = H.UserID
JOIN Categories C ON H.CategoryID = C.CategoryID
WHERE U.Username = 'zara' AND H.Priority > 3;


SELECT G.GoalName, H.HabitName
FROM Goals G
JOIN GoalHabit GH ON G.GoalID = GH.GoalID
JOIN Habits H ON GH.HabitID = H.HabitID;


SELECT UserID, COUNT(HabitID) AS Total_Active_Habits
FROM Habits
GROUP BY UserID;


SELECT C.CategoryName, COUNT(H.HabitID) AS Total_Habits
FROM Categories C
JOIN Habits H ON C.CategoryID = H.CategoryID
GROUP BY C.CategoryName;


SELECT HabitName 
FROM Habits 
WHERE HabitID IN (
    SELECT HabitID 
    FROM GoalHabit 
    WHERE GoalID IN (SELECT GoalID FROM Goals WHERE Progress > 50)
);


UPDATE GoalHabit 
SET HabitID = 1  
WHERE GoalID = 2 AND HabitID = 6; 

SELECT U.Username, H.HabitName, S.LongestStreak
FROM Users U
JOIN Habits H ON U.UserID = H.UserID
JOIN StreakHistory S ON H.HabitID = S.HabitID
WHERE S.LongestStreak = (SELECT MAX(LongestStreak) FROM StreakHistory);


SELECT CategoryName FROM Categories
EXCEPT
SELECT C.CategoryName 
FROM Categories C
JOIN Habits H ON C.CategoryID = H.CategoryID;


SELECT HabitName FROM Habits WHERE UserID = 1
INTERSECT
SELECT HabitName FROM Habits WHERE UserID = 2;

SELECT DISTINCT H.HabitName, H.Difficulty, L.CompletionDate
FROM Habits H
JOIN HabitLogs L ON H.HabitID = L.HabitID
WHERE L.Status = 'Failed' 
  AND L.CompletionDate > (GETDATE() - 7);

SELECT HabitName 
FROM Habits 
WHERE HabitID IN (
    SELECT HabitID 
    FROM GoalHabit 
    GROUP BY HabitID 
    HAVING COUNT(GoalID) > 1
);


SELECT C.CategoryName, H.HabitName, S.LongestStreak
FROM Categories C
JOIN Habits H ON C.CategoryID = H.CategoryID
JOIN StreakHistory S ON H.HabitID = S.HabitID
WHERE S.LongestStreak = (
    SELECT MAX(LongestStreak) 
    FROM StreakHistory SH
    JOIN Habits HB ON SH.HabitID = HB.HabitID
    WHERE HB.CategoryID = C.CategoryID
);


SELECT Username 
FROM Users 
WHERE UserID IN (
    SELECT UserID FROM HabitNotes GROUP BY UserID HAVING COUNT(NoteID) > 3
)
AND UserID IN (
    SELECT UserID FROM Goals WHERE Progress = 0
);

SELECT H.HabitName, S.CurrentStreak, L.Status
FROM Habits H
JOIN StreakHistory S ON H.HabitID = S.HabitID
JOIN HabitLogs L ON H.HabitID = L.HabitID
WHERE S.CurrentStreak > 5 
  AND L.Status = 'Failed';


  -- Eman Faisal 24L-2514

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
Status VARCHAR(20) NOT NULL CHECK (Status IN ('Active', 'Inactive'))
);
GO
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

SELECT H.HabitName, R.ReminderTime, R.Frequency 
FROM Reminders R
JOIN Habits H ON R.HabitID = H.HabitID
WHERE R.Status = 'Active';

UPDATE PerformanceReport
SET CompletionRate = 88.50 
WHERE ReportID = 1;

UPDATE Achievements 
SET RequiredStreak = 15 
WHERE Title = 'Week Warrior';

UPDATE UserAchievements 
SET EarnedDate = GETDATE() 
WHERE UserAchievementID = 1;

UPDATE Notifications 
SET Status = 'Read' 
WHERE UserID = 1;

UPDATE Reminders 
SET Frequency = 'Weekly' 
WHERE ReminderID = 2;

DELETE FROM PerformanceReport
WHERE GeneratedDate < '2026-01-01';

DELETE FROM Achievements 
WHERE AchievementID = 3;

DELETE FROM UserAchievements
WHERE AchievementID IN (SELECT AchievementID FROM Achievements WHERE Title = 'Week Warrior');

DELETE FROM Notifications 
WHERE CreatedDate < (GETDATE() - 30);

DELETE FROM Reminders 
WHERE Status = 'Inactive' 
AND Frequency = 'Daily';


SELECT UserID, AVG(CompletionRate) AS Average_Completion_Rate
FROM PerformanceReport
WHERE UserID = 1
GROUP BY UserID;

SELECT * FROM PerformanceReport
WHERE ReportType = 'Weekly' AND ConsistencyScore > 7.0


SELECT A.Title, UA.EarnedDate
FROM UserAchievements UA
JOIN Achievements A ON UA.AchievementID = A.AchievementID
WHERE UA.UserID = 1;


SELECT UserID, COUNT(AchievementID) AS Achievements_Earned
FROM UserAchievements
GROUP BY UserID
ORDER BY Achievements_Earned DESC;

SELECT * FROM Notifications 
WHERE Status = 'Unread' 
AND CreatedDate >= (GETDATE() - 1);


SELECT U.Username, N.Message, N.Status
FROM Notifications N
JOIN Users U ON N.UserID = U.UserID
WHERE N.Status = 'Unread';


SELECT UserID FROM PerformanceReport WHERE CompletionRate > 80.00
EXCEPT
SELECT UserID FROM UserAchievements WHERE AchievementID = (SELECT AchievementID FROM Achievements WHERE Title = 'Consistency Champion');


SELECT UserID FROM Habits WHERE HabitName LIKE '%Study%'
INTERSECT
SELECT UserID FROM UserAchievements WHERE AchievementID = (SELECT AchievementID FROM Achievements WHERE Title = 'Habit Starter');


SELECT CompletionDate AS ActivityDate, 'Log Entry' AS ActivityType FROM HabitLogs WHERE HabitID = 2
UNION
SELECT CreatedDate, 'Note Written' FROM HabitNotes WHERE HabitID = 2;



SELECT 
    U.Username, 
    H.HabitName, 
    P.ReportType, 
    P.ConsistencyScore, 
    P.CompletionRate
FROM Users U
JOIN Habits H 
    ON U.UserID = H.UserID
JOIN PerformanceReport P 
    ON U.UserID = P.UserID
WHERE P.ConsistencyScore > 7.0
ORDER BY P.ConsistencyScore DESC;



SELECT H.HabitName, S.CurrentStreak 
FROM Habits H
JOIN StreakHistory S ON H.HabitID = S.HabitID
WHERE S.CurrentStreak > (
    SELECT AVG(SH.CurrentStreak)
    FROM StreakHistory SH
    JOIN Habits HB ON SH.HabitID = HB.HabitID
    WHERE HB.CategoryID = H.CategoryID
);
