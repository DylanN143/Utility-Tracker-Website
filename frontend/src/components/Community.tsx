import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Community.css';
// Import mock data for demo
import { mockCommunity } from '../mockData/userData';

interface CommunityProps {
  username: string;
}

interface LeaderboardEntry {
  userId: number;
  username: string;
  points: number;
  challengesCompleted: number;
}

interface FriendRequest {
  userId: number;
  username: string;
  dateSent: string;
}

const Community: React.FC<CommunityProps> = ({ username }) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends' | 'add-friend'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [friends, setFriends] = useState<LeaderboardEntry[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendUsername, setFriendUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (username) {
      fetchData();
    }
  }, [username]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // DEMO MODE: Use mock data instead of API calls
      console.log('Using mock community data for demo');

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Use mock community data
      setLeaderboard(mockCommunity.leaderboard);
      setFriends(mockCommunity.friends);
      setFriendRequests(mockCommunity.friendRequests);
      setLoading(false);
      setError('');

      /* Original server-based code (commented out for demo)
      // Fetch leaderboard
      const leaderboardResponse = await axios.get(
        'http://localhost:8080/Backend/Backend?reqID=8'
      );

      if (leaderboardResponse.data.success) {
        setLeaderboard(leaderboardResponse.data.leaderboard || []);
      }

      // Fetch user's friends
      const friendsResponse = await axios.get(
        `http://localhost:8080/Backend/Backend?reqID=9&username=${username}`
      );

      if (friendsResponse.data.success) {
        setFriends(friendsResponse.data.friends || []);
      }

      // Fetch friend requests
      const requestsResponse = await axios.get(
        `http://localhost:8080/Backend/Backend?reqID=10&username=${username}`
      );

      if (requestsResponse.data.success) {
        setFriendRequests(requestsResponse.data.friendRequests || []);
      }

      setLoading(false);
      */
    } catch (err) {
      console.error('Error fetching community data:', err);
      setError('Failed to load community data. Please try again later.');
      setLoading(false);
    }
  };

  // Function to "send" a friend request in demo mode
  const handleDemoFriendRequest = async (newFriendUsername: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setSuccessMessage(`Friend request sent to ${newFriendUsername}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const sendFriendRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!friendUsername.trim()) {
      setError('Please enter a username.');
      return;
    }

    // DEMO MODE: Use mock friend request function
    handleDemoFriendRequest(friendUsername);
    setFriendUsername(''); // Clear input field

    /* Original server-based code (commented out for demo)
    try {
      const response = await axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 8, // SEND_FRIEND_REQUEST
        senderUsername: username,
        receiverUsername: friendUsername
      });

      if (response.data.success) {
        setSuccessMessage(`Friend request sent to ${friendUsername}.`);
        setFriendUsername('');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to send friend request. The user may not exist or you may already have sent a request.');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Error sending friend request:', err);
      setError('Failed to send friend request. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
    */
  };

  // Function to handle friend request response in demo mode
  const handleDemoFriendResponse = async (requesterUsername: string, responseType: 'accept' | 'reject') => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setSuccessMessage(`You have ${responseType === 'accept' ? 'accepted' : 'rejected'} the friend request.`);

    // In demo mode, update the UI to reflect the change
    if (responseType === 'accept') {
      // Add the friend to the friends list
      const newFriend = {
        userId: Math.floor(Math.random() * 1000), // Demo ID
        username: requesterUsername,
        points: Math.floor(Math.random() * 200),
        challengesCompleted: Math.floor(Math.random() * 5)
      };
      setFriends([...friends, newFriend]);
    }

    // Remove from friend requests in either case
    setFriendRequests(friendRequests.filter(req => req.username !== requesterUsername));

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const respondToFriendRequest = async (requesterUsername: string, response: 'accept' | 'reject') => {
    // DEMO MODE: Use mock friend response function
    handleDemoFriendResponse(requesterUsername, response);

    /* Original server-based code (commented out for demo)
    try {
      const apiResponse = await axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 9, // RESPOND_TO_FRIEND_REQUEST
        responderUsername: username,
        requesterUsername,
        response
      });

      if (apiResponse.data.success) {
        setSuccessMessage(`You have ${response === 'accept' ? 'accepted' : 'rejected'} the friend request.`);
        setTimeout(() => setSuccessMessage(''), 3000);

        // Refresh friend requests and friends list
        fetchData();
      } else {
        setError('Failed to respond to friend request. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Error responding to friend request:', err);
      setError('Failed to respond to friend request. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
    */
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="community-container">
      <div className="community-title">
        <h2>EcoTrack Community</h2>
      </div>

      <div className="community-tabs">
        <button 
          className={`community-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
        <button 
          className={`community-tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          My Friends{friendRequests.length > 0 ? ` (${friendRequests.length})` : ''}
        </button>
        <button 
          className={`community-tab ${activeTab === 'add-friend' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-friend')}
        >
          Add Friend
        </button>
      </div>

      {error &&
        <div style={{
          padding: '10px 15px',
          margin: '10px 0',
          borderRadius: '4px',
          textAlign: 'center',
          backgroundColor: '#ffebee',
          color: '#c62828',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      }
      {successMessage &&
        <div style={{
          padding: '10px 15px',
          margin: '10px 0',
          borderRadius: '4px',
          textAlign: 'center',
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          border: '1px solid #c8e6c9'
        }}>
          {successMessage}
        </div>
      }

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#333', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', margin: '20px 0' }}>
          Loading community data...
        </div>
      ) : (
        <>
          {activeTab === 'leaderboard' && (
            <div className="leaderboard-container">
              <h3 className="form-title">Global Leaderboard</h3>
              
              <div className="leaderboard-header">
                <div>Rank</div>
                <div>User</div>
                <div>Points</div>
                <div>Challenges</div>
              </div>
              
              {leaderboard.length === 0 ? (
                <div className="no-items-message">No users on the leaderboard yet.</div>
              ) : (
                leaderboard.map((entry, index) => (
                  <div key={entry.userId} className="leaderboard-user">
                    <div className={`leaderboard-rank ${index < 3 ? `top-${index + 1}` : ''}`}>{index + 1}</div>
                    <div className="leaderboard-username">{entry.username}</div>
                    <div className="leaderboard-points">{entry.points} pts</div>
                    <div className="leaderboard-challenges">{entry.challengesCompleted} completed</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'friends' && (
            <>
              {friendRequests.length > 0 && (
                <div className="friend-requests-container">
                  <h3 className="form-title">Friend Requests</h3>
                  
                  {friendRequests.map(request => (
                    <div key={request.userId} className="friend-request">
                      <div className="friend-request-info">
                        <div className="friend-request-avatar">{getInitials(request.username)}</div>
                        <div className="friend-request-name">{request.username}</div>
                      </div>
                      <div className="friend-request-actions">
                        <button 
                          className="friend-request-button accept"
                          onClick={() => respondToFriendRequest(request.username, 'accept')}
                        >
                          Accept
                        </button>
                        <button 
                          className="friend-request-button reject"
                          onClick={() => respondToFriendRequest(request.username, 'reject')}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <h3 className="form-title">My Friends</h3>
              
              {friends.length === 0 ? (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#333',
                  fontStyle: 'italic',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px'
                }}>
                  You haven't added any friends yet. Use the "Add Friend" tab to connect with other users.
                </div>
              ) : (
                <div className="friends-container">
                  {friends.map(friend => (
                    <div key={friend.userId} className="friend-card">
                      <div className="friend-header">
                        <div className="friend-avatar">{getInitials(friend.username)}</div>
                        <h3 className="friend-name">{friend.username}</h3>
                      </div>
                      <div className="friend-content">
                        <div className="friend-stats">
                          <div className="friend-stat">
                            <div className="friend-stat-label">Points</div>
                            <div className="friend-stat-value points">{friend.points}</div>
                          </div>
                          <div className="friend-stat">
                            <div className="friend-stat-label">Challenges</div>
                            <div className="friend-stat-value challenges">{friend.challengesCompleted}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'add-friend' && (
            <div className="add-friend-form">
              <h3 className="form-title">Add a Friend</h3>
              
              <form onSubmit={sendFriendRequest}>
                <div className="form-group">
                  <label htmlFor="friend-username">Friend's Username</label>
                  <input 
                    type="text" 
                    id="friend-username" 
                    value={friendUsername} 
                    onChange={(e) => setFriendUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="form-button">
                    Send Friend Request
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Community;