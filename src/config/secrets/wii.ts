import { StatDefinition } from "types";

export const secretWii: StatDefinition = {
  id: "WII",
  title: "Wii",
  description: "Allow adequate room around you during game play.",
  type: "THEME",
  isLocked: false,
  isEnabled: false,
  trophy: 3, // platinum
  password: 'wii',
  theme: {
    background: "wii-background",
    boot: {
      component: "wii-boot",
      bootDuration: -1,
    },
    clock: "clock",
  },
};

export { secretWii as default };
