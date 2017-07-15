import React from 'react';
import ReactSlider from 'react-slider';
import {RadioGroup, Radio} from 'react-radio-group';

const minCO2 = 0,
      maxCO2 = 10,
      minIntensity = 0,
      maxIntensity = 10,
      colorMultipliers = {blue: 1, red: .5, green: 0, white: 1.5};

/**
 * A counter button: tap the button to increase the count.
 */
class Application extends React.Component {
  constructor() {
    super();
    this.state = {
      co2: (maxCO2 - minCO2)/2,
      intensity: (maxIntensity - minIntensity)/2,
      color: "white",
      bubbles: null
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
    let handleSubmit = () => {
      let colorMultiplier = colorMultipliers[this.state.color],
          maxRate = this.state.co2,
          rate = Math.min(maxRate, this.state.intensity * colorMultiplier);

      this.setState({bubbles: Math.round(rate * 10)});
    }

    return (
      <div>
        <RadioGroup name="light-color" selectedValue={this.state.color} onChange={handleColorChange}>
          <Radio value="white" />White
          <Radio value="blue" />Blue
          <Radio value="red" />Red
          <Radio value="green" />Green
        </RadioGroup>
        <ReactSlider orientation="vertical" defaultValue={this.state.co2} onChange={handleCO2Slider} step={.1} max={maxCO2}>
          <div>{this.state.co2}</div>
        </ReactSlider>
        CO2 Value
        <br/>
        <br/>
        <ReactSlider orientation="vertical" defaultValue={this.state.intensity} onChange={handleIntensitySlider} step={.1} max={maxIntensity}>
          <div>{this.state.intensity}</div>
        </ReactSlider>
        Intensity Value
        <br/>
        <br/>
        <button onClick={handleSubmit}>Submit</button>
        <br/>
        Bubble: {this.state.bubbles}
      </div>
    );
  }
}
export default Application;