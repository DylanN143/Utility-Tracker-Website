import React, { useState, useEffect, useRef } from 'react';
import './Notifications.css';
import axios from 'axios';
// Import mock data for demo
import { mockNotifications } from '../mockData/userData';

interface NotificationsProp {
  username: string;
}

type Notification = {
  id: string;
  message: string;
  type: 'eco-tip' | 'reminder' | 'challenge';
  isRead: boolean;
  timestamp: Date;
};

const Notifications: React.FC<NotificationsProp> = ({ username }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch notifications when component mounts and when username changes
    if (username) {
      fetchNotifications();
    }
    
    // Set up a timer to check for new notifications periodically
    const intervalId = setInterval(() => {
      if (username) {
        fetchNotifications();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [username]);
  
  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && 
          !(event.target as Element).classList.contains('notification-icon')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      // DEMO MODE: Using mock data instead of making API request
      console.log('Using mock notifications for demo');

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));

      // Use mock notification data
      const notificationsData = mockNotifications;

      // Transform the data to our notification format
      const transformedNotifications = notificationsData.map((message: string, index: number) => {
        // Determine notification type based on content
        let type: 'eco-tip' | 'reminder' | 'challenge' = 'reminder';
        if (message.includes('Eco Tip:')) {
          type = 'eco-tip';
        } else if (message.includes('Challenge:')) {
          type = 'challenge';
        }

        return {
          id: `${Date.now()}-${index}`,
          message,
          type,
          isRead: false,
          timestamp: new Date(Date.now() - (index * 1000 * 60 * 60)) // Stagger timestamps
        };
      });

      // Merge new notifications with existing ones, avoiding duplicates
      setNotifications(prev => {
        const existingMessages = new Set(prev.map(n => n.message));
        const uniqueNewNotifications = transformedNotifications.filter(
          (n: Notification) => !existingMessages.has(n.message)
        );

        return [...uniqueNewNotifications, ...prev];
      });

      /* Original server-based code (commented out for demo)
      const response = await axios.get(`http://localhost:8080/Backend/Backend?reqID=4&username=${username}`);

      if (response.data.success) {
        const notificationsData = JSON.parse(response.data.notifications);

        // Transform the data to our notification format
        const transformedNotifications = notificationsData.map((message: string, index: number) => {
          // Determine notification type based on content
          let type: 'eco-tip' | 'reminder' | 'challenge' = 'reminder';
          if (message.includes('Eco Tip:')) {
            type = 'eco-tip';
          } else if (message.includes('Challenge:')) {
            type = 'challenge';
          }

          return {
            id: `${Date.now()}-${index}`,
            message,
            type,
            isRead: false,
            timestamp: new Date()
          };
        });

        // Merge new notifications with existing ones, avoiding duplicates
        setNotifications(prev => {
          const existingMessages = new Set(prev.map(n => n.message));
          const uniqueNewNotifications = transformedNotifications.filter(
            (n: Notification) => !existingMessages.has(n.message)
          );

          return [...uniqueNewNotifications, ...prev];
        });
      }
      */
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={toggleNotifications}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
        </svg>
        {unreadCount > 0 && <div className="notification-count">{unreadCount}</div>}
      </div>
      
      {isOpen && (
        <div className="notification-panel" ref={panelRef}>
          <div className="notification-header">
            <h3>Notifications</h3>
            <div>
              {notifications.length > 0 && (
                <>
                  <button className="clear-all" onClick={markAllAsRead}>Mark all as read</button>
                  {' • '}
                  <button className="clear-all" onClick={clearAll}>Clear all</button>
                </>
              )}
            </div>
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.type} ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{formatTime(notification.timestamp)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;