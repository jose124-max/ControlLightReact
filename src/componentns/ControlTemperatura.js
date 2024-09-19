import React, { useState, useEffect } from 'react';
import { fetchTempStatus, fetchAirStatus, toggleAire } from '../api';
import './ctemp.css';

const ControlDeTemperatura = () => {
  const [temperature, setTemperature] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const updateTemperature = async () => {
    try {
      const temp = await fetchTempStatus();
      setTemperature(temp);
      console.log(temp);
    } catch (error) {
      console.error('Error fetching temperature:', error);
      setTemperature('Error');
    }
  };

  const updateAirStatus = async () => {
    try {
      const airStatus = await fetchAirStatus();
      setIsActive(airStatus === 1); // Suponiendo que 1 es "encendido" y 0 es "apagado"
    } catch (error) {
      console.error('Error fetching air status:', error);
    }
  };

  const handleSwitchChange = async () => {
    try {
      await toggleAire();
      setIsActive(!isActive);
    } catch (error) {
      console.error('Error toggling air:', error);
    }
  };

  useEffect(() => {
    updateTemperature();
    updateAirStatus();
    const interval = setInterval(() => {
      updateTemperature();
      updateAirStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className='conta' style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={styles.container}>
          <span style={styles.temperature}>
            {temperature !== null ? `${temperature}°C` : 'Loading...'}
          </span>
        </div>
        <br />
        <div style={styles.switchContainer}>
          <input 
            type="checkbox" 
            id="neonSwitch" 
            className="neon-checkbox" 
            checked={isActive} 
            onChange={handleSwitchChange} 
          />
          <label htmlFor="neonSwitch" className="neon-label">
            ENCENDER/APAGAR
          </label>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    marginTop: '40%',
    backgroundColor: 'black',
    color: '#00FFFF',
    padding: '20px',
    borderRadius: '8px',
    display: 'inline-block',
    textAlign: 'center',
    width: '70%',
  },
  temperature: {
    fontSize: '48px',
    fontWeight: 'bold',
  },
  switchContainer: {
    textAlign: 'center',
    marginTop: '20px',
  }
};

export default ControlDeTemperatura;
