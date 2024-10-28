// NotFound.js


import React, { useEffect, useState } from 'react';
import "../../styles/NotFound.css";
import { Link } from 'react-router-dom'; 

const ErrorPage = () => {
  const [counter, setCounter] = useState(6); // Number of card containers

  useEffect(() => {
    const stackContainer = document.querySelector('.stack-container');
    const cardNodes = document.querySelectorAll('.card-container');
    const perspecNodes = document.querySelectorAll('.perspec');

    // Function to generate random number
    const randomIntFromInterval = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    // After tilt animation, fire the explode animation
    const handleCardAnimationEnd = () => {
      perspecNodes.forEach((elem) => {
        elem.classList.add('explode');
      });
    };

    // After explode animation, do a bunch of stuff
    const handlePerspecAnimationEnd = (e) => {
      if (e.animationName === 'explode') {
        cardNodes.forEach((elem) => {
          // Add hover animation class
          elem.classList.add('pokeup');

          // Add event listener to throw card on click
          elem.addEventListener('click', () => {
            const updown = [800, -800];
            const randomY = updown[Math.floor(Math.random() * updown.length)];
            const randomX = Math.floor(Math.random() * 1000) - 1000;
            elem.style.transform = `translate(${randomX}px, ${randomY}px) rotate(-540deg)`;
            elem.style.transition = 'transform 1s ease, opacity 2s';
            elem.style.opacity = '0';
            setCounter((prevCounter) => prevCounter - 1);
            if (counter === 1) {
              stackContainer.style.width = '0';
              stackContainer.style.height = '0';
            }
          });

          // Generate random number of lines of code between 4 and 10 and add to each card
          const numLines = randomIntFromInterval(5, 10);

          // Loop through the lines and add them to the DOM
          for (let index = 0; index < numLines; index++) {
            const lineLength = randomIntFromInterval(25, 97);
            const node = document.createElement('li');
            node.classList.add('node-' + index);
            elem.querySelector('.code ul').appendChild(node).setAttribute('style', '--linelength: ' + lineLength + '%;');

            // Draw lines of code 1 by 1
            if (index === 0) {
              elem.querySelector('.code ul .node-' + index).classList.add('writeLine');
            } else {
              elem.querySelector('.code ul .node-' + (index - 1)).addEventListener('animationend', (e) => {
                elem.querySelector('.code ul .node-' + index).classList.add('writeLine');
              });
            }
          }
        });
      }
    };

    // Add event listeners
    const card = document.querySelector('.card');
    card.addEventListener('animationend', handleCardAnimationEnd);

    const perspec = document.querySelector('.perspec');
    perspec.addEventListener('animationend', handlePerspecAnimationEnd);

    // Cleanup
    return () => {
      card.removeEventListener('animationend', handleCardAnimationEnd);
      perspec.removeEventListener('animationend', handlePerspecAnimationEnd);
    };
  }, [counter]);

  return (
    <div className="container-error">
      <div className="error">
        <h1>500</h1>
        <h2>error</h2>
        <p>Algo salió mal en nuestro servidor. Estamos trabajando para solucionarlo.</p>
        <div className="link-container">
        <Link to="/" className="more-link">Volver a la página principal</Link>
      </div>
      </div>
      
      <div className="stack-container">
        {[125].map((spreadDist, index) => (
          <div key={index} className="card-container">
            <div className="perspec" style={{ '--spreaddist': `${spreadDist}px`, '--scaledist': `${1 - index * 0.05}`, '--vertdist': `${-index * 5}px` }}>
              <div className="card">
                <div className="writing">
                  <div className="topbar">
                    <div className="red"></div>
                    <div className="yellow"></div>
                    <div className="green"></div>
                  </div>
                  <div className="code">
                    <ul></ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorPage;
