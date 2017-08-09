require('../assets/css/LabeledSlider.css');

import React, {PropTypes} from 'react';
import ReactSlider from 'react-slider';

const LabeledSlider = ({value, maxValue, labelImageClass, label, onUpdateSlider}) => {
  let handleSlide = (newVal) => {
    onUpdateSlider(newVal);
  };

  let numberLabels = [];
  for (let i = 100; i >= 0; i -= 10) {
    numberLabels.push(<div key={i}>{i}</div>);
  }

  return (
    <div className="labeled-slider">
      <div className="slider-container">
        <div className="number-labels">
          {numberLabels}
        </div>
        <div className="graduated-lines"></div>
        <ReactSlider orientation="vertical" invert={true} defaultValue={value} onChange={handleSlide} step={1} max={maxValue}>
          <div className="handle-label">{value}</div>
        </ReactSlider>
      </div>
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