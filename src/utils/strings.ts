export function equalsIgnoreCase(a: string, b: string | undefined | null) {
  if (!b) return false;
  return a.toLowerCase() === b.toLowerCase();
}
