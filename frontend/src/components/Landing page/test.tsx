import React, { useState } from 'react';
import './test.css'

const TestComponent = () => {
    const [notificationActive, setNotificationActive] = useState(false);

    const handleClick = () => {
      setNotificationActive(true);
  
      // Reset notification after a delay (simulated with setTimeout)
      setTimeout(() => setNotificationActive(false), 1000); // Adjust duration as needed
    };
  
    return (
      <div className="button-with-notification">
        <button className="notification-button" onClick={handleClick}>
          Click Me
        </button>
        {notificationActive && (
          <div className="notification-icon">🔔</div>
        )}
      </div>
    );
  };
  
  

export default TestComponent;
