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
    DateLogged datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    INDEX IdxUser (UserID),
    INDEX IdxDate (DateLogged)
);

CREATE TABLE IF NOT EXISTS ElectricityUsage (
	ElectricityID int AUTO_INCREMENT PRIMARY KEY,
    UserID int NOT NULL,
    KilowattHour decimal(10, 2) NOT NULL,
    DateLogged datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    INDEX IdxUser (UserID),
    INDEX IdxDate (DateLogged)
);

CREATE TABLE IF NOT EXISTS GasUsage (
	GasID int AUTO_INCREMENT PRIMARY KEY,
    UserID int NOT NULL,
    CubicFeet decimal(10, 2) NOT NULL,
    DateLogged datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    INDEX IdxUser (UserID),
    INDEX IdxDate (DateLogged)
);