import { StatDefinition } from "types";

export const secretKonamiCode: StatDefinition = {
  id: "KONAMI_CODE",
  title: "Konami Code",
  description: "Entered the Konami Code.",
  type: "BG",
  isLocked: false,
  isEnabled: false,
  trophy: 1, // silver
  theme: {
    background: "torus-background",
    boot: {
      component: "ps1-boot",
      bootDuration: 16000,
      bootFadeOutDuration: 100,
    },
    clock: "clock",
  },
};

export { secretKonamiCode as default };
