// Mock user data for frontend demo
export const mockUsers = [
  {
    username: 'demo',
    password: 'demo', 
    email: 'demo@example.com'
  },
  {
    username: 'test',
    password: 'test',
    email: 'test@example.com'
  }
];

// Mock utility usage data
export const mockUtilityData = {
  water: [65.2, 68.1, 63.4, 67.6, 60.9, 61.3, 59.7],
  electricity: [22.3, 21.7, 20.9, 22.1, 21.5, 19.8, 20.4],
  gas: [78.3, 75.9, 79.2, 77.4, 76.1, 74.8, 73.5]
};

// Mock challenges data
export const mockChallenges = [
  // Current challenges (the ones the user is already participating in)
  {
    id: 1,
    title: '5-Minute Shower Challenge',
    description: 'Reduce your shower time to 5 minutes or less each day this week. Track your water usage and aim for at least a 10% reduction compared to your previous week.',
    utilityType: 'water',
    reductionTarget: 10.0,
    startDate: '2025-05-10',
    endDate: '2025-05-17',
    rewardPoints: 50
  },
  {
    id: 2,
    title: 'No Standby Electronics',
    description: 'Unplug all electronics when not in use for the entire week. This includes TV, computer, gaming consoles, etc. Track your electricity usage daily.',
    utilityType: 'electricity',
    reductionTarget: 15.0,
    startDate: '2025-05-09',
    endDate: '2025-05-16',
    rewardPoints: 75
  },
  {
    id: 3,
    title: 'Lower Thermostat Challenge',
    description: 'Lower your thermostat by 2 degrees this week and track your gas usage. Wear warmer clothes instead of raising the temperature.',
    utilityType: 'gas',
    reductionTarget: 12.0,
    startDate: '2025-05-11',
    endDate: '2025-05-18',
    rewardPoints: 60
  },

  // New available challenges
  {
    id: 8,
    title: 'Natural Lighting Challenge',
    description: 'For one week, try to maximize natural light in your home during the day. Keep blinds and curtains open, and avoid turning on electric lights until sunset.',
    utilityType: 'electricity',
    reductionTarget: 8.0,
    startDate: '2025-05-20',
    endDate: '2025-05-27',
    rewardPoints: 40
  },
  {
    id: 9,
    title: 'Efficient Dishwashing',
    description: 'Only run your dishwasher when it is completely full, and use the eco-mode if available. Track your water and electricity usage during the challenge period.',
    utilityType: 'water',
    reductionTarget: 15.0,
    startDate: '2025-05-18',
    endDate: '2025-05-25',
    rewardPoints: 55
  },
  {
    id: 10,
    title: 'Public Transport Week',
    description: 'Use public transportation, carpool, bike, or walk instead of driving alone for an entire week. While not directly tied to home utility usage, reducing transportation emissions is great for the environment!',
    utilityType: 'other',
    reductionTarget: 20.0,
    startDate: '2025-05-22',
    endDate: '2025-05-29',
    rewardPoints: 80
  },
  {
    id: 11,
    title: 'Smart Home Energy Monitor',
    description: 'Install a smart home energy monitoring system or app and track your energy usage patterns for a week. Identify the top energy consumers in your home.',
    utilityType: 'electricity',
    reductionTarget: 5.0,
    startDate: '2025-05-25',
    endDate: '2025-06-01',
    rewardPoints: 35
  },
  {
    id: 12,
    title: 'Water-Saving Bathroom Challenge',
    description: 'Install low-flow faucet aerators and a water-efficient showerhead. Track your water usage reduction over the challenge period.',
    utilityType: 'water',
    reductionTarget: 18.0,
    startDate: '2025-05-24',
    endDate: '2025-06-07',
    rewardPoints: 65
  }
];

// Mock user challenges data
export const mockUserChallenges = [
  // Active challenges
  {
    id: 1,
    title: '5-Minute Shower Challenge',
    utilityType: 'water',
    startDate: '2025-05-10',
    endDate: '2025-05-17',
    rewardPoints: 50,
    status: 'in progress',
    pointsEarned: 0
  },
  {
    id: 2,
    title: 'No Standby Electronics',
    utilityType: 'electricity',
    startDate: '2025-05-09',
    endDate: '2025-05-16',
    rewardPoints: 75,
    status: 'in progress',
    pointsEarned: 0
  },
  {
    id: 3,
    title: 'Lower Thermostat Challenge',
    utilityType: 'gas',
    startDate: '2025-05-11',
    endDate: '2025-05-18',
    rewardPoints: 60,
    status: 'in progress',
    pointsEarned: 0
  },

  // Completed challenges
  {
    id: 4,
    title: 'Leak Audit Challenge',
    utilityType: 'water',
    startDate: '2025-04-11',
    endDate: '2025-04-18',
    rewardPoints: 30,
    status: 'completed',
    dateCompleted: '2025-04-18',
    pointsEarned: 30
  },
  {
    id: 5,
    title: 'Energy Efficient Lighting',
    utilityType: 'electricity',
    startDate: '2025-03-15',
    endDate: '2025-03-22',
    rewardPoints: 45,
    status: 'completed',
    dateCompleted: '2025-03-22',
    pointsEarned: 45
  },
  {
    id: 6,
    title: 'Cold Water Laundry Week',
    utilityType: 'electricity',
    startDate: '2025-04-01',
    endDate: '2025-04-08',
    rewardPoints: 40,
    status: 'completed',
    dateCompleted: '2025-04-08',
    pointsEarned: 40
  },
  {
    id: 7,
    title: 'Phantom Power Hunter',
    utilityType: 'electricity',
    startDate: '2025-02-20',
    endDate: '2025-02-27',
    rewardPoints: 35,
    status: 'completed',
    dateCompleted: '2025-02-27',
    pointsEarned: 35
  }
];

// Mock news data
export const mockNews = [
  {
    id: 1,
    title: 'New Study Shows That Renewable Energy Could Meet Global Demand by 2050',
    url: 'https://www.example.com/renewable-energy-2050',
    source: 'Environmental Science Journal'
  },
  {
    id: 2,
    title: 'Local Community Cuts Water Usage by 30% Through Conservation Program',
    url: 'https://www.example.com/water-conservation-success',
    source: 'Local News'
  },
  {
    id: 3,
    title: 'Major City Announces Plan to Ban Single-Use Plastics by 2025',
    url: 'https://www.example.com/plastic-ban-initiative',
    source: 'City News Network'
  },
  {
    id: 4,
    title: 'Electric Vehicle Sales Surpass Gas-Powered Cars for First Time in Country History',
    url: 'https://www.example.com/ev-sales-milestone',
    source: 'Auto Industry Today'
  },
  {
    id: 5,
    title: 'World Leaders Agree to Ambitious Climate Goals at International Summit',
    url: 'https://www.example.com/climate-summit-goals',
    source: 'Global News Network'
  }
];

// Mock community data
export const mockCommunity = {
  leaderboard: [
    { userId: 1, username: 'EcoSarah', points: 350, challengesCompleted: 7 },
    { userId: 3, username: 'EarthAmy', points: 325, challengesCompleted: 6 },
    { userId: 2, username: 'GreenMike', points: 275, challengesCompleted: 5 },
    { userId: 8, username: 'demo', points: 150, challengesCompleted: 4 }, // Updated completed challenges count
    { userId: 5, username: 'EnviroEmma', points: 140, challengesCompleted: 3 },
    { userId: 4, username: 'SustainableJohn', points: 125, challengesCompleted: 2 }
  ],
  friends: [
    { userId: 1, username: 'EcoSarah', points: 350, challengesCompleted: 7 },
    { userId: 3, username: 'EarthAmy', points: 325, challengesCompleted: 6 },
    { userId: 5, username: 'EnviroEmma', points: 200, challengesCompleted: 4 }
  ],
  friendRequests: [
    { userId: 2, username: 'GreenMike', dateSent: '2025-05-10T14:22:31.000Z' }
  ]
};

// Mock notifications with rich data
export const mockNotifications = [
  "You've completed the 'Leak Audit Challenge' and earned 30 points!",
  "EarthAmy has accepted your friend request.",
  "New challenge available: 'Natural Lighting Challenge' starts next week!",
  "Your water usage was 15% lower this week - great job!",
  "You're in the top 10% of electricity savers in your community.",
  "Eco Tip: Consider installing a low-flow showerhead to save up to 15 gallons of water during a 10-minute shower.",
  "Challenge: The 'Cold Water Laundry Week' challenge starts in 5 days. Get ready to save electricity!",
  "GreenMike has sent you a friend request.",
  "Your gas usage increased by 12% compared to last week. Consider checking for leaks or inefficient appliances.",
  "Congratulations! You've saved 125 gallons of water this month.",
  "Community Update: You've moved up 3 spots on the leaderboard this week!",
  "Eco Tip: Unplugging electronics when not in use can save up to 10% on your electricity bill."
];