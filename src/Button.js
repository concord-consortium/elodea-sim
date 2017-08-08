require('../assets/css/Button.css');

import React, {PropTypes} from 'react';

const Button = ({label, onClick, disabled, className=""}) => {
  let handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <div className={"button-image " + className + (disabled ? " disabled" : "")} onClick={handleClick}>
      <div className="button-text">{label}</div>
    </div>
  );
}

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool
}

export default Button;