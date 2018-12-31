import { Color } from "three";
import { MeshLambertMaterial } from "three";

export const RED = new Color(0xff0000);
export const GREEN = new Color(0x00ff00);
export const ORANGE = new Color(0xffaa00);
export const BLUE = new Color(0x0000ff);
export const YELLOW = new Color(0xffff00);
export const WHITE = new Color(0xfffff);
export const colors = [RED, GREEN, ORANGE, BLUE, YELLOW, WHITE];
export const colorIndexes = {
  RED: 0,
  GREEN: 1,
  ORANGE: 2,
  BLUE: 3,
  YELLOW: 4,
  WHITE: 5
};

export const materialMap = {
  RED: new MeshLambertMaterial({ color: RED }),
  GREEN: new MeshLambertMaterial({ color: GREEN }),
  ORANGE: new MeshLambertMaterial({ color: ORANGE }),
  BLUE: new MeshLambertMaterial({ color: BLUE }),
  YELLOW: new MeshLambertMaterial({ color: YELLOW }),
  WHITE: new MeshLambertMaterial({ color: WHITE }),
  NONE: new MeshLambertMaterial({ color: 0x888888 })
};

export type Color =
  | "RED"
  | "GREEN"
  | "ORANGE"
  | "BLUE"
  | "YELLOW"
  | "WHITE"
  | null;
