import { spotify } from "@components/icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEllipsis, faHeart, faI, faL, faO, faV, faE, faU, faY } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import build from "@services/menuBuilder";
import Image from "next/image";
import { StatDefinition } from "types/secrets";
import { IXmbCategory, XmbCategory, XmbItem, XmbMenu } from "types/xmb/index";

const defaultMenu = build();

const createIcon = (icon: IconProp, cssClasses?: string) => {
  return <FontAwesomeIcon icon={icon} className={`xmb-icon ${cssClasses}`} />;
};

const createXmbIcon = (icon: string, alt: string = '', cssClasses: string = '') => {
  return <Image src={icon} width={120} height={120} alt={alt} className={`xmb-icon ${cssClasses}`} />;
};

const buildBrixMenu = () => {
  const brixIcon = createIcon(faHeart, 'text-red-400');

  const items: XmbItem[] = [
    new XmbItem('i', '', createIcon(faI)),
    new XmbItem('blank-1', '', createIcon(faI), '/', '', false, true),
    new XmbItem('l', '', createIcon(faL, 'text-red-400')),
    new XmbItem('o', '', createIcon(faO, 'text-red-400')),
    new XmbItem('v', '', createIcon(faV, 'text-red-400')),
    new XmbItem('e', '', createIcon(faE, 'text-red-400')),
    new XmbItem('blank-2', '', createIcon(faI), '/', '', false, true),
    new XmbItem('y', '', createIcon(faY)),
    new XmbItem('o2', '', createIcon(faO)),
    new XmbItem('u', '', createIcon(faU)),
  ];

  const specialCategory: XmbCategory = new XmbCategory(0, 'Hello', brixIcon, items);

  const spotifyCategory: XmbCategory = new XmbCategory(1, 'Playlists', spotify);

  // to get the icon from the web UI:
  // $('[data-testid="playlist-image"]').querySelector('img').getAttribute('src')
  const brixBopsIcon = createXmbIcon('https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c0fa9f41d3aabe7c2affb049d', "Brix's Bops");
  spotifyCategory.addItem("brixs-bops", "Brix's Bops", brixBopsIcon, 'https://open.spotify.com/playlist/7AVn7cy7XopHvqB0FTaUDF?si=ec2e0faae895415e');

  const brix3Icon = createXmbIcon('https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c40ac8f5ce6e239b566b30f71', "\u2764\uFE0F");
  spotifyCategory.addItem("brix-3", "\u2764\uFE0F", brix3Icon, 'https://open.spotify.com/playlist/6PfFV5lVba17fGbyoJ18iH?si=Ug8HtVGITpujfyaS_PWWxA');

  const potpourbrixIcon = createXmbIcon('https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cb41f10781b4198e250d50fa9', "Potpourbrix");
  spotifyCategory.addItem("potpourbrix", "Potpourbrix", potpourbrixIcon, 'https://open.spotify.com/playlist/0wZygYXKFvIylXckDCFe9r?si=qY69zwR7QXyaNXKBmGAbAw');

  spotifyCategory.addItem("more", "More", createIcon(faEllipsis), '/', 'Coming soon...', false, false);

  const newCategories = [
    specialCategory,
    spotifyCategory,
  ];

  const origItems: IXmbCategory[] = defaultMenu.items.map(i => {
    i.index = i.index + newCategories.length;
    return i;
  });

  const categories: IXmbCategory[] = [...newCategories, ...origItems];

  const brixMenu = new XmbMenu(categories);

  return brixMenu;
};

export const stats: StatDefinition[] = [
  // UNKNOWN
  {
    id: "UNKNOWN",
    title: "",
    description: "",
    type: "META",
    isLocked: true,
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
  },
  // 404
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
  // ANDROID
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
  // PS2
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
        bootDuration: 12000,
        bootFadeOutDuration: 250,
      },
      clock: "clock",
    },
  },
  // DREAMCAST
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
  // IWHBYD
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
      boot: {
        component: "boot",
        bootDuration: 5000,
        bootFadeOutDuration: 250,
        showBackground: true,
      },
      clock: "clock",
    },
  },
  // KONAMI CODE
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
  // MISSING NO
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
      boot: {
        component: "boot",
        bootDuration: 5000,
        bootFadeOutDuration: 250,
        showBackground: true,
      },
      clock: "clock",
    },
  },
  // OCEANGATE
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
  // PSP
  {
    id: "PSP",
    title: "PSP",
    description: "Flash CFW.",
    type: "THEME",
    isLocked: true,
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
  },
  // BRIX
  {
    id: "BRIX",
    title: "\u2764",
    description: "I love you.",
    type: "BRIX",
    isLocked: true,
    isEnabled: false,
    trophy: 3, // platinum
    menu: buildBrixMenu(),
    password: '01-01-2025',
    theme: {
      background: "brix-background",
      boot: {
        component: "brix-boot",
        bootDuration: 10000,
        bootFadeOutDuration: 250,
        showBackground: true,
      },
      clock: "clock",
    },
  },
  // WII
  {
    id: "WII",
    title: "Wii",
    description: "Allow adequate room around you during game play.",
    type: "THEME",
    isLocked: true,
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
  },
];

export { stats as default };
