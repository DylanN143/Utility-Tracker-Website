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
    UtilityType enum('water', 'electricity', 'gas', 'other') NOT NULL,
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

CREATE TABLE IF NOT EXISTS Notifications (
	NotificationID int AUTO_INCREMENT PRIMARY KEY,
    UserID int NOT NULL,
    NotificationStatus enum('unread', 'read') DEFAULT 'unread',
    NotificationType enum('eco-tip', 'reminder', 'challenge') DEFAULT 'reminder',
    Notification varchar(255),
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE
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

INSERT INTO User (Username, Password, Email)
VALUES
    ('testUser1', 'testPass1', 'test123@gmail.com'),
    ('testUser2', 'testPass2', 'test456@gmail.com'),
    ('testUser3', 'testPass3', 'test789@gmail.com');

INSERT INTO GasUsage (UserID, CubicFeet, DateLogged) 
VALUES
    (1, 15, '2025-05-13 21:00:05'),
    (1, 95, '2025-05-12 1:00:05'),
    (1, 35, '2025-05-11 21:00:05'),
    (1, 100, '2025-05-10 21:00:05'),
    (1, 55, '2025-05-09 21:00:05'),
    (1, 35, '2025-05-08 21:00:05'),
    (1, 100, '2025-05-07 21:00:05'),
    (2, 55, '2025-05-06 21:00:05'),
    (2, 15, '2025-05-13 21:00:05'),
    (2, 95, '2025-05-12 1:00:05'),
    (2, 35, '2025-05-11 21:00:05'),
    (2, 100, '2025-05-10 21:00:05'),
    (2, 55, '2025-05-09 21:00:05'),
    (2, 35, '2025-05-08 21:00:05'),
    (2, 100, '2025-05-07 21:00:05'),
    (2, 55, '2025-05-06 21:00:05'),
    (3, 15, '2025-05-13 21:00:05'),
    (3, 95, '2025-05-12 1:00:05'),
    (3, 35, '2025-05-11 21:00:05'),
    (3, 100, '2025-05-10 21:00:05'),
    (3, 55, '2025-05-09 21:00:05'),
    (3, 35, '2025-05-08 21:00:05'),
    (3, 100, '2025-05-07 21:00:05'),
    (3, 55, '2025-05-06 21:00:05');
    

INSERT INTO WaterUsage (UserID, Gallons, DateLogged)
VALUES
    (1, 60, '2025-05-13 21:00:05'),
    (1, 49, '2025-05-12 1:00:05'),
    (1, 34, '2025-05-11 21:00:05'),
    (1, 120, '2025-05-10 21:00:05'),
    (1, 90, '2025-05-09 21:00:05'),
    (1, 220, '2025-05-08 21:00:05'),
    (1, 190, '2025-05-07 21:00:05'),
    (1, 150, '2025-05-06 21:00:05'),
    (2, 60, '2025-05-13 21:00:05'),
    (2, 49, '2025-05-12 1:00:05'),
    (2, 34, '2025-05-11 21:00:05'),
    (2, 120, '2025-05-10 21:00:05'),
    (2, 90, '2025-05-09 21:00:05'),
    (2, 220, '2025-05-08 21:00:05'),
    (2, 190, '2025-05-07 21:00:05'),
    (2, 150, '2025-05-06 21:00:05'),
	(3, 60, '2025-05-13 21:00:05'),
    (3, 49, '2025-05-12 1:00:05'),
    (3, 34, '2025-05-11 21:00:05'),
    (3, 120, '2025-05-10 21:00:05'),
    (3, 90, '2025-05-09 21:00:05'),
    (3, 220, '2025-05-08 21:00:05'),
    (3, 190, '2025-05-07 21:00:05'),
    (3, 150, '2025-05-06 21:00:05');

INSERT INTO ElectricityUsage (UserID, KilowattHour, DateLogged)
VALUES
    (1, 13, '2025-05-13 21:00:05'),
    (1, 95, '2025-05-12 1:00:05'),
    (1, 25, '2025-05-11 21:00:05'),
    (1, 30, '2025-05-10 21:00:05'),
    (1, 15, '2025-05-09 21:00:05'),
    (1, 12, '2025-05-08 21:00:05'),
    (1, 14, '2025-05-07 21:00:05'),
    (1, 21, '2025-05-06 21:00:05'),
    (2, 13, '2025-05-13 21:00:05'),
    (2, 95, '2025-05-12 1:00:05'),
    (2, 25, '2025-05-11 21:00:05'),
    (2, 30, '2025-05-10 21:00:05'),
    (2, 15, '2025-05-09 21:00:05'),
    (2, 12, '2025-05-08 21:00:05'),
    (2, 14, '2025-05-07 21:00:05'),
    (2, 21, '2025-05-06 21:00:05'),
    (3, 13, '2025-05-13 21:00:05'),
    (3, 95, '2025-05-12 1:00:05'),
    (3, 25, '2025-05-11 21:00:05'),
    (3, 30, '2025-05-10 21:00:05'),
    (3, 15, '2025-05-09 21:00:05'),
    (3, 12, '2025-05-08 21:00:05'),
    (3, 14, '2025-05-07 21:00:05'),
    (3, 21, '2025-05-06 21:00:05');

INSERT INTO Challenge (Title, ChallengeDescription, UtilityType, ReductionTarget, StartDate, EndDate, RewardPoints) 
VALUES
    ('5-Minute Shower Challenge', 'Reduce your shower time to 5 minutes or less each day this week. Track your water usage and aim for at least a 10% reduction compared to your previous week.', 'water', 10.0, '2025-05-10', '2025-05-17', 50),
    ('No Standby Electronics', 'Unplug all electronics when not in use for the entire week. This includes TV, computer, gaming consoles, etc. Track your electricity usage daily.', 'electricity', 15.0, '2025-05-09', '2025-05-16', 75),
    ('Lower Thermostat Challenge', 'Lower your thermostat by 2 degrees this week and track your gas usage. Wear warmer clothes instead of raising the temperature.', 'gas', 12.0, '2025-05-11', '2025-05-18', 60),
    ('Natural Lighting Challenge', 'For one week, try to maximize natural light in your home during the day. Keep blinds and curtains open, and avoid turning on electric lights until sunset.', 'electricity', 8.0, '2025-05-11', '2025-05-27', 40),
    ('Efficient Dishwashing', 'Only run your dishwasher when it is completely full, and use the eco-mode if available. Track your water and electricity usage during the challenge period.', 'water', 15.0, '2025-05-03', '2025-05-25', 55),
    ('Public Transport Week', 'Use public transportation, carpool, bike, or walk instead of driving alone for an entire week. While not directly tied to home utility usage, reducing transportation emissions is great for the environment!', 'other', 20.0, '2025-05-01', '2025-05-29', 80),
    ('Smart Home Energy Monitor', 'Install a smart home energy monitoring system or app and track your energy usage patterns for a week. Identify the top energy consumers in your home.', 'electricity', 5.0, '2025-05-12', '2025-06-01', 35),
    ('Water-Saving Bathroom Challenge', 'Install low-flow faucet aerators and a water-efficient showerhead. Track your water usage reduction over the challenge period.', 'water', 18.0, '2025-05-04', '2025-06-07', 65),
    ('Leak Audit Challenge', 'Check for any water leaks around the house, it may save you some money!', 'water', 5.0, '2025-05-11', '2025-05-18', 30),
    ('Energy Efficient Lighting', 'Try shopping around for LED bulbs. LED is much more power efficient, saving you money in the long run!', 'electricity', 7.5, '2025-05-07', '2025-05-21', 45),
    ('Cold Water Laundry Week', 'Cold water prevents the need to heat up the water to do your laundry creating electricity savings. Additionally, cold water is more gentle on your clothes, which will help preserve them!', 'electricity', 6.0, '2025-05-10', '2025-05-20', 40),
    ('Phantom Power Hunter', 'Devices left plugged in, but not in use still use a small amount of power. Unplug unused devices to see electricity savings!', 'electricity', 3.0, '2025-05-05', '2025-05-22', 35);