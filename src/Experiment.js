require('../assets/css/Experiment.css');

import React, {PropTypes} from 'react';

/**
 * A counter button: tap the button to increase the count.
 */
const Experiment = ({color, intensity}) => {
  return (
    <div className="experiment-container">
      <div className="lamp-top"></div>
      <div className="beaker"></div>
      <div className="elodea"></div>
      <div className="water"></div>
      <div className="light" style={{opacity: intensity}}></div>
      <div className="lamp-base"></div>
    </div>

  );
}

Experiment.propTypes = {
  color: PropTypes.string,
  intensity: PropTypes.number
};

export default Experiment;