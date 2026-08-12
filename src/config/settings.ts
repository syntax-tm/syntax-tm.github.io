import { StatDefinition } from "types";

export const stats: StatDefinition[] = [
  {
    id: "_404",
    title: "404",
    description: "There was a page here, but it's gone now.",
    type: "BG",
    isLocked: true,
    isEnabled: false,
    trophy: 1, // silver
    theme: {
      background: "secret-background",
      boot: {
        component: "ps1-boot",
        bootDuration: 16000,
        bootFadeOutDuration: 100,
      },
      clock: "clock",
    },
  },
  {
    id: "ANDROID",
    title: "Android",
    description: "Tap tap tap.",
    type: "BG",
    isLocked: true,
    isEnabled: false,
    trophy: 1, // silver
    theme: {
      background: "secret-background",
      boot: {
        component: "ps1-boot",
        bootDuration: 16000,
        bootFadeOutDuration: 100,
      },
      clock: "clock",
    },
  },
  {
    id: "PS2",
    title: "PlayStation 2",
    description: "",
    type: "THEME",
    isLocked: true,
    isEnabled: false,
    trophy: 1, // silver
    theme: {
      audio: {
        cursor: 'audio\ps2\cursor.mp3',
        ok: 'audio\ps2\ok.mp3',
        cancel: 'audio\ps2\cursor.mp3',
        notification: 'audio\ps2\cursor.mp3',
        error: 'audio\ps2\error.mp3',
        enable: 'audio\ps2\enable.mp3',
        disable: 'audio\ps2\disable.mp3',
        open: 'audio\ps2\open.mp3',
      },
      background: "ps2-background",
      boot: {
        component: "ps2-boot",
        bootDuration: 10000,
        bootFadeOutDuration: 2000,
      },
      clock: "clock",
    },
  },
  {
    id: "DREAMCAST",
    title: "Dreamcast",
    description: "Party like it's 9-9-99.",
    type: "THEME",
    isLocked: true,
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
  },
  {
    id: "IWHBYD",
    title: "IWHBYD",
    description: "I would have been your daddy, but the dog beat me over the fence!",
    type: "BG",
    isLocked: true,
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
      boot: "boot",
      clock: "clock",
    },
  },
  {
    id: "KONAMI_CODE",
    title: "Konami Code",
    description: "Entered the Konami Code.",
    type: "BG",
    isLocked: true,
    isEnabled: false,
    trophy: 1, // silver
    theme: {
      background: "secret-background",
      boot: {
        component: "ps1-boot",
        bootDuration: 16000,
        bootFadeOutDuration: 100,
      },
      clock: "clock",
    },
  },
  {
    id: "MISSING_NO",
    title: "MissingNo.",
    description: "<Memory Corrupted>",
    type: "BG",
    isLocked: true,
    isEnabled: false,
    trophy: 0, // bronze
    theme: {
      background: "secret-background",
      boot: "boot",
      clock: "clock",
    },
  },
  {
    id: "OCEANGATE",
    title: "Oceangate",
    description: "Submersible not included.",
    type: "BG",
    isLocked: true,
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
  },
  {
    id: "PSP_CODE",
    title: "PSP Mode",
    description: "Flash CFW.",
    type: "THEME",
    isLocked: true,
    isEnabled: false,
    trophy: 3, // platinum
    theme: {
      background: "webgl-background",
      boot: "boot",
      clock: "psp-clock",
    },
  },
];

export default stats;
