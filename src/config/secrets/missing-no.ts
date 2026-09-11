import { StatDefinition } from "types";

export const secretMissingNo: StatDefinition = {
  id: "MISSING_NO",
  title: "MissingNo.",
  description: "<Memory Corrupted>",
  type: "BG",
  isLocked: false,
  isEnabled: false,
  trophy: 0, // bronze
  theme: {
    background: "secret-background",
    boot: {
      component: "boot",
      bootDuration: 5000,
      bootFadeOutDuration: 250,
      showBackground: true,
    },
    clock: "clock",
  },
};

export { secretMissingNo as default };
