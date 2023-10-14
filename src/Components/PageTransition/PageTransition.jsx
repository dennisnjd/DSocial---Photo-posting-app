import React, { useState, useEffect } from 'react';
import './PageTransition.css';

const PageTransition = ({ children }) => {
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTransition(true);
    }, 1700); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page-transition ${showTransition ? 'fade-in' : 'fade-out'}`}>
      {children}
    </div>
  );
};

export default PageTransition;
