import "tracking";

class ColorRecognition {
  public do() {
    console.log("doing");
    var canvas = document.getElementById("canvas") as HTMLCanvasElement;
    var context = canvas.getContext("2d") as CanvasRenderingContext2D;
    var tracker = new tracking.ColorTracker(["yellow", "cyan"]);
    tracking.track("#video", tracker, { camera: true });
    tracker.on("track", function(event) {
      /*if (event.data) {
        console.log("tracked", event);
      }*/
      context.clearRect(0, 0, canvas.width, canvas.height);
      event.data.forEach(function(rect) {
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
    });
  }
}
export default ColorRecognition;
