CREATE DATABASE IF NOT EXISTS cs160project;
USE cs160project;

CREATE TABLE IF NOT EXISTS User (
	UserID int AUTO_INCREMENT PRIMARY KEY,
    Username varchar(255) UNIQUE NOT NULL,
    Email varchar(255) UNIQUE NOT NULL,
    Password varchar(255) NOT NULL,
    Phone varchar(20),
    NotificationPreference varchar(10) DEFAULT 'email',
    NotificationFrequency varchar(10) DEFAULT 'weekly',
    INDEX IdxPass (Password),
    INDEX IdxPhone (Phone),
    INDEX IdxNotiPre (NotificationPreference),
    INDEX IdxNotiFre (NotificationFrequency)
);

CREATE TABLE IF NOT EXISTS WaterUsage (
	WaterID int AUTO_INCREMENT PRIMARY KEY,
    UserID int NOT NULL,
    Gallons decimal(10, 2) NOT NULL,
    DateLogged timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    INDEX IdxUser (UserID),
    INDEX IdxDate (DateLogged)
);

CREATE TABLE IF NOT EXISTS ElectricityUsage (
	ElectricityID int AUTO_INCREMENT PRIMARY KEY,
    UserID int NOT NULL,
    KilowattHour decimal(10, 2) NOT NULL,
    DateLogged timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    INDEX IdxUser (UserID),
    INDEX IdxDate (DateLogged)
);

CREATE TABLE IF NOT EXISTS GasUsage (
	GasID int AUTO_INCREMENT PRIMARY KEY,
    UserID int NOT NULL,
    CubicFeet decimal(10, 2) NOT NULL,
    DateLogged timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    INDEX IdxUser (UserID),
    INDEX IdxDate (DateLogged)
);

CREATE TABLE IF NOT EXISTS Friend (
	SenderID int NOT NULL,
    ReceiverID int NOT NULL,
    RequestStatus enum('pending', 'accepted', 'rejected') DEFAULT 'pending',
    DateSent timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (SenderID, ReceiverID),
    FOREIGN KEY (SenderID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ReceiverID) REFERENCES User(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Challenge (
	ChallengeID int AUTO_INCREMENT PRIMARY KEY,
    Title varchar(255) NOT NULL,
    ChallengeDescription text NOT NULL,
    UtilityType enum('water', 'electricity', 'gas') NOT NULL,
    ReductionTarget decimal(10, 2),
    StartDate date NOT NULL,
    EndDate date NOT NULL,
    RewardPoints int NOT NULL
);

CREATE TABLE IF NOT EXISTS UserChallengeProgress (
	UserID int NOT NULL,
    ChallengeID int NOT NULL,
    ChallengeStatus enum('in progress', 'completed', 'skipped') DEFAULT 'in progress',
    DateCompleted date,
    UserResponse text,
    PointsEarned int DEFAULT 0,
    PRIMARY KEY (UserID, ChallengeID),
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ChallengeID) REFERENCES Challenge(ChallengeID) ON DELETE CASCADE
);
    