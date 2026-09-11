import { StatDefinition } from "types";

export const secretPs2: StatDefinition = {
  id: "PS2",
  title: "PlayStation 2",
  description: "プレイステーション2",
  type: "THEME",
  isLocked: false,
  isEnabled: false,
  trophy: 1, // silver
  theme: {
    audio: {
      cursor: 'audio\\ps2\\cursor.mp3',
      ok: 'audio\\ps2\\ok.mp3',
      cancel: 'audio\\ps2\\cursor.mp3',
      notification: 'audio\\ps2\\cursor.mp3',
      error: 'audio\\ps2\\error.mp3',
      enable: 'audio\\ps2\\enable.mp3',
      disable: 'audio\\ps2\\disable.mp3',
      open: 'audio\\ps2\\open.mp3',
    },
    background: "ps2-background",
    boot: {
      component: "ps2-boot",
      bootDuration: 12000,
      bootFadeOutDuration: 250,
    },
    clock: "clock",
  },
};

export { secretPs2 as default };
