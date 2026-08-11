import { AchievementId } from "@enums";
import { ThemeChangeEventDetail } from "types";

declare global {
  interface Window {
    GamepadHelper: import("./src/utils/gamepad-helper").GamepadHelper;
  }
}

declare global {
  interface WindowEventMap {
    'themeChange': CustomEvent<ThemeChangeEventDetail>;
  }
}

export {}; // Ensures this file is treated as a module
