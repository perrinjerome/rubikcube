import * as THREE from "three";
import TrackballControls from "./TrackballControl";
import { ISceneObject } from "./interfaces";
import RubikCube from "./RubikCube";

interface IMousePosition {
  x: number;
  y: number;
}

interface IScreenDimension {
  width: number;
  height: number;
}

class SceneManager {
  private _clock: THREE.Clock;
  private _origin: THREE.Vector3;
  private _scene: THREE.Scene;
  private _renderer: THREE.WebGLRenderer;
  private _camera: THREE.PerspectiveCamera;
  private _canvas: HTMLCanvasElement;
  private _controls: TrackballControls;
  private _mousePosition: IMousePosition; //XXX
  private _screenDimensions: IScreenDimension;
  private _sceneSubjects: ISceneObject[];
  private _paused = true;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._clock = new THREE.Clock();
    this._origin = new THREE.Vector3(0, 0, 0);

    this._screenDimensions = {
      width: canvas.width,
      height: canvas.height
    };

    this._mousePosition = {
      x: 0,
      y: 0
    };

    this._scene = this.buildScene();
    this._renderer = this.buildRender(canvas.width, canvas.height);
    this._camera = this.buildCamera(canvas.width, canvas.height);
    this._controls = new TrackballControls(this._camera);
    this._controls.rotateSpeed = 1.0;
    this._controls.zoomSpeed = 1.2;
    this._controls.panSpeed = 0.8;
    this._controls.noZoom = false;
    this._controls.noPan = false;
    this._controls.staticMoving = true;
    this._controls.dynamicDampingFactor = 0.3;

    this._sceneSubjects = this.createSceneSubjects();
  }

  private buildScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#444");
    // debug
    var helper = new THREE.GridHelper(1000, 40, 0x303030, 0x303030);
    helper.position.y = -75;
    scene.add(helper);
    var axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    scene.add(new THREE.AmbientLight(0x111111, 2));

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.125);
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add(directionalLight);

    return scene;
  }

  private buildRender(width: number, height: number) {
    const renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: true
    });
    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    return renderer;
  }

  private buildCamera(width: number, height: number) {
    const aspectRatio = width / height;
    const fieldOfView = 60;
    const nearPlane = 0.1;
    const farPlane = 1000;
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    camera.position.z = 6;
    var light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);
    return camera;
  }

  private createSceneSubjects() {
    const sceneSubjects = [new RubikCube(this)] as ISceneObject[];
    return sceneSubjects;
  }

  public update() {
    const elapsedTime = this._clock.getElapsedTime();
    this._controls.update();

    for (let i = 0; i < this._sceneSubjects.length; i++)
      this._sceneSubjects[i].update(elapsedTime);

    this.updateCameraPositionRelativeToMouse();
    return this._renderer.render(this._scene, this._camera);
  }

  private updateCameraPositionRelativeToMouse() {
    this._camera.position.x +=
      (this._mousePosition.x * 0.01 - this._camera.position.x) * 0.01;
    this._camera.position.y +=
      (-(this._mousePosition.y * 0.01) - this._camera.position.y) * 0.01;
    this._camera.lookAt(this._origin);
  }

  public onWindowResize() {
    const { width, height } = this._canvas;
    console.log("window resized", width, height);
    this._screenDimensions.width = width;
    this._screenDimensions.height = height;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  public onKeyDown(e: KeyboardEvent) {
    console.log("onkeydown", e);
    this._paused = !this._paused;
  }
  public onMouseMove(x: number, y: number) {
    console.log("mouse moved");
    this._mousePosition.x = x;
    this._mousePosition.y = y;
  }
  get paused() {
    return this._paused;
  }
  get scene() {
    return this._scene;
  }
}

export default SceneManager;
