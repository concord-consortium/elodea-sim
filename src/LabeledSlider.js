require('../assets/css/LabeledSlider.css');

import React, {PropTypes} from 'react';
import ReactSlider from 'react-slider';

const LabeledSlider = ({value, maxValue, labelImageClass, label, onUpdateSlider}) => {
  let handleSlide = (newVal) => {
    onUpdateSlider(newVal);
  };

  return (
    <div className="labeled-slider">
      <ReactSlider orientation="vertical" defaultValue={value} onChange={handleSlide} step={.1} max={maxValue}>
        <div>{value}</div>
      </ReactSlider>
      <div className={labelImageClass}></div>
      {label}
    </div>
  );
}

LabeledSlider.propTypes = {
  maxValue: PropTypes.number,
  labelImageClass: PropTypes.string,
  label: PropTypes.object,
  onUpdateSlider: PropTypes.func
}

export default LabeledSlider;