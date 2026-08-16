// 'use client';

// import { useCallback, useEffect, useState } from "react";
// import usePath from "./usePath";
// import { Position } from "types";

// export type StandardVoidFn = () => void;
// export type KeyboardEventFn = (e: KeyboardEvent) => void;
// export type KeyEventHandler = KeyboardEventFn | StandardVoidFn;

// // The type guard
// export const isKeyboardHandler = (fn: KeyEventHandler): fn is KeyboardEventFn => fn.length >= 1;

// export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

// export interface KeyPressAction {
//   repeat: boolean;
//   onKeyPress: KeyEventHandler;
// }

// export interface TableInput {
//   target: HTMLTableElement;
//   selector: (x: number, y: number) => string;
//   rows: number;
//   cols: number;
//   actions: Map<string, KeyPressAction>;
//   enabledOnModal: boolean | undefined;
// }

// export interface TableOutput {
//   position: Position;
//   moveUp: () => void;
//   moveDown: () => void;
//   moveLeft: () => void;
//   moveRight: () => void;
//   move: (d: Direction) => void;
//   // moveTop: () => void;
//   // moveBottom: () => void;
//   // moveFirst: () => void;
//   // moveLast: () => void;
//   focusCell: (position: Position | [number, number]) => void;
// }

// const useTable = ({ target, selector, rows, cols, actions, enabledOnModal = false }: TableInput): TableOutput => {
//   const [position, setPosition] = useState<Position>({x: 0, y: 0});
//   const [keysDown, setKeysDown] = useState<string[]>([]);
//   const { modal } = usePath();

//   const isMapped = useCallback((key: string): boolean => {
//     return actions.has(key.toLowerCase());
//   }, [actions]);

//   const isPosition = (o: object): o is Position => {
//     return "x" in o;
//   };

//   const handleKeyUp = useCallback((e: KeyboardEvent): void => {
//     // key is not mapped, ignore
//     if (!isMapped(e.key)) return;

//     if (modal && !enabledOnModal) return;

//     //e.stopPropagation();
//     //e.preventDefault();
//     const updated = keysDown.filter((i) => i !== e.key);
//     setKeysDown(updated);

//     console.log(`keyup: ${e.key}`);
//   }, [keysDown]);

//   const handleKeyDown = useCallback((e: KeyboardEvent) => {
//     // key is not mapped, ignore
//     if (!isMapped(e.key)) return;

//     if (modal && !enabledOnModal) return;

//     //e.stopPropagation();
//     //e.preventDefault();

//     // key is mapped, so retrieve the KeyPressAction
//     const action = actions.get(e.key.toLowerCase());

//     // TODO: this should throw an error
//     if (action === undefined) return;

//     // if this is a repeat and we don't allow repeats
//     if (e.repeat && !action.repeat) return;

//     console.log(`keydown: ${e.key} => ${action.onKeyPress.name}()`);

//     const executeHandler = (
//       fn: KeyEventHandler,
//       event: KeyboardEvent,
//     ) => {
//       if (isKeyboardHandler(fn)) {
//         fn(event); // TypeScript safely knows this needs the event
//       } else {
//         (fn as StandardVoidFn)();      // TypeScript safely knows this takes zero arguments
//       }
//     };

//     executeHandler(action.onKeyPress, e);

//     setKeysDown((prevState) => [...prevState, e.key]);
//   }, [actions, isMapped, modal]);

//   const moveUp = useCallback(() => {
//     const {x, y} = position;
//     if (y <= 0) {
//       setPosition({ x, y: rows - 1});
//       return;
//     }
//     setPosition({ x, y: y - 1 });
//   }, [position]);

//   const moveDown = useCallback(() => {
//     const {x, y} = position;
//     if (y >= rows - 1) {
//       setPosition({ x, y: 0});
//       return;
//     }
//     setPosition({ x, y: y + 1 });
//   }, [position]);

//   const moveLeft = useCallback(() => {
//     const { x, y } = position;
//     if (x <= 0) {
//       setPosition({ x: cols - 1, y });
//       return;
//     }
//     setPosition({ x: x - 1, y });
//   }, [position]);

//   const moveRight = useCallback(() => {
//     const { x, y } = position;
//     if (x >= cols - 1) {
//       setPosition({ x: 0, y });
//       return;
//     }
//     setPosition({ x: x + 1, y });
//   }, [position]);

//   const move = useCallback((d: Direction) => {
//     if (d === "UP") moveUp();
//     else if (d === "DOWN") moveDown();
//     else if (d === "LEFT") moveLeft();
//     else if (d === "RIGHT") moveRight();
//   }, [position]);

//   const focusCell = useCallback((pos: Position | [number, number]) => {

//     let x, y;

//     if (isPosition(pos)) {
//       x = pos.x;
//       y = pos.y;
//     }
//     else {
//       x = pos[0];
//       y = pos[1];
//     }

//     const query = selector(x, y);
//     const targetCell = target.querySelector(query) as HTMLTableCellElement;

//     if (!targetCell) {
//       console.warn(`Unable to locate target cell in ${target.tagName} using query '${query}'.`);
//       return;
//     }

//     targetCell.focus();

//   }, [target]);

//   useEffect(() => {
//     if (modal && !enabledOnModal) return;

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, [handleKeyUp, handleKeyDown, modal]);

//   return {
//     position,
//     focusCell,
//     moveUp,
//     moveDown,
//     moveLeft,
//     moveRight,
//     move,
//   };
// };

// export { useTable as default };
