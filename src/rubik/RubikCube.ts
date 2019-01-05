import { ISceneObject } from "../three/interfaces";
import * as THREE from "three";
import * as Colors from "./colors";
import SceneManager from "../three/SceneManager";
import { AssertionError } from "assert";

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

// useless ?
/*
class CubeFace {
  constructor(colors: ICubeFaces) {
    this.colors = colors;
  }
  colors: ICubeFaces;
}
*/

interface ICube {
  asMesh(): THREE.Mesh;
}

class CornerCube implements ICube {
  constructor(colors: ICubeFaces) {
    this.colors = colors;
  }

  setPosition(position: THREE.Vector3) {
    this.position = position;
  }

  asMesh() {
    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    geometry.translate(this.position.x, this.position.y, this.position.z);
    const materials: THREE.Material[] = [
      Colors.materialMap[this.colors.right || "NONE"],
      Colors.materialMap[this.colors.left || "NONE"],
      Colors.materialMap[this.colors.top || "NONE"],
      Colors.materialMap[this.colors.bottom || "NONE"],
      Colors.materialMap[this.colors.front || "NONE"],
      Colors.materialMap[this.colors.right || "NONE"]
    ];

    return new THREE.Mesh(geometry, materials);
  }

  colors: ICubeFaces;

  position: THREE.Vector3;
}

/* 3x3
class EdgeCube implements ICube {
    face1: CubeFace;
    face2: CubeFace;
}
*/

class I2x2Layer {
  constructor(
    cube1: CornerCube,
    cube2: CornerCube,
    cube3: CornerCube,
    cube4: CornerCube,
    level: number // 0 for bottom layer, 1 for top layer
  ) {
    cube1.setPosition(new THREE.Vector3(0, level, 0));
    this.cube1 = cube1;
    cube2.setPosition(new THREE.Vector3(0, level, 1));
    this.cube2 = cube2;
    cube3.setPosition(new THREE.Vector3(1, level, 0));
    this.cube3 = cube3;
    cube4.setPosition(new THREE.Vector3(1, level, 1));
    this.cube4 = cube4;
  }

  addCubesToScene(sceneManager: SceneManager) {
    const scene = sceneManager.scene;
    scene.add(this.cube1.asMesh());
    scene.add(this.cube2.asMesh());
    scene.add(this.cube3.asMesh());
    scene.add(this.cube4.asMesh());
  }
  private cube1: CornerCube;
  private cube2: CornerCube;
  private cube3: CornerCube;
  private cube4: CornerCube;
}

export default class RubikCube2x2x2 implements ISceneObject {
  private _cube: THREE.Object3D;
  private _sceneManager: SceneManager;
  private _pieces: THREE.Mesh[];

  private _bottomLayer: I2x2Layer;
  private _topLayer: I2x2Layer;

  private _currentMove: RubikMove | null;

  constructor(sceneManager: SceneManager) {
    this._sceneManager = sceneManager;
    this._cube = new THREE.Object3D();
    this._currentMove = null;

    this._bottomLayer = new I2x2Layer(
      new CornerCube({
        left: "YELLOW",
        back: "RED",
        bottom: "GREEN"
      }),
      new CornerCube({
        front: "YELLOW",
        left: "BLUE",
        bottom: "RED"
      }),
      new CornerCube({
        back: "YELLOW",
        right: "ORANGE",
        bottom: "BLUE"
      }),
      new CornerCube({
        front: "ORANGE",
        right: "BLUE",
        bottom: "WHITE"
      }),
      0
    );
    this._bottomLayer.addCubesToScene(sceneManager);

    this._topLayer = new I2x2Layer(
      new CornerCube({
        top: "WHITE",
        left: "RED",
        back: "GREEN"
      }),
      new CornerCube({
        top: "GREEN",
        front: "ORANGE",
        left: "WHITE"
      }),
      new CornerCube({
        back: "YELLOW",
        right: "ORANGE",
        top: "GREEN"
      }),
      new CornerCube({
        front: "RED",
        right: "BLUE",
        top: "WHITE"
      }),
      1
    );
    this._topLayer.addCubesToScene(sceneManager);

    sceneManager.scene.add(this._cube); // XXX ???
  }
  public reset() {}

  public update(time: number) {
    if (!this._sceneManager.paused) {
      if (0) {
        this._pieces.forEach(p => {
          p.visible = false;
        });
      }
      // move down;
      for (let i = 0; i <= 3; i++) {
        let p = this._pieces[i];
        p.visible = true;
        p.translateX(0.5);
        p.translateZ(0.5);
        p.rotateY(0.01 * time);
        p.translateX(-0.5);
        p.translateZ(-0.5);
      }
      // p.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 0));
      // p.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(0.01 * time));
      // p.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -1, 0));
      //  p.updateMatrix();
    }
  }
  public makeMove(move: RubikMove) {
    console.log("making move", move);
    if (this._currentMove !== null)
      throw new AssertionError({
        message: `already moving ${this._currentMove}`
      });
    this._currentMove = move;
  }
  /*
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
  */
}
