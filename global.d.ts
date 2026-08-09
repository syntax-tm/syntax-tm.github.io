export {}; // Ensures this file is treated as a module

declare global {
  interface Window {
    GamepadHelper: import("./src/utils/gamepad-helper").GamepadHelper;
  }
}
