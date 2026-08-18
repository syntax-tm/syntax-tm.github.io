import { StatGroupDefinition } from "types";

export const stats: StatGroupDefinition[] = [
  {
    type: "BG",
    title: "Background",
    isHidden: false,
  },
  {
    type: "BOOT",
    title: "Boot",
    isHidden: false,
  },
  {
    type: "FILTER",
    title: "Filter",
    isHidden: false,
  },
  {
    type: "FONT",
    title: "Font",
    isHidden: false,
  },
  {
    type: "ICONS",
    title: "Icons",
    isHidden: false,
  },
  {
    type: "THEME",
    title: "Theme",
    isHidden: false,
  },
  {
    type: "BRIX",
    title: "For You",
    isHidden: true,
  },
  {
    type: "META",
    title: "Meta",
    isHidden: false,
  },
];

export { stats as default };
