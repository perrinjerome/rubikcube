import SceneManager from "./SceneManager";

export default (containerElement: HTMLDivElement) => {
  const canvas = createCanvas(document, containerElement);
  const sceneManager = new SceneManager(canvas);

  bindEventListeners();
  render();

  function createCanvas(document: Document, containerElement: HTMLDivElement) {
    const canvas = document.createElement("canvas");
    containerElement.appendChild(canvas);
    return canvas;
  }
  function bindEventListeners() {
    window.onresize = resizeCanvas;
    window.onkeydown = keyDown;
    resizeCanvas();
  }
  function keyDown(e: KeyboardEvent) {
    sceneManager.onKeyDown(e);
  }
  function resizeCanvas() {
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    sceneManager.onWindowResize();
  }
  function render() {
    setTimeout(function() {
      requestAnimationFrame(render);
    }, 10);
    sceneManager.update();
  }
};
