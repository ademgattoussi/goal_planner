-- db name : goal_planner
-- This SQL script creates the necessary tables for the goal planner application.


CREATE TABLE users (
  userId INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255),
  mobile VARCHAR(20)
);

CREATE TABLE goals (
  goalId INT AUTO_INCREMENT PRIMARY KEY,
  goalName VARCHAR(255),
  description TEXT,
  startDate DATE,
  endDate DATE,
  isAchieved BOOLEAN,
  userId INT,
  FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE milestones (
  milestoneId INT AUTO_INCREMENT PRIMARY KEY,
  milestoneName VARCHAR(255),
  description TEXT,
  targetDate DATE,
  isCompleted BOOLEAN,
  goalId INT,
  FOREIGN KEY (goalId) REFERENCES goals(goalId)
);

CREATE TABLE IF NOT EXISTS tasks (
  taskId INT PRIMARY KEY AUTO_INCREMENT,
  taskName VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50) NOT NULL,
  createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  dueDate DATE,
  isCompleted BOOLEAN DEFAULT false,
  userId INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId)
);