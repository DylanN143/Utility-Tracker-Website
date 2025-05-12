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