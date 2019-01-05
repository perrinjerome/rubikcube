import * as React from "react";

import "./ColorDetection.css";
import ColorRecognition from "../camera/ColorRecognition";

class ColorDetection extends React.Component {
  cubeCocognition: ColorRecognition;
  componentDidMount() {
    this.cubeCocognition = new ColorRecognition();
    this.cubeCocognition.do();
  }
  public render() {
    return (
      <div className="demo-frame">
        <div className="demo-container">
          <video
            id="video"
            width="600"
            height="450"
            preload="true"
            loop
            muted
            controls
          />
          <canvas id="canvas" width="600" height="450" />
        </div>
      </div>
    );
  }
}

export default ColorDetection;
