import * as React from "react";
import "./App.css";

import { CubeType, I2x2FrontFace } from "./rubik/interfaces";
import ColorDetection from "./views/ColorDetection";
import Cube3D from "./views/Cube3D";

type Activity = "colorRecognition" | "cubeSolving";

interface Props {
  cubeType: CubeType;
}

interface State {
  activity?: Activity;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activity: "colorRecognition"
    };
    this.onFaceDetected = this.onFaceDetected.bind(this);
  }
  public onFaceDetected(face: I2x2FrontFace) {
    this.setState({ activity: "cubeSolving" });
  }
  public render() {
    if (this.state.activity == "colorRecognition") {
      return (
        <ColorDetection
          cubeType={this.props.cubeType}
          onFaceDetected={this.onFaceDetected}
        />
      );
    }
    return <Cube3D />;
  }
}

export default App;
