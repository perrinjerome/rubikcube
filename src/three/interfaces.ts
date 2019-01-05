export interface ISceneObject {
  update(elapsedTime: number): void;
  // debug
  reset(): void;
}
