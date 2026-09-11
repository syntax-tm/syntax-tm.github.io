'use client';

import { cache } from "react";
import Image from "next/image";
import { createFaIcon, createSvgIcon } from "@components/icon/icon";
import build from "@services/menu-builder";
import { StatDefinition } from "types/secrets";
import { IXmbCategory, XmbCategory, XmbItem, XmbMenu } from "types/xmb/index";
import { FaIconKind } from "types/icons/fa-icons";
import { BitmapIcon, ComponentIcon, FaIcon } from "types/xmb/xmb-icon";
import 'types/extensions/strings.extensions';

const createColoredFaIcon = (kind: FaIconKind, cssClasses: string | null = null) => {
  const icon = createFaIcon(kind, { className: `xmb-icon ${cssClasses} drop-shadow-sm drop-shadow-black/60` });
  return icon;
};

const createXmbIcon = (src: string, alt: string = '', cssClasses: string = '') => {
  const icon = new BitmapIcon('custom', { className: cssClasses, src, alt }, src);
  const el = (
    <div className="border! border-white! rounded-xl flex relative overflow-clip place-content-center m-2.25">
      <Image src={src} width={120} height={120} alt={alt} className={`xmb-icon object-fill m-0! ${cssClasses} drop-shadow-sm drop-shadow-black/60`} />
    </div>
  );
  icon.element = el;
  return icon;
};

function buildBrixMenu() {
  const brixIcon = new FaIcon('cat', { className: 'text-zinc-900! stroke-white/50! stroke-5!' });

  const items: XmbItem[] = [
    new XmbItem('i', '', new FaIcon('i', { className: 'text-blue-500 stroke-white/50' })),
    new XmbItem('heart', '', new FaIcon('heart', { className: 'text-red-400! stroke-white/50! stroke-8!' })),
    new XmbItem('u', '', new FaIcon('u', { className: 'text-green-400! stroke-white/50! stroke-8!' })),
  ];

  const specialCategory: XmbCategory = new XmbCategory('Welcome', 0, 'Hello', brixIcon, items);

  const spotifyCategory: XmbCategory = new XmbCategory('Music', 1, 'Playlists', new FaIcon('spotify', { className: 'text-green-400! stroke-white/50! stroke-10!' }));

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

  spotifyCategory.addItem("more", "More", new FaIcon('ellipsis', { className: 'stroke-white/50 stroke-8 text-white!' }), 'https://open.spotify.com/user/1280499465/playlists', 'View more');

  const newCategories: IXmbCategory[] = [
    specialCategory,
    spotifyCategory,
  ];

  const defaultMenu = build();
  const origItems = defaultMenu.items.map((i) => {
    i.index = i.index + newCategories.length;
    if (i.type.equalsIgnoreCase('Home')) {
      i.icon.element = createColoredFaIcon('house', 'stroke-white/50 stroke-8 text-blue-500!');

      i.items.forEach(c => {
        if (c.type.equalsIgnoreCase('about')) c.icon.element = createColoredFaIcon('info-circle', 'stroke-white/50 stroke-8 text-blue-500!');
        if (c.type.equalsIgnoreCase('help')) c.icon.element = createColoredFaIcon('question-circle', 'stroke-white/50 stroke-8 text-indigo-500!');
        if (c.type.equalsIgnoreCase('secrets')) c.icon = new ComponentIcon('egg',{ className: 'xmb-icon stroke-white/50 stroke-8 text-yellow-500!', width: 120, height: 120 });
        if (c.type.equalsIgnoreCase('contact')) c.icon.element = createColoredFaIcon('message', 'stroke-white/50 stroke-8 text-cyan-400!');
      });
    }
    else if (i.type.equalsIgnoreCase('Dev')) {
      i.icon.element = createColoredFaIcon('code', 'stroke-white/50 stroke-8 text-indigo-600!');

      i.items.forEach(c => {
        if (c.type.equalsIgnoreCase('github')) c.icon.element = createColoredFaIcon('github', 'stroke-white/50 stroke-8 fill-green-500!');
        if (c.type.equalsIgnoreCase('gitlab')) c.icon.element = createColoredFaIcon('gitlab', 'stroke-white/50 stroke-8 text-orange-400!');
        if (c.type.equalsIgnoreCase('dockerhub')) c.icon.element = createColoredFaIcon('docker', 'stroke-white/50 stroke-8 text-sky-500!');
        if (c.type.equalsIgnoreCase('stack-overflow')) c.icon.element = createColoredFaIcon('stack-overflow', 'stroke-white/50 stroke-8 text-orange-500!');
      });
    }
    else if (i.type.equalsIgnoreCase('Settings')) {
      i.icon.element = createColoredFaIcon('toolbox', 'stroke-white/50 stroke-8 text-emerald-300!');

      i.items.forEach(c => {
        if (c.type.equalsIgnoreCase('github-actions')) c.icon.element = createSvgIcon('github-actions', { className: 'stroke-white/50 stroke-[0.4px] fill-blue-500!' });
        if (c.type.equalsIgnoreCase('fork')) c.icon.element = createColoredFaIcon('code-fork', 'stroke-white/50 stroke-8 text-blue-500!');
        if (c.type.equalsIgnoreCase('next-js')) c.icon.element = createSvgIcon('next-js', { className: 'stroke-white/50 stroke-8 fill-gray-950!' });
        if (c.type.equalsIgnoreCase('git')) c.icon.element = createColoredFaIcon('git', 'stroke-white/50 stroke-8 text-orange-500!');
        if (c.type.equalsIgnoreCase('font-awesome')) c.icon.element = createColoredFaIcon('font-awesome', 'stroke-white/50 stroke-8 text-blue-500!');
      });
    }
    else if (i.type.equalsIgnoreCase('Gaming')) {
      i.icon.element = createSvgIcon('controller', { className: 'fill-white! stroke-white/50! stroke-2!' });

      i.items.forEach(c => {
        if (c.type.equalsIgnoreCase('youtube')) c.icon.element = createColoredFaIcon('youtube', 'stroke-white/50 stroke-8 text-red-500!');
        if (c.type.equalsIgnoreCase('steam')) c.icon.element = createColoredFaIcon('steam-symbol', 'stroke-white/50 text-blue-950! stroke-8!');
        if (c.type.equalsIgnoreCase('true-achievements')) c.icon.element = createSvgIcon('true-achievements', { className: 'stroke-white/25 stroke-13 text-zinc-900!' });
        if (c.type.equalsIgnoreCase('speedrun')) c.icon.element = createColoredFaIcon('trophy', 'stroke-white/50 stroke-8 text-yellow-500!');
        if (c.type.equalsIgnoreCase('xbox')) c.icon.element = createColoredFaIcon('xbox', 'stroke-white/50 stroke-8 text-green-600!');
        if (c.type.equalsIgnoreCase('battle-net')) c.icon.element = createColoredFaIcon('battle-net', 'stroke-white/50 stroke-8 text-blue-500!');
        if (c.type.equalsIgnoreCase('twitch')) c.icon.element = createColoredFaIcon('twitch', 'stroke-white/50 stroke-8 text-violet-500!');
        if (c.type.equalsIgnoreCase('exophase')) c.icon.element = createSvgIcon('exophase', { className: 'stroke-white/50! fill-sky-500!' });
      });
    }
    else if (i.type.equalsIgnoreCase('Social')) {
      i.icon.element = createColoredFaIcon('message', 'stroke-white/50 stroke-8 text-sky-500!');

      i.items.forEach(c => {
        if (c.type.equalsIgnoreCase('discord')) c.icon.element = createColoredFaIcon('discord', 'stroke-white/50 stroke-8 text-violet-500!');
        if (c.type.equalsIgnoreCase('youtube')) c.icon.element = createColoredFaIcon('youtube', 'stroke-white/50 stroke-8 text-red-500!');
        if (c.type.equalsIgnoreCase('facebook')) c.icon.element = createColoredFaIcon('facebook', 'stroke-white/50 stroke-8 text-blue-500!');
        if (c.type.equalsIgnoreCase('spotify')) c.icon.element = createColoredFaIcon('spotify', 'stroke-white/50 stroke-12 text-green-500!');
        if (c.type.equalsIgnoreCase('instagram')) c.icon.element = createColoredFaIcon('instagram', 'stroke-white/50 stroke-5 text-[#5D4037]!');
        if (c.type.equalsIgnoreCase('x')) c.icon.element = createColoredFaIcon('x-twitter', 'stroke-white/50 stroke-8 text-blue-500!');
        if (c.type.equalsIgnoreCase('stats-fm')) c.icon.element = createSvgIcon('stats-fm', { className: 'stroke-white/50 stroke-10 fill-green-500!' });
      });
    }
    return i;
  });

  if (!origItems) throw new Error(`Failed to build XmbMenu.`);

  const categories: IXmbCategory[] = [...newCategories, ...origItems];

  const brixMenu = new XmbMenu(categories);

  return brixMenu;
};

const brixMenu = cache(buildBrixMenu)();
export const secretBrix: StatDefinition = {
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
};

export { secretBrix as default };
