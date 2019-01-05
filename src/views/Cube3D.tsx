import * as React from "react";

import threeEntryPoint from "../three/threeEntryPoint";

class Cube3D extends React.Component {
  public threeRootElement: HTMLDivElement;

  public componentDidMount() {
    threeEntryPoint(this.threeRootElement);
  }

  public render() {
    return (
      <div
        className="main"
        ref={element => (this.threeRootElement = element as HTMLDivElement)}
      />
    );
  }
}

export default Cube3D;
