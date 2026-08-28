declare global {
  interface String {
    equalsIgnoreCase(other: string): boolean;
  }
}

String.prototype.equalsIgnoreCase = function (this: string, other: string | undefined | null): boolean {
  if (!other) return false;
  return this.toLowerCase() === other.toLowerCase();
};

export function equalsIgnoreCase(a: string, b: string | undefined | null) {
  if (!b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

export { };
