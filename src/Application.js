require('../assets/css/Application.css');

import React from 'react';
import {RadioGroup, Radio} from 'react-radio-group';
import Experiment from './Experiment';
import LabeledSlider from './LabeledSlider';
import Button from './Button';
import LabeledRadioGroup from './LabeledRadioGroup';

const minCO2 = 0,
      maxCO2 = 10,
      minIntensity = 0,
      maxIntensity = 10,
      colorMultipliers = {colorless: 1.5, red: .5, green: 0, blue: 1},

      kDataSetName = 'Bubbles',
      kAppName = "Bubbles",
      kDataSetTemplate = {
                           name: "{name}",
                           collections: [  
                             {
                               name: 'bubbles',
                               labels: {
                                 pluralCase: "bubbles",
                                 setOfCasesWithArticle: "a sample"
                               },
                               attrs: [
                                {name: "color", type: 'categorical', colormap: {"colorless": "gray", "red": "red", "green": "green", "blue": "blue"}},
                                {name: "CO2", unit: "ppm", type: 'numeric', precision: 2},
                                {name: "intensity", unit: "lux", type: 'numeric', precision: 2},
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
      color: "colorless",
      bubbles: null,
      doBubble: false
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
      dimensions: {width: 1200, height: 1600},
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

    let handleSubmit = () => {
      let colorMultiplier = colorMultipliers[this.state.color],
          maxRate = this.state.co2,
          rate = Math.min(maxRate, this.state.intensity * colorMultiplier),
          bubbles = Math.round(rate * 10);

      this.setState({doBubble: true});

      let _this = this;
      setTimeout(function() {
        _this.setState({doBubble: false});
        _this.setState({bubbles});
        sendItems(kDataSetName, {bubbles, color: _this.state.color, CO2: _this.state.co2, intensity: _this.state.intensity});
        guaranteeCaseTable();
      }, 2000);
    }

    let co2Label = <div>CO<sub>2</sub> Level (ppm)</div>;
    return (
      <div className="application-container">
        <div className="column left">
          <LabeledRadioGroup className="bulbs"
                             labels={Object.keys(colorMultipliers)} 
                             labelImageClasses={Object.keys(colorMultipliers).map(key => "bulb " + key)}
                             onChange={handleColorChange}
                             selected={this.state.color} />
          <div className="sliders">
            <LabeledSlider value={this.state.intensity} onUpdateSlider={handleIntensitySlider} label={<div>Light Level (lux)</div>}
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
          <Experiment color={this.state.color} intensity={this.state.intensity / maxIntensity} doBubble={this.state.doBubble}/>
          <Button onClick={handleSubmit} label="Start"/>
        </div>
      </div>
    );
  }
}
export default Application;