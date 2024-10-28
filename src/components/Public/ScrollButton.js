import React, { useState, useEffect } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

function ScrollButton() {
  const [showUpButton, setShowUpButton] = useState(false);
  const [showDownButton, setShowDownButton] = useState(false);

  const buttonStyle = {
    borderRadius: '100%',
    width: '70px',
    height: '70px',
    backgroundColor: '#f8c6f9',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    zIndex: '1000',
  };

  const handleScroll = () => {
    const element = document.documentElement;
    const scrollTop = element.scrollTop;
  
    setShowUpButton(scrollTop > 100);
    setShowDownButton(scrollTop < element.scrollHeight - element.clientHeight - 100);
  };
  

  const handleScrollClick = (direction) => {
    const element = document.documentElement;

    if (direction === 'up') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else if (direction === 'down') {
      const scrollHeight = element.scrollHeight - element.clientHeight;
      window.scrollTo({
        top: scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {showUpButton && (
        <button
          className="btn btn-secondary"
          style={buttonStyle}
          onClick={() => handleScrollClick('up')}
        >
          <MdExpandLess size={50} />
        </button>
      )}

      {showDownButton && (
        <button
          className="btn btn-secondary"
          style={buttonStyle}
          onClick={() => handleScrollClick('down')}
        >
          <MdExpandMore size={50} />
        </button>
      )}
    </>
  );
}

export default ScrollButton;