import { StatDefinition } from "types";

export const secretOceangate: StatDefinition = {
  id: "OCEANGATE",
  title: "Oceangate",
  description: "Submersible not included.",
  type: "BG",
  isLocked: false,
  isEnabled: false,
  trophy: 2, // gold
  theme: {
    background: "secret-background",
    boot: {
      component: "ps1-boot",
      bootDuration: 16000,
      bootFadeOutDuration: 2000,
    },
    clock: "clock",
  },
};

export { secretOceangate as default };
