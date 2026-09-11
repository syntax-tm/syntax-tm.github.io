import { StatDefinition } from "types";

export const secret404: StatDefinition = {
  id: "_404",
  title: "404",
  description: "There was a page here, but it's gone now.",
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

export { secret404 as default };
