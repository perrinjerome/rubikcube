import "tracking";

// monkey patch to repair tracking.js accessing camera
// with obsolete removed API
// TODO: does not work on safari"
(tracking as any).initUserMedia_ = function(
  element: HTMLVideoElement,
  opt_options: any
) {
  const constraints = { audio: false, video: true } as MediaStreamConstraints;
  if (navigator.mediaDevices.getSupportedConstraints().facingMode) {
    constraints.video = { facingMode: "environment" };
  }
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    element.srcObject = stream;
    element.onloadeddata = function(e) {
      element.play();
    };
  });
};

import { I2x2FrontFace } from "../rubik/interfaces";

class RubikColorTracker extends tracking.ColorTracker {
  constructor() {
    super(["yellow", "cyan"]);
  }
}

class ColorRecognition {
  private _canvas: HTMLCanvasElement;
  private _video: HTMLVideoElement;
  private _tracker: RubikColorTracker;

  constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this._video = video;
    this._canvas = canvas;
    this._tracker = new RubikColorTracker();
  }

  public regonize2x2Face(): Promise<I2x2FrontFace> {
    return new Promise(resolve => {
      const canvas = this._canvas;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      const tracker = this._tracker;

      tracking.track(this._video, tracker, { camera: true });
      tracker.addListener("track", function trackListener(event) {
        if (event.data.length == 9) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          event.data.forEach(function(rect) {
            console.log("ahah rect", rect);

            setTimeout(
              () =>
                resolve({
                  topLeft: "RED",
                  topRight: "RED",
                  bottomLeft: "RED",
                  bottomRight: "RED"
                }),
              4000
            );

            if (rect.color === "custom") {
              rect.color = (tracker as any).customColor;
            }
            context.strokeStyle = rect.color as string;
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = "11px Helvetica";
            context.fillStyle = "#fff";
            context.fillText(
              "x: " + rect.x + "px",
              rect.x + rect.width + 5,
              rect.y + 11
            );
            context.fillText(
              "y: " + rect.y + "px",
              rect.x + rect.width + 5,
              rect.y + 22
            );
          });
          tracker.removeListener("track", trackListener);
        }
      });
    });
  }
}

export default ColorRecognition;
