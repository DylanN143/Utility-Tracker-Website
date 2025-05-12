import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Challenges.css';

interface ChallengeProps {
  username: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  utilityType: 'water' | 'electricity' | 'gas';
  reductionTarget: number;
  startDate: string;
  endDate: string;
  rewardPoints: number;
  status?: 'in progress' | 'completed' | 'skipped';
  dateCompleted?: string;
  pointsEarned?: number;
}

const Challenges: React.FC<ChallengeProps> = ({ username }) => {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'my'>('available');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completionResponse, setCompletionResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (username) {
      fetchChallenges();
    }
  }, [username]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch active challenges
      const activeChallengesResponse = await axios.get(
        'http://localhost:8080/Backend/Backend?reqID=5'
      );
      
      if (activeChallengesResponse.data.success) {
        setActiveChallenges(activeChallengesResponse.data.challenges || []);
      }
      
      // Fetch user's challenges
      const userChallengesResponse = await axios.get(
        `http://localhost:8080/Backend/Backend?reqID=6&username=${username}`
      );
      
      if (userChallengesResponse.data.success) {
        setUserChallenges(userChallengesResponse.data.challenges || []);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Failed to load challenges. Please try again later.');
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId: number) => {
    try {
      const response = await axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 5, // JOIN_CHALLENGE
        challengeID: challengeId,
        username
      });
      
      if (response.data.success) {
        setSuccessMessage('Challenge joined successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchChallenges(); // Refresh challenge lists
      } else {
        setError('Failed to join challenge. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Error joining challenge:', err);
      setError('Failed to join challenge. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const completeChallenge = async (challengeId: number) => {
    if (!completionResponse.trim()) {
      setError('Please provide a response about how you completed the challenge.');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 6, // COMPLETE_CHALLENGE
        challengeID: challengeId,
        username,
        userResponse: completionResponse
      });
      
      if (response.data.success) {
        setIsModalOpen(false);
        setCompletionResponse('');
        setSuccessMessage('Challenge completed successfully! Points added to your account.');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchChallenges(); // Refresh challenge lists
      } else {
        setError('Failed to complete challenge. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Error completing challenge:', err);
      setError('Failed to complete challenge. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const skipChallenge = async (challengeId: number) => {
    try {
      const response = await axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 7, // SKIP_CHALLENGE
        challengeID: challengeId,
        username
      });
      
      if (response.data.success) {
        setSuccessMessage('Challenge skipped.');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchChallenges(); // Refresh challenge lists
      } else {
        setError('Failed to skip challenge. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Error skipping challenge:', err);
      setError('Failed to skip challenge. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const openChallengeModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChallenge(null);
    setCompletionResponse('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter out challenges that user has already joined
  const availableChallenges = activeChallenges.filter(
    activeChallenge => !userChallenges.some(
      userChallenge => userChallenge.id === activeChallenge.id
    )
  );

  const inProgressChallenges = userChallenges.filter(
    challenge => challenge.status === 'in progress'
  );

  return (
    <div className="challenges-container">
      <div className="challenges-title">
        <h2>Challenges</h2>
      </div>

      <div className="challenge-tabs">
        <button 
          className={`challenge-tab ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available Challenges
        </button>
        <button 
          className={`challenge-tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          My Challenges
        </button>
      </div>

      {error && <div className="form-message error-message">{error}</div>}
      {successMessage && <div className="form-message success-message">{successMessage}</div>}

      {loading ? (
        <div className="loading">Loading challenges...</div>
      ) : (
        <>
          {activeTab === 'available' && (
            <>
              {availableChallenges.length === 0 ? (
                <div className="no-challenges">
                  <p>No new challenges available right now. Check back soon!</p>
                </div>
              ) : (
                <div className="challenge-cards">
                  {availableChallenges.map(challenge => (
                    <div key={challenge.id} className="challenge-card">
                      <div className="challenge-card-header">
                        <h3 className="challenge-card-title">{challenge.title}</h3>
                        <span className={`challenge-card-utility ${challenge.utilityType}`}>
                          {challenge.utilityType.charAt(0).toUpperCase() + challenge.utilityType.slice(1)}
                        </span>
                      </div>
                      <div className="challenge-card-content">
                        <div className="challenge-card-dates">
                          {formatDate(challenge.startDate)} to {formatDate(challenge.endDate)}
                        </div>
                        <div className="challenge-card-points">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                            <path d="M13.54 8.97L9.5 11.4V17h2v-4.5l2.04-1.22L13.54 8.97z"/>
                            <path d="M10.93 6.47c.47-.32 1.28-.1 1.3.55 0 .63-.83.85-1.3.55-.46-.28-.44-1.1 0-1.1z"/>
                          </svg>
                          {challenge.rewardPoints} points
                        </div>
                        <div className="challenge-card-actions">
                          <button 
                            className="challenge-button join"
                            onClick={() => joinChallenge(challenge.id)}
                          >
                            Join Challenge
                          </button>
                          <button 
                            className="challenge-button view"
                            onClick={() => openChallengeModal(challenge)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'my' && (
            <>
              {userChallenges.length === 0 ? (
                <div className="no-challenges">
                  <p>You haven't joined any challenges yet. Check the Available Challenges tab to get started!</p>
                </div>
              ) : (
                <>
                  {inProgressChallenges.length > 0 && (
                    <>
                      <h3 className="challenges-subtitle">In Progress</h3>
                      <div className="challenge-cards">
                        {inProgressChallenges.map(challenge => (
                          <div key={challenge.id} className="challenge-card">
                            <div className="challenge-card-header">
                              <h3 className="challenge-card-title">{challenge.title}</h3>
                              <span className={`challenge-card-utility ${challenge.utilityType}`}>
                                {challenge.utilityType.charAt(0).toUpperCase() + challenge.utilityType.slice(1)}
                              </span>
                            </div>
                            <div className="challenge-card-content">
                              <div className="challenge-card-dates">
                                {formatDate(challenge.startDate)} to {formatDate(challenge.endDate)}
                              </div>
                              <div className="challenge-card-points">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                  <path d="M13.54 8.97L9.5 11.4V17h2v-4.5l2.04-1.22L13.54 8.97z"/>
                                  <path d="M10.93 6.47c.47-.32 1.28-.1 1.3.55 0 .63-.83.85-1.3.55-.46-.28-.44-1.1 0-1.1z"/>
                                </svg>
                                {challenge.rewardPoints} points
                              </div>
                              <div className="challenge-card-actions">
                                <button 
                                  className="challenge-button complete"
                                  onClick={() => openChallengeModal({...challenge, description: ''})}
                                >
                                  Complete
                                </button>
                                <button 
                                  className="challenge-button skip"
                                  onClick={() => skipChallenge(challenge.id)}
                                >
                                  Skip
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Completed and Skipped challenges would go here */}
                  <h3 className="challenges-subtitle">Past Challenges</h3>
                  <div className="challenge-cards">
                    {userChallenges
                      .filter(challenge => challenge.status !== 'in progress')
                      .map(challenge => (
                        <div key={challenge.id} className="challenge-card">
                          <div className="challenge-card-header">
                            <h3 className="challenge-card-title">{challenge.title}</h3>
                            <span className={`challenge-card-utility ${challenge.utilityType}`}>
                              {challenge.utilityType.charAt(0).toUpperCase() + challenge.utilityType.slice(1)}
                            </span>
                            <span className={`challenge-status ${challenge.status === 'completed' ? 'completed' : 'skipped'}`}>
                              {challenge.status === 'completed' ? 'Completed' : 'Skipped'}
                            </span>
                          </div>
                          <div className="challenge-card-content">
                            <div className="challenge-card-dates">
                              {formatDate(challenge.startDate)} to {formatDate(challenge.endDate)}
                            </div>
                            {challenge.status === 'completed' && (
                              <div className="challenge-card-points">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                  <path d="M13.54 8.97L9.5 11.4V17h2v-4.5l2.04-1.22L13.54 8.97z"/>
                                  <path d="M10.93 6.47c.47-.32 1.28-.1 1.3.55 0 .63-.83.85-1.3.55-.46-.28-.44-1.1 0-1.1z"/>
                                </svg>
                                Earned: {challenge.pointsEarned} points
                              </div>
                            )}
                            <div className="challenge-card-actions">
                              <button 
                                className="challenge-button view"
                                onClick={() => openChallengeModal({...challenge, description: ''})}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Challenge Modal */}
      {isModalOpen && selectedChallenge && (
        <div className="challenge-modal">
          <div className="challenge-modal-content">
            <div className="challenge-modal-header">
              <h2 className="challenge-modal-title">{selectedChallenge.title}</h2>
              <button className="challenge-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="challenge-modal-body">
              <span className={`challenge-modal-utility challenge-card-utility ${selectedChallenge.utilityType}`}>
                {selectedChallenge.utilityType.charAt(0).toUpperCase() + selectedChallenge.utilityType.slice(1)}
              </span>
              
              {selectedChallenge.description ? (
                <p className="challenge-modal-description">{selectedChallenge.description}</p>
              ) : (
                <p className="challenge-modal-description">Loading challenge details...</p>
              )}
              
              <div className="challenge-modal-details">
                <div className="challenge-modal-detail">
                  <span className="challenge-modal-detail-label">Start Date</span>
                  <span className="challenge-modal-detail-value">{formatDate(selectedChallenge.startDate)}</span>
                </div>
                <div className="challenge-modal-detail">
                  <span className="challenge-modal-detail-label">End Date</span>
                  <span className="challenge-modal-detail-value">{formatDate(selectedChallenge.endDate)}</span>
                </div>
                <div className="challenge-modal-detail">
                  <span className="challenge-modal-detail-label">Reduction Target</span>
                  <span className="challenge-modal-detail-value">{selectedChallenge.reductionTarget}%</span>
                </div>
                <div className="challenge-modal-detail">
                  <span className="challenge-modal-detail-label">Points</span>
                  <span className="challenge-modal-detail-value">{selectedChallenge.rewardPoints}</span>
                </div>
              </div>
              
              {selectedChallenge.status === 'in progress' && (
                <div className="challenge-completion-form">
                  <label htmlFor="completion-response">
                    How did you complete this challenge? Share your experience:
                  </label>
                  <textarea
                    id="completion-response"
                    value={completionResponse}
                    onChange={(e) => setCompletionResponse(e.target.value)}
                    placeholder="Describe how you completed the challenge and what you learned..."
                  />
                  <div className="challenge-completion-actions">
                    <button 
                      className="challenge-button skip"
                      onClick={() => skipChallenge(selectedChallenge.id)}
                    >
                      Skip Challenge
                    </button>
                    <button 
                      className="challenge-button complete"
                      onClick={() => completeChallenge(selectedChallenge.id)}
                    >
                      Complete Challenge
                    </button>
                  </div>
                </div>
              )}
              
              {selectedChallenge.status === 'completed' && (
                <div className="challenge-completed-info">
                  <p><strong>Completed on:</strong> {formatDate(selectedChallenge.dateCompleted || '')}</p>
                  <p><strong>Points earned:</strong> {selectedChallenge.pointsEarned}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;