import { StatDefinition } from "types";

export const secretUnknown: StatDefinition = {
  id: "UNKNOWN",
  title: "",
  description: "",
  type: "META",
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

export { secretUnknown as default };
