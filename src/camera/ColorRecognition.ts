import "tracking";

import arrow_image from "../clipart61507.png";

// monkey patch to repair tracking.js accessing camera
// with obsolete removed API
// TODO: does not work on safari"
(tracking as any).initUserMedia_ = (
  element: HTMLVideoElement,
  opt_options: any
) => {
  const constraints = { audio: false, video: true } as MediaStreamConstraints;
  if (navigator.mediaDevices.getSupportedConstraints().facingMode) {
    constraints.video = { facingMode: "environment" };
  }
  navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    element.srcObject = stream;
    element.onloadeddata = e => {
      element.play();
    };
  });
};

import { I2x2FrontFace } from "../rubik/interfaces";
import { Color } from "src/rubik/colors";

const colorMapping = {
  yellow: "YELLOW",
  cyan: "BLUE"
} as { [key: string]: Color };

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

  _organiseTrackAsFace(): I2x2FrontFace {
    return {
      topLeft: colorMapping["yellow"],
      topRight: "RED",
      bottomLeft: "RED",
      bottomRight: "RED"
    };
  }

  public regonize2x2Face(): Promise<I2x2FrontFace> {
    return new Promise(resolve => {
      const canvas = this._canvas;
      const video = this._video;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      const tracker = this._tracker;
      const colorRecognition = this;

      const boundingBox = {
        x: 100,
        y: 100,
        width: 400,
        height: 400
      };
      const img = new Image();
      img.src = arrow_image;

      tracking.track(video, tracker, { camera: true });
      tracker.addListener("track", function trackListener(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "#FF0000";
        context.strokeRect(
          boundingBox.x,
          boundingBox.y,
          boundingBox.height,
          boundingBox.width
        );

        if (event.data.length) {
          let inBB = 0;

          event.data.forEach(rect => {
            if (event.data.length == 4) {
              console.log("r", rect);
              if (
                rect.x >= boundingBox.x &&
                rect.y >= boundingBox.y &&
                rect.x + rect.width <= boundingBox.x + boundingBox.width &&
                rect.y + rect.height <= boundingBox.y + boundingBox.height
              ) {
                console.log("in :)", rect, inBB);
                inBB += 1;
              }
              if (inBB == 4) {
                // all in BB
                context.drawImage(img, boundingBox.x, boundingBox.y);
                tracker.removeListener("track", trackListener);

                setTimeout(() => {
                  resolve(colorRecognition._organiseTrackAsFace());
                }, 4000);
              }
            }
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
        }
      });
    });
  }
}

export default ColorRecognition;
