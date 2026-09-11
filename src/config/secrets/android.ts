import { StatDefinition } from "types";

export const secretAndroid: StatDefinition = {
  id: "ANDROID",
  title: "Android",
  description: "Tap tap tap.",
  type: "BG",
  isLocked: false,
  isEnabled: false,
  trophy: 1, // silver
  theme: {
    background: "secret-background",
    boot: {
      component: "ps1-boot",
      bootDuration: 16000,
      bootFadeOutDuration: 100,
    },
    clock: "clock",
  },
};

export { secretAndroid as default };
