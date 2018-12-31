import * as React from "react";
import "./App.css";

import threeEntryPoint from "./three/threeEntryPoint";

class App extends React.Component {
  public threeRootElement: HTMLDivElement;

  public componentDidMount() {
    threeEntryPoint(this.threeRootElement);
  }

  public render() {
    return (
      <div
        ref={element => (this.threeRootElement = element as HTMLDivElement)}
      />
    );
  }
}

export default App;
