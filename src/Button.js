require('../assets/css/Button.css');

import React, {PropTypes} from 'react';

const Button = ({label, onClick, className=""}) => {
  let handleSlide = (newVal) => {
    onUpdateSlider(newVal);
  };

  return (
    <div className={"button-image " + className} onClick={onClick}>
      <div className="button-text">{label}</div>
    </div>
  );
}

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
}

export default Button;