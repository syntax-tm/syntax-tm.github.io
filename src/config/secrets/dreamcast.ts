import { StatDefinition } from "types";

export const secretDreamcast: StatDefinition = {
  id: "DREAMCAST",
  title: "Dreamcast",
  description: "Party like it's 9-9-99.",
  type: "THEME",
  isLocked: false,
  isEnabled: false,
  trophy: 3, // platinum
  theme: {
    audio: {
      cursor: 'audio\dreamcast\move.mp3',
      ok: 'audio\dreamcast\confirmation_2.mp3',
      cancel: 'audio\dreamcast\back.mp3',
      notification: 'audio\dreamcast\confirmation.mp3',
      error: 'audio\dreamcast\back.mp3',
      enable: 'audio\dreamcast\confirmation_2.mp3',
      disable: 'audio\dreamcast\disable.mp3',
      open: 'audio\dreamcast\back.mp3',
    },
    background: "dreamcast-background",
    boot: {
      component: "dreamcast-boot",
      bootDuration: 9000,
      bootFadeOutDuration: 2000,
    },
    clock: "dreamcast-clock",
  },
};

export { secretDreamcast as default };
