import { StatDefinition } from "types";

export const secretIwhbyd: StatDefinition = {
  id: "IWHBYD",
  title: "IWHBYD",
  description: "I would have been your daddy, but the dog beat me over the fence!",
  type: "BG",
  isLocked: false,
  isEnabled: false,
  trophy: 0, // bronze
  theme: {
    audio: {
      cursor: '',
      ok: '',
      cancel: '',
      notification: '',
      error: '',
      enable: '',
      disable: '',
      open: '',
    },
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

export { secretIwhbyd as default };
