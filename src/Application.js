import React from 'react';
import ReactSlider from 'react-slider';
import {RadioGroup, Radio} from 'react-radio-group';

const minCO2 = 0,
      maxCO2 = 100,
      minIntensity = 0,
      maxIntensity = 100;

/**
 * A counter button: tap the button to increase the count.
 */
class Application extends React.Component {
  constructor() {
    super();
    this.state = {
      co2: (maxCO2 - minCO2)/2,
      intensity: (maxIntensity - minIntensity)/2,
      color: "white"
    };
  }
 
  render() {
    let handleCO2Slider = (newVal) => {
      this.setState({co2: newVal});
    }
    let handleIntensitySlider = (newVal) => {
      this.setState({intensity: newVal});
    }
    let handleColorChange = (newVal) => {
      this.setState({color: newVal})
    }

    return (
      <div>
        <RadioGroup name="light-color" selectedValue={this.state.color} onChange={handleColorChange}>
          <Radio value="white" />White
          <Radio value="blue" />Blue
          <Radio value="red" />Red
          <Radio value="green" />Green
        </RadioGroup>
        <ReactSlider orientation="vertical" defaultValue={this.state.co2} onChange={handleCO2Slider}>
          <div>{this.state.co2}</div>
        </ReactSlider>
        CO2 Value
        <ReactSlider orientation="vertical" defaultValue={this.state.intensity} onChange={handleIntensitySlider}>
          <div>{this.state.intensity}</div>
        </ReactSlider>
        Intensity Value
        <br/>
        <button>Submit</button>
      </div>
    );
  }
}
export default Application;