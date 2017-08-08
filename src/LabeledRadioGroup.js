require('../assets/css/LabeledRadioGroup.css');

import React, {PropTypes} from 'react';
import ReactSlider from 'react-slider';

const LabeledRadioGroup = ({className, labels, values, labelImageClasses = [], onChange, selected}) => {
  if (labelImageClasses.length > 0 && labels.length !== labelImageClasses.length) {
    console.log("Labels and image label classes must be the same length!");
  }

  if (labels.length !== values.length) {
    console.log("Labels and value arrays must be the same length!");
  }

  let handleChange = (newVal) => {
    onChange(newVal);
  }

  let buttons = [];
  for (let i = 0; i < labels.length; i++) {
    let value = values[i],
        label = labels[i],
        labelImageClass = labelImageClasses[i],
        labelImageDiv = labelImageClass ? <div className={"radio-image " + labelImageClass}></div> : null;
    buttons.push(
      <div className="radio-option" key={i}>
        {labelImageDiv}
        <div className={"radio-button" + (selected === value ? " selected" : "")} 
             onClick={handleChange.bind(this, value)}></div>
        <div className="radio-label-container">
          <div className="radio-label">{label}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={"radio-group" + (className ? " " + className : "")}>
      {buttons}
    </div>
  );
}

LabeledRadioGroup.propTypes = {
  className: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.string),
  values: PropTypes.arrayOf(PropTypes.string),
  labelImageClasses: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.string,
  onChange: PropTypes.func
}

export default LabeledRadioGroup;