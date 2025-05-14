import React, { useState, useEffect, useRef } from 'react';
import './Notifications.css';
import axios from 'axios';

interface NotificationsProp {
  username: string;
}

type Notification = {
  id: string;
  message: string;
  type: 'eco-tip' | 'reminder' | 'challenge';
  isRead: boolean;
  timestamp: Date;
  tableID: number
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
    const response = await axios.get(`http://localhost:8080/Backend/Backend?reqID=10&username=${username}`);

    if (response.data.success) {
      const notificationsData = (response.data.notifications); // Assuming it's already a JSON array
    
      // Transform the data to our frontend format
      const transformedNotifications = notificationsData.map((item: any) => ({
        id: `notif-${item.id}`, // Ensure it's a string
        tableID: item.id,
        message: item.text,
        type: item.type as 'eco-tip' | 'reminder' | 'challenge',
        isRead: item.status === 'read',
        timestamp: new Date(), // You can replace this with an actual timestamp if available
      }));

      // Merge new notifications with existing ones, avoiding duplicates
      setNotifications(prev => {
        const existingIDs = new Set(prev.map(n => n.tableID));
        const uniqueNew = transformedNotifications.filter((n: Notification) => !existingIDs.has(n.tableID));
        return [...uniqueNew, ...prev];
      });
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const markAllAsRead = () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);

    unreadNotifications.forEach(n => {
      const apiResponse = axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 11, 
        id: n.tableID,
        status: "read" 
      });
    });

    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    const apiResponse = axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 12,
        username: username
      });

    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    const target = notifications.find(n => n.id === id && !n.isRead);
  
    if (target) {
      const { id, message, type, isRead, timestamp, tableID } = target;

      const apiResponse = axios.post('http://localhost:8080/Backend/Backend', {
        reqID: 11, 
        id: target.tableID,
        status: "read" 
      });
    }

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