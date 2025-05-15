import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Community.css';

interface CommunityProps {
  username: string;
}

interface LeaderboardEntry {
  userId: number;
  username: string;
  points: number;
  isUser: boolean;
  challengesCompleted: number;
}

interface FriendRequest {
  userId: number;
  username: string;
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
      setError('');
      
      // Fetch leaderboard
      const leaderboardResponse = await axios.get(
        `http://localhost:8080/Backend/Backend?reqID=8&username=${username}`
      );

      if (leaderboardResponse.data.success && Array.isArray(leaderboardResponse.data.leaderboard)) {
        const mappedProperties: LeaderboardEntry[] = leaderboardResponse.data.leaderboard.map((l: any) => ({
          userId: l.id,
          username: l.username,
          points: l.points,
          challengesCompleted: l.challengesCompleted,
          isUser: l.isUser
        }));
        setLeaderboard(mappedProperties);
      }
      else {
        console.log("No users found");
      }

      // Fetch user's friends
      const friendsResponse = await axios.get(
        `http://localhost:8080/Backend/Backend?reqID=9&username=${username}`
      );

      if (friendsResponse.data.success && Array.isArray(friendsResponse.data.friends)) {
        console.log(friendsResponse.data);
        const mappedProperties: LeaderboardEntry[] = friendsResponse.data.friends.map((l: any) => ({
          userId: l.id,
          username: l.username,
          points: l.points,
          challengesCompleted: l.challengesCompleted,
          isUser: l.isUser
        }));
        setFriends(mappedProperties);
      }
      else {
        console.log("No friends found");
      }

      // Fetch friend requests
      const requestsResponse = await axios.get(
        `http://localhost:8080/Backend/Backend?reqID=3&username=${username}`
      );

      if (requestsResponse.data.success && Array.isArray(requestsResponse.data.friends)) {
        const mappedProperties: FriendRequest[] = requestsResponse.data.friends.map((f: any) => ({
          userId: f.id,
          username: f.username
        }));
        setFriendRequests(mappedProperties);
      }
      else {
        console.log("No friends found");
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching community data:', err);
      setError('Failed to load community data. Please try again later.');
      setLoading(false);
    }
  };

  const sendFriendRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!friendUsername.trim()) {
      setError('Please enter a username.');
      return;
    }

    if (friendUsername === username)
    {
      setError('Please enter a valid username.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 3, // ADD_FRIEND
        sender: username,
        receiver: friendUsername
      });

      if (response.data.success) {
        setSuccessMessage(`Friend request sent to ${friendUsername}.`);
        setFriendUsername('');
        setTimeout(() => setSuccessMessage(''), 3000);

        const notificationText = `${username} sent you a friend request!`;

        const responseNotif = await axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 10, 
        username: friendUsername,
        text: notificationText,
        type: "reminder"
      });

      } else {
        setError('Failed to send friend request. The user may not exist or you may already have sent a request.');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Error sending friend request:', err);
      setError('Failed to send friend request. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const respondToFriendRequest = async (requesterUsername: string, response: 'accept' | 'reject') => {
    try {
      const apiResponse = await axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 7, // RESPOND_TO_FRIEND_REQUEST
        sender: requesterUsername,
        receiver: username,
        action: response ? 'accepted' : 'rejected'
      });

      if (apiResponse.data.success) {
        setSuccessMessage(`You have ${response === 'accept' ? 'accepted' : 'rejected'} the friend request.`);
        setTimeout(() => setSuccessMessage(''), 3000);

        // Refresh friend requests and friends list
        fetchData();

        const resp = response ? 'accepted' : 'rejected';
        const notificationText = `${username} has ${resp} your friend request!`;

        const responseNotif = await axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 10,
        username: requesterUsername,
        text: notificationText,
        type: "reminder"
        })

      } else {
        setError('Failed to respond to friend request. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Error responding to friend request:', err);
      setError('Failed to respond to friend request. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
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
                    <div className="leaderboard-username">{entry.isUser ? entry.username + " (You)" : entry.username}</div>
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
                        <h3 className="friend-name">{friend.isUser ? friend.username + " (You)" : friend.username}</h3>
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