import * as THREE from "three";

import { ISceneObject } from "./interfaces";
import Cube from "./Cube";

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
  private _camera: THREE.Camera;
  private _canvas: HTMLCanvasElement;
  private _mousePosition: IMousePosition;
  private _screenDimensions: IScreenDimension;
  private _sceneSubjects: ISceneObject[]; /* XXX */

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
    this._sceneSubjects = this.createSceneSubjects();
  }

  private buildScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#444");
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
    camera.position.z = 5;
    return camera;
  }

  private createSceneSubjects() {
    const sceneSubjects = [new Cube(this._scene)] as ISceneObject[];
    return sceneSubjects;
  }

  public update() {
    const elapsedTime = this._clock.getElapsedTime();
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
    // XXX is this used ?
    const { width, height } = this._canvas;

    this._screenDimensions.width = width;
    this._screenDimensions.height = height;

    this._camera.updateMatrix();

    this._renderer.setSize(width, height);
  }

  public onMouseMove(x: number, y: number) {
    this._mousePosition.x = x;
    this._mousePosition.y = y;
  }
}

export default SceneManager;
