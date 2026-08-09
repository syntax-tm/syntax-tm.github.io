export enum CONTROLLER_TYPES {
  XBOX = "xbox",
  PLAYSTATION = "playstation",
  SWITCH = "switch",
  STANDARD = "standard",
};

export interface ExactGamepadMapping {
  name: string;
  gamepad_api_ids: string[];
  type: CONTROLLER_TYPES;
};

export interface ControllerTypeMapping {
  buttonMap: Record<number, string>;
  axisMap: Record<number, string>;
}

export type ControllerMapping = Record<CONTROLLER_TYPES, ControllerTypeMapping>;

/**
 * Gamepad Helper Module
 * This module provides a set of utilities for working with gamepads in web applications.
 */
export class GamepadHelper {

  exactGamepadMappings: Record<number, ExactGamepadMapping>;
  controllerMappings: ControllerMapping;
  exactIdLookup: Record<string, ExactGamepadMapping> = {};

  constructor() {
    /**
     * Exact Gamepad Mappings
     * This object maps specific gamepad API IDs to controller types and names.
     * @type {Object.<number, {name: string, gamepad_api_ids: string[], type: string}>}
     */
    this.exactGamepadMappings = {
      0: {
        name: "Generic Gamepad",
        gamepad_api_ids: [
          "USB Gamepad (STANDARD GAMEPAD Vendor: 0079 Product: 0011)",
          "Logitech Cordless RumblePad 2 (STANDARD GAMEPAD Vendor: 046d Product: c219)",
          "Unknown Gamepad (Vendor: 2563 Product: 0575)",
          "PC/PS3/Android (Vendor: 2563 Product: 0575)",
          "Core (Plus) Wired Controller (Vendor: 20d6 Product: a711)",
          "Wireless Controller Extended Gamepad",
        ],
        type: CONTROLLER_TYPES.STANDARD,
      },
      1: {
        name: "Sony PlayStation 3",
        gamepad_api_ids: [
          "54c-268-PLAYSTATION(R)3 Controller",
          "PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)",
          "PLAYSTATION(R)3 Controller (Vendor: 054c Product: 0268)",
          "PS3 GamePad (Vendor: 054c Product: 0268)",
          "PS3/PC Wired GamePad (Vendor: 2563 Product: 0523)",
        ],
        type: CONTROLLER_TYPES.PLAYSTATION,
      },
      2: {
        name: "Sony DualShock (PS4)",
        gamepad_api_ids: [
          "054c-05c4-Wireless Controller",
          "Wireless controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)",
          "054c-09cc-Unknown Gamepad",
          "Unknown Gamepad (STANDARD GAMEPAD Vendor: 054c Product: 09cc)",
          "DS4 Wired Controller (Vendor: 7545 Product: 0104)",
        ],
        type: CONTROLLER_TYPES.PLAYSTATION,
      },
      3: {
        name: "Sony DualSense (PS5)",
        gamepad_api_ids: [
          "054c-0ce6-Wireless Controller",
          "Wireless Controller (Vendor: 054c Product: 0ce6)",
          "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)",
        ],
        type: CONTROLLER_TYPES.PLAYSTATION,
      },
      4: {
        name: "Xbox",
        gamepad_api_ids: [
          "xinput",
          "Xbox Wireless Controller Extended Gamepad",
          "Xbox Wireless Controller",
        ],
        type: CONTROLLER_TYPES.XBOX,
      },
      5: {
        name: "Xbox 360",
        gamepad_api_ids: [
          "Xbox 360 Controller (XInput STANDARD GAMEPAD)",
        ],
        type: CONTROLLER_TYPES.XBOX,
      },
      6: {
        name: "Xbox One/Series",
        gamepad_api_ids: [
          "HID-compliant game controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)",
        ],
        type: CONTROLLER_TYPES.XBOX,
      },
      7: {
        name: "Nintendo Switch Pro Controller",
        gamepad_api_ids: [
          "Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)",
        ],
        type: CONTROLLER_TYPES.SWITCH,
      },
      8: {
        name: "Stadia Controller",
        gamepad_api_ids: [
          "Stadia Controller rev. A (STANDARD GAMEPAD Vendor: 18d1 Product: 9400)",
        ],
        type: CONTROLLER_TYPES.STANDARD,
      },
      9: {
        name: "SNES Gamepad",
        gamepad_api_ids: ["usb gamepad (Vendor: 0810 Product: e501)"],
        type: CONTROLLER_TYPES.STANDARD,
      },
    };

    /**
     * Exact ID Lookup
     * This object maps gamepad API IDs to their respective controller mappings.
     * @type {Object.<string, {name: string, gamepad_api_ids: string[], type: string}>}
     */
    Object.values(this.exactGamepadMappings).forEach((mapping) => {
      mapping.gamepad_api_ids.forEach((id) => {
        this.exactIdLookup[id] = mapping;
      });
    });

    /**
     * Controller Mappings
     * Maps controller types to their respective button and axis mappings.
     * @type {Object.<string, {buttonMap: Object.<number, string>, axisMap: Object.<number, string>}>}
     */
    this.controllerMappings = {
      // Xbox controllers
      [CONTROLLER_TYPES.XBOX]: {
        buttonMap: {
          0: "A",
          1: "B",
          2: "X",
          3: "Y",
          4: "LB",
          5: "RB",
          6: "LT",
          7: "RT",
          8: "Back",
          9: "Start",
          10: "LS",
          11: "RS",
          12: "DUp",
          13: "DDown",
          14: "DLeft",
          15: "DRight",
          16: "Home",
        },
        axisMap: {
          0: "Left Stick X",
          1: "Left Stick Y",
          2: "Right Stick X",
          3: "Right Stick Y",
        },
      },

      // PlayStation controllers
      [CONTROLLER_TYPES.PLAYSTATION]: {
        buttonMap: {
          0: "×",
          1: "○",
          2: "□",
          3: "△",
          4: "L1",
          5: "R1",
          6: "L2",
          7: "R2",
          8: "Share",
          9: "Options",
          10: "L3",
          11: "R3",
          12: "DUp",
          13: "DDown",
          14: "DLeft",
          15: "DRight",
          16: "PS",
          17: "TouchPad",
        },
        axisMap: {
          0: "Left Stick X",
          1: "Left Stick Y",
          2: "Right Stick X",
          3: "Right Stick Y",
        },
      },

      // Nintendo Switch controllers
      [CONTROLLER_TYPES.SWITCH]: {
        buttonMap: {
          0: "B",
          1: "A",
          2: "Y",
          3: "X",
          4: "L",
          5: "R",
          6: "ZL",
          7: "ZR",
          8: "Minus",
          9: "Plus",
          10: "LS",
          11: "RS",
          12: "DUp",
          13: "DDown",
          14: "DLeft",
          15: "DRight",
          16: "Home",
          17: "Capture",
        },
        axisMap: {
          0: "Left Stick X",
          1: "Left Stick Y",
          2: "Right Stick X",
          3: "Right Stick Y",
        },
      },

      // Default mapping for unknown controllers
      [CONTROLLER_TYPES.STANDARD]: {
        buttonMap: {}, // Will use index numbers by default
        axisMap: {
          0: "Axis 0",
          1: "Axis 1",
          2: "Axis 2",
          3: "Axis 3",
        },
      },
    };
  }

  /**
   * Get the image path for a specific button on a controller
   * @param {string} controllerType - The type of controller (XBOX, PLAYSTATION, SWITCH)
   * @param {number} buttonIndex - The index of the button
   * @param {string} [basePath='/assets/img/gamepads/'] - The base path for the images
   * @param {string} [buttonColor='White'] - The color of the button ('Black' or 'White')
   * @param {string} [buttonType='Outline'] - The type of button ('Outline', 'Solid', 'Full Solid')
   * @returns {string|null} The path to the button image or null if not found
   */
  getButtonImagePath(
    controllerType: CONTROLLER_TYPES,
    buttonIndex: number,
    basePath = "/assets/img/gamepads/",
    buttonColor = "White",
    buttonType = "Outline",
  ) {
    // input validation
    if (!["Black", "White"].includes(buttonColor)) {
      console.warn(
        `Invalid buttonColor: ${buttonColor}. Using 'White' instead.`,
      );
      buttonColor = "White";
    }

    if (!["Outline", "Solid", "Full Solid"].includes(buttonType)) {
      console.warn(
        `Invalid buttonType: ${buttonType}. Using 'Outline' instead.`,
      );
      buttonType = "Outline";
    }

    // Controller-specific paths and button mappings
    const imageMappings: Record<CONTROLLER_TYPES, { folder: string, buttons: Record<number, string> }> = {
      [CONTROLLER_TYPES.XBOX]: {
        folder: `xbox/Buttons ${buttonType}/${buttonColor}/SVG/`,
        buttons: {
          0: "A.svg",
          1: "B.svg",
          2: "X.svg",
          3: "Y.svg",
          4: "Left Bumper.svg",
          5: "Right Bumper.svg",
          6: "Left Trigger.svg",
          7: "Right Trigger.svg",
          8: "View.svg",
          9: "Menu.svg",
          10: "Left Stick.svg",
          11: "Right Stick.svg",
          12: "D-Pad Up.svg",
          13: "D-Pad Down.svg",
          14: "D-Pad Left.svg",
          15: "D-Pad Right.svg",
          16: "Home.svg",
        },
      },
      [CONTROLLER_TYPES.PLAYSTATION]: {
        folder: `playstation/Buttons ${buttonType}/${buttonColor}/SVG/`,
        buttons: {
          0: "Cross.svg",
          1: "Circle.svg",
          2: "Square.svg",
          3: "Triangle.svg",
          4: "L1.svg",
          5: "R1.svg",
          6: "L2.svg",
          7: "R2.svg",
          8: "Create.svg",
          9: "Options.svg",
          10: "Left Stick.svg",
          11: "Right Stick.svg",
          12: "D-Pad Up.svg",
          13: "D-Pad Down.svg",
          14: "D-Pad Left.svg",
          15: "D-Pad Right.svg",
          16: "Home.svg",
          17: "Touch Pad Press.svg",
        },
      },
      [CONTROLLER_TYPES.SWITCH]: {
        folder: `switch/Buttons ${buttonType}/${buttonColor}/SVG/`,
        buttons: {
          0: "B.svg",
          1: "A.svg",
          2: "Y.svg",
          3: "X.svg",
          4: "L.svg",
          5: "R.svg",
          6: "ZL.svg",
          7: "ZR.svg",
          8: "Minus.svg",
          9: "Plus.svg",
          10: "Left Stick.svg",
          11: "Right Stick.svg",
          12: "Pro D-Pad Up.svg",
          13: "Pro D-Pad Down.svg",
          14: "Pro D-Pad Left.svg",
          15: "Pro D-Pad Right.svg",
          16: "Home.svg",
          17: "Capture.svg",
        },
      },
      [CONTROLLER_TYPES.STANDARD]: {
        folder: ``,
        buttons: {

        },
      },
    };

    // Check if we have an image mapping for this controller and button
    if (
      imageMappings[controllerType] &&
      imageMappings[controllerType].buttons[buttonIndex]
    ) {
      return (
        basePath +
        imageMappings[controllerType].folder +
        imageMappings[controllerType].buttons[buttonIndex]
      );
    }

    // Return null if no image is available
    return null;
  }

  /**
   * Check if the Gamepad API is supported in the current browser
   * @returns {boolean} True if supported, false otherwise
   */
  isSupported() {
    return !!navigator.getGamepads;
  }

  /**
   * Get gamepad information based on the gamepad ID
   * @param {string|null} gamepadId - The ID of the gamepad as given by the Gamepad API
   * @returns {{type: string, name: string}} Controller type and name information
   */
  getGamepadInfo(gamepadId: string | null) {
    if (!gamepadId) {
      return {
        type: CONTROLLER_TYPES.STANDARD,
        name: "Generic Controller",
      };
    }

    // Check for exact match first
    const exactMatch = this.exactIdLookup[gamepadId];
    if (exactMatch) {
      return {
        type: exactMatch.type,
        name: exactMatch.name,
      };
    }

    return {
      type: CONTROLLER_TYPES.STANDARD,
      name: "Generic Controller",
    };
  }

  /**
   * Detect the controller type based on the gamepad ID
   * @param {string|null} gamepadId - The ID of the gamepad as given by the Gamepad API
   * @returns {string} The type of controller (XBOX, PLAYSTATION, SWITCH, STANDARD)
   */
  detectControllerType(gamepadId: string | null) {
    return this.getGamepadInfo(gamepadId).type;
  }

  /**
   * Get button name for given controller type and button index
   * @param {string} controllerType - The type of controller (XBOX, PLAYSTATION, SWITCH, STANDARD)
   * @param {number} buttonIndex - The index of the button
   * @returns {string} The name of the button (e.g., 'A', 'B', 'X', etc.)
   */
  getButtonName(controllerType: CONTROLLER_TYPES, buttonIndex: number) {
    const mapping =
      this.controllerMappings[controllerType] ||
      this.controllerMappings[CONTROLLER_TYPES.STANDARD];
    return mapping.buttonMap[buttonIndex] || `B${buttonIndex}`;
  }

  /**
   * Get axis name for given controller type and axis index
   * @param {string} controllerType - The type of controller (XBOX, PLAYSTATION, SWITCH, STANDARD)
   * @param {number} axisIndex - The index of the axis
   * @returns {string} The name of the axis (e.g., 'Left Stick X', 'Right Stick Y', etc.)
   */
  getAxisName(controllerType: CONTROLLER_TYPES, axisIndex: number) {
    const mapping =
      this.controllerMappings[controllerType] ||
      this.controllerMappings[CONTROLLER_TYPES.STANDARD];
    return (
      (mapping.axisMap && mapping.axisMap[axisIndex]) ||
      `Axis ${axisIndex}`
    );
  }

  /**
   * Check if vibration is supported on the gamepad
   * @param {Gamepad|null} gamepad - The gamepad object from the Gamepad API
   * @returns {boolean} True if vibration is supported, false otherwise
   */
  isVibrationSupported(gamepad: Gamepad | null) {
    return !(!gamepad || !gamepad.vibrationActuator);
  }

  /**
   * Get vibration capabilities of the gamepad
   * @param {Gamepad|null} gamepad - The gamepad object from the Gamepad API
   * @returns {{supported: boolean, type: string|null}} Vibration capabilities information
   */
  getVibrationCapabilities(gamepad: Gamepad | null) {
    if (!gamepad || !gamepad.vibrationActuator) {
      return { supported: false, type: null };
    }

    return {
      supported: true,
      type: gamepad.vibrationActuator || "unknown",
    };
  }

  /**
   * Vibrate the gamepad
   * @param {Gamepad|null} gamepad - The gamepad object from the Gamepad API
   * @param {Object} [options={}] - Options for vibration
   * @param {number} [options.weakMagnitude=0.5] - Weak rumble magnitude (0-1)
   * @param {number} [options.strongMagnitude=0.5] - Strong rumble magnitude (0-1)
   * @param {number} [options.duration=1000] - Duration in milliseconds
   * @param {number} [options.startDelay=0] - Start delay in milliseconds
   * @returns {Promise<GamepadHapticsResult|Error>} Promise that resolves when vibration completes
   */
  // vibrate(gamepad: Gamepad | null, options = {}) {
  //   options = options ?? {
  //     weakMagnitude: 0.5,
  //     strongMagnitude: 0.5,
  //     duration: 1000,
  //     startDelay: 0,
  //   };

  //   if (!gamepad || !gamepad.vibrationActuator) {
  //     return Promise.reject(
  //       new Error("Vibration not supported on this gamepad"),
  //     );
  //   }

  //   const actuator = gamepad.vibrationActuator;
  //   const actuatorType = actuator || "unknown";

  //   // Different handling based on actuator type
  //   switch (actuatorType) {
  //     case "dual-rumble":
  //       return actuator.playEffect("dual-rumble", {
  //         startDelay: startDelay,
  //         duration: duration,
  //         weakMagnitude: weakMagnitude,
  //         strongMagnitude: strongMagnitude,
  //       });

  //     case "vibration": // Some devices just have a simple vibration effect
  //       {
  //         const magnitude = Math.max(weakMagnitude, strongMagnitude);
  //         return actuator.playEffect("vibration", {
  //           startDelay: startDelay,
  //           duration: duration,
  //           magnitude: magnitude,
  //         });
  //       }

  //     default:
  //       // Try the default effect type for unknown actuators
  //       try {
  //         return actuator.playEffect(actuator.type, {
  //           startDelay: startDelay,
  //           duration: duration,
  //           weakMagnitude: weakMagnitude,
  //           strongMagnitude: strongMagnitude,
  //           magnitude: Math.max(weakMagnitude, strongMagnitude),
  //         });
  //       } catch (e) {
  //         console.warn(
  //           `Attempted to use unknown actuator type: ${actuatorType}\nError: ${e}`,
  //         );
  //         // Fallback to dual-rumble as it's the most common
  //         return actuator.playEffect("dual-rumble", {
  //           startDelay: startDelay,
  //           duration: duration,
  //           weakMagnitude: weakMagnitude,
  //           strongMagnitude: strongMagnitude,
  //         });
  //       }
  //   }
  // }

  /**
   * Stop vibration on the gamepad
   * @param {Gamepad|null} gamepad - The gamepad object from the Gamepad API
   * @returns {Promise<GamepadHapticsResult|Error>} Promise that resolves when vibration stops
   */
  // stopVibration(gamepad) {
  //   if (gamepad && gamepad.vibrationActuator) {
  //     return this.vibrate(gamepad, {
  //       weakMagnitude: 0,
  //       strongMagnitude: 0,
  //     });
  //   }

  //   return Promise.reject(
  //     new Error("Vibration not supported on this browser or gamepad"),
  //   );
  // }

  /**
   * Get all connected gamepads
   * @returns {Gamepad[]} Array of connected gamepad objects
   */
  getConnectedGamepads() {
    if (!this.isSupported()) return [];

    const gamepads = navigator.getGamepads();
    return Array.from(gamepads).filter((gamepad) => gamepad !== null);
  }
}

// Expose to the global scope
if (typeof window !== "undefined") {
  window.GamepadHelper = new GamepadHelper();
}
