import React, { useState, useEffect } from 'react';
import '../fontawesome-free-5.15.4-web/css/all.min.css';
import '../fontawesome-free-5.15.4-web/css/all.css';
import './Splashscreen.css';

const Wave = ({ top, left, delay }) => (
  <div
    className="wave"
    style={{ top: `${top}vh`, left: `${left}vw`, animationDelay: `${delay}s` }}
  ></div>
);

const Splashscreen = () => {
  const [loading, setLoading] = useState(true);
  const [waves, setWaves] = useState([]);

  useEffect(() => {
    // Simulation d'un chargement avec un délai
    const timeout = setTimeout(() => {
      setLoading(false); // Met fin au chargement après 3 secondes (simulé)
    }, 6000); // 3000 millisecondes = 3 secondes

    return () => clearTimeout(timeout); // Nettoie le timeout si le composant est démonté avant la fin du délai
  }, []);

  useEffect(() => {
    const generateWaves = () => {
      const newWaves = [];
      for (let i = 0; i < 10; i++) {
        newWaves.push({
          top: Math.random() * 100,
          left: Math.random() * 100,
          delay: Math.random() * 1.5,
        });
      }
      setWaves(newWaves);
    };

    generateWaves();
  }, []);

  return (
    <div className="splash-screen ">
      
      <div className="highlight"></div>
      <div className="text-container">
        {'Wifix'.split('').map((letter, index) => (
          <span key={index} className="text" style={{ '--index': index }}>
            {letter}
          </span>
        ))}
      </div>
      <div id="wave-container">
        {waves.map((wave, index) => (
          <Wave key={index} {...wave} />
        ))}
      </div>
      
      <div className="circle1">
         <div className="circle"></div>
        <div className="wifi-background"></div>
        <div className="wifi"></div>
      </div>
    </div>
  );
};

export default Splashscreen;
