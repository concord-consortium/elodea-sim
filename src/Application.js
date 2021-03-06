require('../assets/css/Application.css');
require('../assets/bubbles.mp3');

import React from 'react';
import {RadioGroup, Radio} from 'react-radio-group';
import Experiment from './Experiment';
import LabeledSlider from './LabeledSlider';
import Button from './Button';
import LabeledRadioGroup from './LabeledRadioGroup';

const minCO2 = 0,
      maxCO2 = 100,
      minIntensity = 0,
      maxIntensity = 100,
      colorMultipliers = { 
                           white: {multiplier: 1.5, label: "Full Spectrum"},
                           red: {multiplier: .5, label: "Red"},
                           green: {multiplier: .05, label: "Green"},
                           blue: {multiplier: 1, label: "Blue"}
                         },
      animationTimes = {x1: 2000, x5: 500},

      kDataSetName = 'Bubbles',
      kAppName = "Bubbles",
      kDataSetTemplate = {
                           name: "{name}",
                           collections: [  
                             {
                               name: "experiment_runs",
                               attrs: [
                                {name: "experiment_number", type: "categorical"}
                               ]
                             },
                             {
                               name: 'bubbles',
                               parent: 'experiment_runs',
                               labels: {
                                 pluralCase: "bubbles",
                                 setOfCasesWithArticle: "a sample"
                               },
                               attrs: [
                                {name: "color", type: 'categorical', colormap: {"Full Spectrum": "gray", "Red": "red", "Green": "green", "Blue": "blue"}},
                                {name: "CO2", unit: "%", type: 'numeric', precision: 2},
                                {name: "intensity", unit: "%", type: 'numeric', precision: 2},
                                {name: "bubbles", type: 'numeric', precision: 1},
                              ]
                            }
                           ]
                         };

var myState;

class Application extends React.Component {
  constructor() {
    super();
    this.state = {
      co2: (maxCO2 - minCO2)/2,
      intensity: (maxIntensity - minIntensity)/2,
      color: "white",
      bubbles: null,
      doBubble: false,
      speed: "x1",
      experiment: 1
    };

    let requestDataContext = (name) => {
      return codapInterface.sendRequest({
        action:'get',
        resource: 'dataContext[' + name + ']'
      });
    }
    let requestCreateDataSet = (name, template) => {
      var dataSetDef = Object.assign({}, template);
      dataSetDef.name = name;
      return codapInterface.sendRequest({
        action: 'create',
        resource: 'dataContext',
        values: dataSetDef
      })
    }
    codapInterface.init({
      name: kDataSetName,
      title: kAppName,
      dimensions: {width: 870, height: 540},
      version: '0.1'
    }).then(function (iResult) {
      // get interactive state so we can save the sample set index.
      myState = codapInterface.getInteractiveState();
      // Determine if CODAP already has the Data Context we need.
      return requestDataContext(kDataSetName);
    }).then(function (iResult) {
      // if we did not find a data set, make one
      if (iResult && !iResult.success) {
        // If not not found, create it.
        return requestCreateDataSet(kDataSetName, kDataSetTemplate);
      } else {
        // else we are fine as we are, so return a resolved promise.
        return Promise.resolve(iResult);
      }
    }).catch(function (msg) {
      // handle errors
      console.log(msg);
    });
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
    let handleSpeedChange = (newVal) => {
      this.setState({speed: newVal})
    }
    let handleIncExperiment = () => {
      this.setState({experiment: this.state.experiment + 1});
    }

    let guaranteeCaseTable = () => {
      return new Promise(function (resolve, reject) {
        codapInterface.sendRequest({
          action: 'get',
          resource: 'componentList'
        })
        .then (function (iResult) {
          if (iResult.success) {
            // look for a case table in the list of components.
            if (iResult.values && iResult.values.some(function (component) {
                  return component.type === 'caseTable'
                })) {
              resolve(iResult);
            } else {
              codapInterface.sendRequest({action: 'create', resource: 'component', values: {
                type: 'caseTable',
                dataContext: kDataSetName
              }}).then(function (result) {
                resolve(result);
              });
            }
          } else {
            reject('api error');
          }
        })
      });
    }
    let sendItems = (dataSetName, items) => {
      return codapInterface.sendRequest({
        action: 'create',
        resource: 'dataContext[' + dataSetName + '].item',
        values: items
      });
    }
    let sendLog = (formatStr, replaceArgs) => {
      return codapInterface.sendRequest({
        action: 'notify',
        resource: 'logMessage',
        values: {formatStr, replaceArgs}
      })
    }

    let handleSubmit = () => {
      let colorMultiplier = colorMultipliers[this.state.color].multiplier,
          maxRate = this.state.co2,
          rate = Math.min(maxRate, this.state.intensity * colorMultiplier),
          baseBubbles = Math.round(rate),
          // Add between -10% and 10% noise
          noisePercent = (Math.random() * .2) - .1,
          // Subtract a bubble at random to add noise to small numbers
          staticNoise = (Math.random() - 1),
          bubbles = Math.max(0, Math.round(baseBubbles + (baseBubbles * noisePercent) + staticNoise));


      this.setState({doBubble: true});
      let sound = new Audio("assets/bubbles.mp3");
      sound.play();


      let _this = this,
          startColor = colorMultipliers[this.state.color].label,
          startCO2 = this.state.co2,
          startIntensity = this.state.intensity,
          startSpeed = this.state.speed,
          startExperiment = this.state.experiment;
      setTimeout(function() {
        _this.setState({doBubble: false});
        _this.setState({bubbles});
        sendItems(kDataSetName, {experiment_number: startExperiment, bubbles, color: startColor, CO2: startCO2, intensity: startIntensity});
        sendLog("Ran experiment with %@ light, %@ % lux, %@ % CO2 at %@ speed for a total of %@ bubbles",
                [startColor, startIntensity, startCO2, startSpeed, bubbles]);
        guaranteeCaseTable();
        sound.pause();
      }, animationTimes[this.state.speed]);
    }

    let co2Label = <div>CO<sub>2</sub> Level (%)</div>;
    return (
      <div className="application-container">
        <div className="column left">
          <LabeledRadioGroup className="bulbs"
                             labels={Object.keys(colorMultipliers).map(key => colorMultipliers[key].label)} 
                             labelImageClasses={Object.keys(colorMultipliers).map(key => "bulb " + key)}
                             values={Object.keys(colorMultipliers)}
                             onChange={handleColorChange}
                             selected={this.state.color} />
          <div className="sliders">
            <LabeledSlider value={this.state.intensity} onUpdateSlider={handleIntensitySlider} label={<div>Light Level (%)</div>}
                           labelImageClass="lux-bulb" maxValue={maxIntensity} />
            <LabeledSlider value={this.state.co2} onUpdateSlider={handleCO2Slider} label={co2Label} 
                           labelImageClass="co2-molecule" maxValue={maxCO2} />
          </div>
          <br/>
          <br/>
          <br/>
          Bubbles: {this.state.bubbles}
        </div>
        <div className="column right">
          <Experiment color={this.state.color} speed={this.state.speed} percentCO2={this.state.co2 / maxCO2} 
                      percentIntensity={this.state.intensity / maxIntensity} doBubble={this.state.doBubble}/>
          <div className="speed-container">
            <div>Speed: </div>
            <LabeledRadioGroup className="speed"
                               labels={Object.keys(animationTimes)} 
                               onChange={handleSpeedChange}
                               values={Object.keys(animationTimes)}
                               selected={this.state.speed} />
          </div>
          <Button className="start" onClick={handleSubmit} disabled={this.state.doBubble} label="Count Bubbles"/>
          <Button className="new-exp" onClick={handleIncExperiment} label="New Experiment"/>
        </div>
      </div>
    );
  }
}
export default Application;