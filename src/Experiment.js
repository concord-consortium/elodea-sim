require('../assets/css/Experiment.css');
require('../assets/css/Bubbles.css');

import React, {PropTypes} from 'react';

const Experiment = ({color, intensity, doBubble}) => {
  return (
    <div className="experiment-container">
      <div className="lamp-top"></div>
      <div className="beaker"></div>
      <div className="elodea"></div>
      <div className={"bubble-1" + (doBubble ? " pulse" : "")}></div>
      <div className={"bubble-2" + (doBubble ? " pulse" : "")}></div>
      <div className="water"></div>
      <div className={"light " + color} style={{opacity: intensity}}></div>
      <div className="lamp-base"></div>
    </div>

  );
}

Experiment.propTypes = {
  color: PropTypes.string.isRequired,
  intensity: PropTypes.number.isRequired,
  doBubble: PropTypes.bool
};

export default Experiment;