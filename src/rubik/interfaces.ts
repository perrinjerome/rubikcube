import * as Colors from "./colors";

export interface ICubeFaces {
  top?: Colors.Color;
  bottom?: Colors.Color;
  front?: Colors.Color;
  back?: Colors.Color;
  left?: Colors.Color;
  right?: Colors.Color;
}

export interface IFrontFace {}

export interface I2x2FrontFace extends IFrontFace {
  topLeft: Colors.Color;
  topRight: Colors.Color;
  bottomLeft: Colors.Color;
  bottomRight: Colors.Color;
}

export type CubeType = "2x2" | "3x3";
