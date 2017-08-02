require('../assets/css/Experiment.css');
require('../assets/css/Bubbles.css');

import React, {PropTypes} from 'react';
import Gauge from 'react-radial-gauge';

const Experiment = ({color, percentIntensity, percentCO2, doBubble, speed}) => {
  return (
    <div className="experiment-container">
      <div className="lamp-top"></div>
      <div className="beaker"></div>
      <div className="elodea"></div>
      <div className={"bubble-1" + (doBubble ? " pulse " + speed : "")}></div>
      <div className={"bubble-2" + (doBubble ? " pulse " + speed : "")}></div>
      <div className="water"></div>
      <div className={"light " + color} style={{opacity: percentIntensity}}></div>
      <div className="lamp-base"></div>
      <div className="gauge">
        <Gauge size={40} currentValue={percentCO2 * 100}/>
      </div>
    </div>
  );
}

Experiment.propTypes = {
  color: PropTypes.string.isRequired,
  percentIntensity: PropTypes.number.isRequired,
  percentCO2: PropTypes.number.isRequired,
  doBubble: PropTypes.bool,
  speed: PropTypes.string
};

export default Experiment;