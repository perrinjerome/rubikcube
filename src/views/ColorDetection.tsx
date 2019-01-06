import * as React from "react";

import "./ColorDetection.css";
import ColorRecognition from "../camera/ColorRecognition";
import { CubeType, IFrontFace } from "src/rubik/interfaces";

interface Props {
  cubeType: CubeType;
  onFaceDetected(face: IFrontFace): void;
}

class ColorDetection extends React.Component<Props, object> {
  cubeCocognition: ColorRecognition;
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // maximize to full size
    // TODO: support resize
    const video = document.getElementById("video") as HTMLVideoElement;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    video.width = canvas.width = window.innerWidth;
    video.height = canvas.height = window.innerHeight;

    // start recognition
    this.cubeCocognition = new ColorRecognition(video, canvas);
    this.cubeCocognition.regonize2x2Face().then(face => {
      console.log("got face !", face);
      this.props.onFaceDetected(face);
    });
  }

  public render() {
    return (
      <div className="video-container">
        <video id="video" preload="true" loop muted controls />
        <canvas id="canvas" />
      </div>
    );
  }
}

export default ColorDetection;
