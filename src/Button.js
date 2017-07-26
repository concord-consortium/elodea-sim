require('../assets/css/Button.css');

import React, {PropTypes} from 'react';

const Button = ({label, onClick}) => {
  let handleSlide = (newVal) => {
    onUpdateSlider(newVal);
  };

  return (
    <div className="button-image" onClick={onClick}>
      <div className="button-text">{label}</div>
    </div>
  );
}

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func
}

export default Button;