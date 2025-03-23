import React from 'react';
import PropTypes from 'prop-types';

/**
 * Компонент кнопки включения с пульсирующей анимацией
 * @param {Object} props - Свойства компонента
 * @param {Function} props.onClick - Функция, вызываемая при клике на кнопку
 * @returns {JSX.Element} - Компонент кнопки включения
 */
const PowerButton = ({ onClick }) => {
  return (
    <div className="power-button-container">
      <button 
        className="power-button" 
        onClick={onClick}
        aria-label="Enter the website"
      >
        <img 
          src="/assets/svgs/Power.svg" 
          alt="Power button" 
          className="power-icon"
        />
      </button>
      <p className="power-text">Tap it</p>
    </div>
  );
};

PowerButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default PowerButton;