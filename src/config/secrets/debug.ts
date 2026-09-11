import { StatDefinition } from "types";

export const secretDebug: StatDefinition = {
  id: "DEBUG",
  title: "Debug",
  description: "Enables debug settings.",
  type: "UTIL",
  isLocked: false,
  isEnabled: false,
  trophy: 1, // silver
  theme: {
    background: "webgl-background",
    boot: {
      component: "boot",
      bootDuration: 5000,
      bootFadeOutDuration: 250,
      showBackground: true,
    },
    clock: "clock",
  },
};

export { secretDebug as default };
