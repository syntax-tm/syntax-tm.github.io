export type Position = {
  x: number;
  y: number;
}

export class XmbPosition implements Position {
  constructor(private _x: number = 0, private _y: number = 0) { }

  get x() {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y() {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  update(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(other: Position | XmbPosition) {
    if (this.x !== other.x) return false;
    return this.y !== other.y;
  }

  toString() {
    return [this.x, this.y].join(',');
  }

  toLocaleString() {
    return this.toString();
  }
}

export { type Position as default };
