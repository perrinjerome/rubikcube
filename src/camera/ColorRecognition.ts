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

  private _recognizedFaces: I2x2FrontFace[];

  /** consecutive frames where a match was found */
  private _matchingFameCount = 0;

  constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this._video = video;
    this._canvas = canvas;
    this._tracker = new RubikColorTracker();
    this._recognizedFaces = [];
  }

  /**
   * Order the tracking rects as topLeft, topRight, bottomLeft and
   * bottomRight
   * @param trackRects the rects found by tracking.js
   */
  _orderTrackingRectsAs2x2Face(
    trackRects: tracking.TrackRect[]
  ): I2x2FrontFace {
    /* 
    from https://www.w3.org/TR/2dcontext/

    The 2D context represents a flat Cartesian surface whose origin (0,0) 
    is at the top left corner, with the coordinate space having x values 
    increasing when going right, and y values increasing when going down.

    */
    let ySortedFaces = trackRects.sort((a, b) => a.y - b.y);
    let [topLeft, topRight] = ySortedFaces
      .slice(0, 2)
      .sort((a, b) => a.x - b.x);
    let [bottomLeft, bottomRight] = ySortedFaces
      .slice(2, 4)
      .sort((a, b) => a.x - b.x);
    return {
      topLeft: colorMapping[topLeft.color as string],
      topRight: colorMapping[topRight.color as string],
      bottomLeft: colorMapping[bottomLeft.color as string],
      bottomRight: colorMapping[bottomRight.color as string]
    };
  }

  /**
   * use color tracking to find a 2X2 face
   */
  public regonize2x2Face(): Promise<I2x2FrontFace> {
    return new Promise(resolve => {
      const canvas = this._canvas;
      const video = this._video;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      const tracker = this._tracker;
      const colorRecognition = this;

      colorRecognition._matchingFameCount = 0;

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
        /*
        if (event.data.length == 4) {
          colorRecognition._matchingFameCount += 1;
        } else {
          colorRecognition._matchingFameCount = 0;          
        }
*/
        if (event.data.length) {
          let numberOfRectsInBoundingBox = 0;
          event.data.forEach(rect => {
            if (event.data.length == 4) {
              console.log("r", rect, colorRecognition._matchingFameCount);

              // is this rect inside the bounding box ?
              if (
                rect.x >= boundingBox.x &&
                rect.y >= boundingBox.y &&
                rect.x + rect.width <= boundingBox.x + boundingBox.width &&
                rect.y + rect.height <= boundingBox.y + boundingBox.height
              ) {
                console.log("in :)", rect, numberOfRectsInBoundingBox);
                numberOfRectsInBoundingBox += 1;
              }
              if (numberOfRectsInBoundingBox == 4) {
                colorRecognition._matchingFameCount += 1;

                // all in BB
                context.drawImage(img, boundingBox.x, boundingBox.y);
                if (colorRecognition._matchingFameCount >= 6) {
                  tracker.removeListener("track", trackListener);
                  setTimeout(() => {
                    const face = colorRecognition._orderTrackingRectsAs2x2Face(
                      event.data
                    );
                    colorRecognition._recognizedFaces.push(face);
                    resolve(face);
                  }, 4000);
                }
              }
            } else {
              colorRecognition._matchingFameCount = 0;
            }

            if (rect.color === "custom") {
              rect.color = (tracker as any).customColor;
            }
            context.lineWidth = 2 * (colorRecognition._matchingFameCount + 1);

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
        } else {
          colorRecognition._matchingFameCount = 0;
        }
      });
    });
  }
}

export default ColorRecognition;
