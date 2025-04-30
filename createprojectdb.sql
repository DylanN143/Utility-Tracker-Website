CREATE DATABASE IF NOT EXISTS cs160project;
USE cs160project;

CREATE TABLE IF NOT EXISTS User (
	UserID int AUTO_INCREMENT PRIMARY KEY,
    Username varchar(255) UNIQUE NOT NULL,
    Email varchar(255) UNIQUE NOT NULL,
    Password varchar(255) NOT NULL,
    Phone varchar(20),
    ViewPreference ENUM('simple', 'complex') DEFAULT 'complex',
    NotificationType ENUM('email', 'text') DEFAULT 'email',
    NotificationFrequency ENUM('daily', 'weekly') DEFAULT 'weekly',
    INDEX IdxUsername (Username),
    INDEX IdxPass (Password),
    INDEX IdxEmail (Email),
    INDEX IdxPhone (Phone),
    INDEX IdxNotiType (NotificationType),
    INDEX IdxNotiFreq (NotificationFrequency)
);

CREATE TABLE IF NOT EXISTS WaterUsage (
	WaterID int AUTO_INCREMENT PRIMARY KEY,
    UserID int NOT NULL,
    Gallons decimal(10, 2) NOT NULL,
    DateLogged timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    INDEX IdxUser (UserID),
    INDEX IdxDate (DateLogged),
    INDEX IdxUserDate (UserID, DateLogged)
);

CREATE TABLE IF NOT EXISTS ElectricityUsage (
	ElectricityID int AUTO_INCREMENT PRIMARY KEY,
    UserID int NOT NULL,
    KilowattHour decimal(10, 2) NOT NULL,
    DateLogged timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    INDEX IdxUser (UserID),
    INDEX IdxDate (DateLogged),
    INDEX IdxUserDate (UserID, DateLogged)
);

CREATE TABLE IF NOT EXISTS GasUsage (
	GasID int AUTO_INCREMENT PRIMARY KEY,
    UserID int NOT NULL,
    CubicFeet decimal(10, 2) NOT NULL,
    DateLogged timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    INDEX IdxUser (UserID),
    INDEX IdxDate (DateLogged),
    INDEX IdxUserDate (UserID, DateLogged)
);

CREATE TABLE IF NOT EXISTS Friend (
	SenderID int NOT NULL,
    ReceiverID int NOT NULL,
    RequestStatus enum('pending', 'accepted', 'rejected') DEFAULT 'pending',
    DateSent timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (SenderID, ReceiverID),
    FOREIGN KEY (SenderID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ReceiverID) REFERENCES User(UserID) ON DELETE CASCADE,
    INDEX IdxSender (SenderID),
    INDEX IdxReceiver (ReceiverID),
    INDEX IdxFriendStatus (RequestStatus)
);

CREATE TABLE IF NOT EXISTS Challenge (
	ChallengeID int AUTO_INCREMENT PRIMARY KEY,
    Title varchar(255) NOT NULL,
    ChallengeDescription text NOT NULL,
    UtilityType enum('water', 'electricity', 'gas') NOT NULL,
    ReductionTarget decimal(10, 2),
    StartDate date NOT NULL,
    EndDate date NOT NULL,
    RewardPoints int NOT NULL,
    INDEX IdxUtilityType (UtilityType),
    INDEX IdxChalStartEnd (StartDate, EndDate)
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
    FOREIGN KEY (ChallengeID) REFERENCES Challenge(ChallengeID) ON DELETE CASCADE,
    INDEX IdxUser (UserID),
    INDEX IdxChal (ChallengeID),
    INDEX IdxChalStatus (ChallengeStatus)
);

CREATE TABLE IF NOT EXISTS News (
	NewsID int AUTO_INCREMENT PRIMARY KEY,
    Title varchar(255) NOT NULL,
    URL varchar(1000) NOT NULL,
    Source varchar(255),
    INDEX IdxTitle (Title),
    INDEX IdxSource (Source)
);
    
CREATE TABLE IF NOT EXISTS Advice (
	AdviceID int AUTO_INCREMENT PRIMARY KEY,
    UtilityType enum('water', 'electricity', 'gas') NOT NULL,
    Title varchar(255) NOT NULL,
    Content text NOT NULL,
    INDEX IdxUtilityType (UtilityType)
);

INSERT INTO Advice (UtilityType, Title, Content)
VALUES
	('water', 'Short Showers', 'Doing great on saving! To save even more water, try keeping your showers under 8 minutes to reduce water waste.'),
    ('water', 'Tap Off', 'Nice work on keeping your usage low! Turning off the faucet while brushing your teeth or washing dishes is another great way to reduce your water usage.'),
    ('water', 'Full Loads', 'Your usage is looking great! Run dishwashers and washing machines only when full to save water.'),
    ('water', 'Fixing Leaks', 'A leaking faucet can waste thousands of gallons a year, so be sure to fix any leaks ASAP.'),
    ('water', 'Efficient Water Fixtures', 'Using low-flow showerheads and faucet aerators can help cut water usage drastically.'),
    ('water', 'Watering the Yard', 'Watering lawns and gardens? Consider switching to drought-tolerant landscaping or using drip irrigation to save on water.'),
    ('electricity', 'Unplug Devices', 'Great job staying efficient! Devices still draw power even when “off.” Try using a smart power strip.'),
    ('electricity', 'Daylight Over Lamps', 'Eco-warrior alert! Amazing job! Open windows and use natural light during the day instead of bulbs.'),
    ('electricity', 'LED Smart', 'Amazing at saving! Replace any remaining incandescent bulbs with energy-saving LEDs.'),
    ('electricity', 'Smart Thermostats', 'Heating and cooling take the most energy — automate them to run less.'),
    ('electricity', 'Phatom Load', 'Unplug TVs, chargers and computers when not in use to reduce electricity use.'),
    ('electricity', 'Major Appliance Audit', 'Consider replacing certain appliances (refrigerators, ACs, dryers, etc.) with Energy Star-rated ones.'),
    ('gas', 'Lowering the Thermostat', 'Your good habits are paying off! Lowering your thermostat just 1-2 degrees can significantly reduce gas usage.'),
    ('gas', 'Cook Efficiently', 'Efficient saver! Save on gas by using lids on pots to speed up cooking, and match pot size to burner.'),
    ('gas', 'Regular Heater Check', 'Excellent work! Keep up those good habits! Get your water heater checked yearly for optimal efficiency.'),
    ('gas', 'Home Insulation', 'Adding insulation or sealing windows and doors can help keep gas-powered heat inside.'),
    ('gas', 'Replace Gas Appliances', 'Older gas heaters, ovens, or dryers may waste energy. Consider upgrading to newer models to save in the long term.'),
    ('gas', 'Tankless Water Heater', 'Switching to a tankless water heater is much more efficient and only heats water when needed.');