import { ISceneObject } from "../three/interfaces";
import * as THREE from "three";
import * as Colors from "./colors";
import SceneManager from "../three/SceneManager";

declare type RubikMove =
  | "U"
  | "D"
  | "L"
  | "R"
  | "F"
  | "B"
  | "U'"
  | "D'"
  | "L'"
  | "R'"
  | "F'"
  | "B'";

interface ICubeFaces {
  top?: Colors.Color;
  bottom?: Colors.Color;
  front?: Colors.Color;
  back?: Colors.Color;
  left?: Colors.Color;
  right?: Colors.Color;
}

export default class RubikCube implements ISceneObject {
  private _cube: THREE.Object3D;
  private _sceneManager: SceneManager;
  private _pieces: THREE.Mesh[];

  constructor(sceneManager: SceneManager) {
    this._sceneManager = sceneManager;
    this._cube = new THREE.Object3D();
    this._pieces = [
      // bottom row

      this._makeCornerPiece(
        {
          left: "YELLOW",
          back: "RED",
          bottom: "GREEN"
        },
        0,
        0,
        0
      ),
      this._makeCornerPiece(
        {
          front: "YELLOW",
          left: "BLUE",
          bottom: "RED"
        },
        0,
        0,
        1
      ),
      this._makeCornerPiece(
        {
          back: "YELLOW",
          right: "ORANGE",
          bottom: "BLUE"
        },
        1,
        0,
        0
      ),
      this._makeCornerPiece(
        {
          front: "ORANGE",
          right: "BLUE",
          bottom: "WHITE"
        },
        1,
        0,
        1
      ),
      // top row

      this._makeCornerPiece(
        {
          top: "WHITE",
          left: "RED",
          back: "GREEN"
        },
        0,
        1,
        0
      ),
      this._makeCornerPiece(
        {
          top: "GREEN",
          front: "ORANGE",
          left: "WHITE"
        },
        0,
        1,
        1
      ),
      this._makeCornerPiece(
        {
          back: "YELLOW",
          right: "ORANGE",
          top: "GREEN"
        },
        1,
        1,
        0
      ),
      this._makeCornerPiece(
        {
          front: "RED",
          right: "BLUE",
          top: "WHITE"
        },
        1,
        1,
        1
      )
    ];

    this._pieces.forEach(p => this._cube.add(p));

    sceneManager.scene.add(this._cube);
  }
  public update(time: number) {
    if (0) {
      this._pieces[0].rotation.x += 0.01;
      this._pieces[1].visible = false;
      this._pieces[2].visible = false;
      this._pieces[3].visible = false;
      this._pieces[4].visible = false;
      this._pieces[5].visible = false;
      this._pieces[6].visible = false;
    }
    if (!this._sceneManager.paused) {
      this._cube.rotation.x += 0.01;
      this._cube.rotation.y += 0.01;
    }
  }
  public makeMove(move: RubikMove) {
    console.log("making move", move);
  }
  private _makeCornerPiece(
    cubedef: ICubeFaces,
    // x, y, z => tranlation
    x: number,
    y: number,
    z: number
  ): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    geometry.translate(x, y, z);
    const materials: THREE.Material[] = [
      Colors.materialMap[cubedef.right || "NONE"],
      Colors.materialMap[cubedef.left || "NONE"],
      Colors.materialMap[cubedef.top || "NONE"],
      Colors.materialMap[cubedef.bottom || "NONE"],
      Colors.materialMap[cubedef.front || "NONE"],
      Colors.materialMap[cubedef.right || "NONE"]
    ];
    return new THREE.Mesh(geometry, materials);
  }
}

/*
   |  / 
   | /  z
 y |/
    ----->
      x

  */
