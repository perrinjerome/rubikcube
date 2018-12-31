import { ISceneObject } from "./interfaces";
import * as THREE from "three";
import * as Colors from "./colors";

export default class Cube implements ISceneObject {
  protected _cube: THREE.Mesh;

  constructor(scene: THREE.Scene) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: Colors.RED });
    this._cube = new THREE.Mesh(geometry, material);
  }
  public update(time: number) {
    this._cube.rotation.x += 0.01;
    this._cube.rotation.y += 0.02;
  }
}
