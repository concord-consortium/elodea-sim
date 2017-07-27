require('../assets/css/LabeledRadioGroup.css');

import React, {PropTypes} from 'react';
import ReactSlider from 'react-slider';

const LabeledRadioGroup = ({className, labels, labelImageClasses, onChange, selected}) => {
  if (labels.length !== labelImageClasses.length) {
    console.log("Labels and image label classes must be the same length!");
  }

  let handleChange = (newVal) => {
    onChange(newVal);
  }

  let buttons = [];
  for (let i = 0; i < labels.length; i++) {
    let label = labels[i],
        labelImageClass = labelImageClasses[i];
    buttons.push(
      <div className="radio-option" key={i}>
        <div className={"radio-image " + labelImageClass}></div>
        <div className={"radio-button" + (selected === label ? " selected" : "")} 
             onClick={handleChange.bind(this, label)}></div>
        <div className="radio-label">{label}</div>
      </div>
    )
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
  labelImageClasses: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.string,
  onChange: PropTypes.func
}

export default LabeledRadioGroup;