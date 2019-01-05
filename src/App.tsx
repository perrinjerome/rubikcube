import * as React from "react";
import "./App.css";

import ColorDetection from "./views/ColorDetection";
import Cube3D from "./views/Cube3D";

type Activity = "colorRecognition" | "cubeSolving";

export interface Props {
  activity?: Activity;
}

class App extends React.Component<Props, Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activity: "colorRecognition"
    };
    /*
    setTimeout(_ => {
      this.setState({ activity: "cubeSolving" });
    }, 5000);
*/
  }
  public render() {
    if (this.state.activity == "colorRecognition") {
      return <ColorDetection />;
    }
    return <Cube3D />;
  }
}

export default App;
