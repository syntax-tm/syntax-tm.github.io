import { StatDefinition } from "types";

export const secretPsp: StatDefinition = {
  id: "PSP",
  title: "PSP",
  description: "5.00 M33-6",
  type: "THEME",
  isLocked: false,
  isEnabled: false,
  trophy: 3, // platinum
  theme: {
    background: "psp-background",
    boot: {
      component: "psp-boot",
      bootDuration: 5000,
      bootFadeOutDuration: 250,
      showBackground: true,
    },
    clock: "psp-clock",
  },
};

export { secretPsp as default };
