'use client';

import { getIcon } from "@components/icons/icon-loader";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faEllipsis, faHeart, faI, faU, faStar, faKiss, faCat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import build from "@services/menuBuilder";
import Image from "next/image";
import { StatDefinition } from "types/secrets";
import { IXmbCategory, XmbCategory, XmbItem, XmbMenu } from "types/xmb/index";
import 'types/extensions/strings.extensions';

const createIcon = (icon: IconProp, cssClasses: string | null = null) => {
  return <FontAwesomeIcon icon={icon} className={`xmb-icon ${cssClasses} drop-shadow-sm drop-shadow-black/60dd`} />;
};

const createXmbIcon = (icon: string, alt: string = '', cssClasses: string = '') => {
  return (
    <div className="border! border-white! rounded-xl flex relative overflow-clip place-content-center m-1.25">
      <Image src={icon} width={120} height={120} alt={alt} className={`xmb-icon object-cover m-0! ${cssClasses} drop-shadow-sm drop-shadow-black/60`} />
    </div>
  );
};

function buildBrixMenu() {
  const brixIcon = createIcon(faCat, 'text-zinc-900! stroke-white/50! stroke-5!');

  const items: XmbItem[] = [
    new XmbItem('i', '', createIcon(faI, 'text-blue-500! stroke-white/50! stroke-8!')),
    new XmbItem('heart', '', createIcon(faHeart, 'text-red-400! stroke-white/50! stroke-8!')),
    new XmbItem('u', '', createIcon(faU, 'text-green-400! stroke-white/50! stroke-8!')),
  ];

  const specialCategory: XmbCategory = new XmbCategory('Secret1', 0, 'Hello', brixIcon, items);

  const spotifyCategory: XmbCategory = new XmbCategory('Music', 1, 'Playlists', createIcon(faSpotify, 'text-green-400! stroke-white/50! stroke-10!'));

  // to get the icon from the web UI:
  // $('[data-testid="playlist-image"]').querySelector('img').getAttribute('src')
  const brixBopsIcon = createXmbIcon('image/brix/bops.webp', "Brix's Bops");
  spotifyCategory.addItem("brixs-bops", "Brix's Bops", brixBopsIcon, 'https://open.spotify.com/playlist/7AVn7cy7XopHvqB0FTaUDF');

  const brix3Icon = createXmbIcon('image/brix/3.webp', "\u2764\uFE0F");
  spotifyCategory.addItem("brix-3", "\u2764\uFE0F", brix3Icon, 'https://open.spotify.com/playlist/6PfFV5lVba17fGbyoJ18iH');

  const potpourbrixIcon = createXmbIcon('image/brix/potpourbrix.webp', "Potpourbrix");
  spotifyCategory.addItem("potpourbrix", "Potpourbrix", potpourbrixIcon, 'https://open.spotify.com/playlist/0wZygYXKFvIylXckDCFe9r');

  const crushIcon = createXmbIcon('image/brix/crush.jpg', "Orange Crush");
  spotifyCategory.addItem("orange-crush", "Orange Crush", crushIcon, 'https://open.spotify.com/playlist/3kI74UiqMjDfp2cPd2rzww');

  const brixMixIcon = createXmbIcon('image/brix/brix-mix.jpg', "Brix Mix");
  spotifyCategory.addItem("brix-mix", "Brix Mix", brixMixIcon, 'https://open.spotify.com/playlist/6gx8iQX1iTQ3Eh86UNKmxj');

  const brixcoreIcon = createXmbIcon('image/brix/brixcore.jpg', "Brixcore");
  spotifyCategory.addItem("brixcore", "Brixcore", brixcoreIcon, 'https://open.spotify.com/playlist/6PFosROEylHbGwpdlQQD3u');

  const brixDMIcon = createXmbIcon('image/brix/brixdm.jpg', "BrixDM");
  spotifyCategory.addItem("brixdm", "BrixDM", brixDMIcon, 'https://open.spotify.com/playlist/2SYSX5SZm1jXnpMSCp44L1');

  spotifyCategory.addItem("more", "More", createIcon(faEllipsis), '/', 'Coming soon...', false, false);

  const newCategories: IXmbCategory[] = [
    specialCategory,
    spotifyCategory,
  ];

  const defaultMenu = build();
  const origItems = defaultMenu.items.map((i) => {
    i.index = i.index + newCategories.length;
    if (i.type.equalsIgnoreCase('Home')) {
      i.icon = getIcon('home', { className: 'stroke-white/50 stroke-8 text-blue-500!' });

      i.items.forEach(c => {
        if (c.type.equalsIgnoreCase('about')) c.icon = getIcon('info', { className: 'stroke-white/50 stroke-8 text-blue-500!' });
        if (c.type.equalsIgnoreCase('help')) c.icon = getIcon('questionCircle', { className: 'stroke-white/50 stroke-8 text-indigo-500!' });
        if (c.type.equalsIgnoreCase('secrets')) c.icon = getIcon('egg', { className: 'stroke-white/50 stroke-8 text-rose-500!' });
        if (c.type.equalsIgnoreCase('contact')) c.icon = getIcon('message', { className: 'stroke-white/50 stroke-8 text-blue-500!' });
      });
    }
    else if (i.type.equalsIgnoreCase('Dev')) {
      i.icon = getIcon('code', { className: 'stroke-white/50 stroke-8 text-indigo-600!' });

      i.items.forEach(c => {
        if (c.type.equalsIgnoreCase('github')) c.icon = getIcon('github', { className: 'stroke-white/50 stroke-8 fill-green-500!' });
        if (c.type.equalsIgnoreCase('gitlab')) c.icon = getIcon('gitlab', { className: 'stroke-white/50 stroke-8 text-orange-400!' });
        if (c.type.equalsIgnoreCase('dockerhub')) c.icon = getIcon('docker', { className: 'stroke-white/50 stroke-8 text-sky-500!' });
        if (c.type.equalsIgnoreCase('stack-overflow')) c.icon = getIcon('stackOverflow', { className: 'stroke-white/50 stroke-8 text-orange-500!' });
      });
    }
    else if (i.type.equalsIgnoreCase('Settings')) {
      i.icon = getIcon('settings', { className: 'stroke-white/50 stroke-8 text-red-500!' });

      i.items.forEach(c => {
        if (c.type.equalsIgnoreCase('github-actions')) c.icon = getIcon('githubActions', { className: 'stroke-white/50 stroke-[0.4px] fill-blue-500!' });
        if (c.type.equalsIgnoreCase('fork')) c.icon = getIcon('codeFork', { className: 'stroke-white/50 stroke-8 text-blue-500!' });
        if (c.type.equalsIgnoreCase('next-js')) c.icon = getIcon('nextJs', { className: 'stroke-white/50 stroke-8 fill-gray-950!' });
        if (c.type.equalsIgnoreCase('git')) c.icon = getIcon('git', { className: 'stroke-white/50 stroke-8 text-orange-600!' });
        if (c.type.equalsIgnoreCase('font-awesome')) c.icon = getIcon('fontAwesome', { className: 'stroke-white/50 stroke-8 text-red-500!' });
      });
    }
    else if (i.type.equalsIgnoreCase('Gaming')) {
      i.icon = getIcon('controller', { className: 'fill-green-500! stroke-white/50! stroke-2!' });

      i.items.forEach(c => {
        if (c.type.equalsIgnoreCase('youtube')) c.icon = getIcon('youtube', { className: 'stroke-white/50 stroke-8 text-red-500!' });
        if (c.type.equalsIgnoreCase('steam')) c.icon = getIcon('steam', { className: 'stroke-white/50! text-blue-950! stroke-[0.4px]!' });
        if (c.type.equalsIgnoreCase('true-achievements')) c.icon = getIcon('trueachievements', { className: 'stroke-white/50 stroke-10 text-zinc-900!' });
        if (c.type.equalsIgnoreCase('speedrun')) c.icon = getIcon('trophy', { className: 'stroke-white/50 stroke-8 text-yellow-500!' });
        if (c.type.equalsIgnoreCase('xbox')) c.icon = getIcon('xbox', { className: 'stroke-white/50 stroke-8 text-green-500!' });
        if (c.type.equalsIgnoreCase('battle-net')) c.icon = getIcon('battleNet', { className: 'stroke-white/50 stroke-8 text-blue-500!' });
        if (c.type.equalsIgnoreCase('twitch')) c.icon = getIcon('twitch', { className: 'stroke-white/50 stroke-8 text-violet-500!' });
        if (c.type.equalsIgnoreCase('exophase')) c.icon = getIcon('exophase', { className: 'stroke-white/50! fill-sky-500!' });
      });
    }
    else if (i.type.equalsIgnoreCase('Social')) {
      i.icon = getIcon('message', { className: 'stroke-white/50 stroke-8 text-sky-500!' });

      i.items.forEach(c => {
        if (c.type.equalsIgnoreCase('discord')) c.icon = getIcon('discord', { className: 'stroke-white/50 stroke-8 text-violet-500!' });
        if (c.type.equalsIgnoreCase('youtube')) c.icon = getIcon('youtube', { className: 'stroke-white/50 stroke-8 text-red-500!' });
        if (c.type.equalsIgnoreCase('facebook')) c.icon = getIcon('facebook', { className: 'stroke-white/50 stroke-8 text-blue-500!' });
        if (c.type.equalsIgnoreCase('spotify')) c.icon = getIcon('spotify', { className: 'stroke-white/50 stroke-8 text-green-500!' });
        if (c.type.equalsIgnoreCase('instagram')) c.icon = getIcon('instagram', { className: 'stroke-white/50 stroke-5 text-[#5D4037]!' });
        if (c.type.equalsIgnoreCase('x')) c.icon = getIcon('xTwitter', { className: 'stroke-white/50 stroke-8 text-blue-500!' });
        if (c.type.equalsIgnoreCase('stats-fm')) c.icon = getIcon('statsFm', { className: 'stroke-white/50 stroke-10 text-sky-500!' });
      });
    }
    return i;
  });

  if (!origItems) throw new Error(`Failed to build XmbMenu.`);

  const categories: IXmbCategory[] = [...newCategories, ...origItems];

  const brixMenu = new XmbMenu(categories);

  return brixMenu;
};

const brixMenu: XmbMenu = buildBrixMenu();
const stats: StatDefinition[] = [
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
    menu: brixMenu,
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

