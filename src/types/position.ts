export type Position = {
  x: number;
  y: number;
}

export class XmbPosition implements Position {
  constructor(public x: number, public y: number) { }

  public update(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public equals(other: Position) {
    if (this.x !== other.x) return false;
    return this.y !== other.y;
  }

  toString() {
    [this.x, this.y].join(',');
  }
}

export default Position;
