'use client';

import { XmbMenu, XmbCategory, IXmbCategory } from "types/xmb/";
// import { EggIcon } from "@components/icon/icons/egg-icon";
import { cache } from "react";
import { createComponentIcon, createFaIcon, createSvgIcon } from "types/xmb/xmb-icon";

const props = { className: 'xmb-icon fill-white text-white' };

function buildHomeCategory(): XmbCategory {
  const category = new XmbCategory('Home', 0, "Home",  createFaIcon('house', props));

  category.addItem("about", "About",  createFaIcon('info-circle', props), '/about', "Display the about screen");
  category.addItem("help", "Help",  createFaIcon('question-circle', props), '/help', "Display the help screen");
  category.addItem("contact", "Contact",  createFaIcon('message', props), 'mailto:info@test.com', 'Send a message');
  category.addItem("secrets", "Secrets", createComponentIcon('egg', { ...props, width: 120, height: 120 }), '/secrets', 'View current secret progress');

  return category;
}

function buildDevCategory(): XmbCategory {
  const category = new XmbCategory('Dev', 1, "Dev",  createFaIcon('code', props));

  category.addItem("github", "GitHub",  createFaIcon('github', props), 'https://github.com/syntax-tm', 'View GitHub profile');
  category.addItem("github-gists", "GitHub Gists",  createFaIcon('github-alt', props), 'https://gist.github.com/syntax-tm', 'View GitHub Gists');
  category.addItem("gitlab", "GitLab",  createFaIcon('gitlab', props), 'https://gitlab.com/syntax-tm', 'View GitLab profile');
  category.addItem("dockerhub", "DockerHub",  createFaIcon('docker', props), 'https://hub.docker.com/u/syntaxtm', 'View DockerHub profile');
  category.addItem("stack-overflow", "StackOverflow",  createFaIcon('stack-overflow', props), 'https://stackoverflow.com/users/6823084/trey', 'View StackOverflow profile');

  return category;
}

function buildGamingCategory(): XmbCategory {
  const category = new XmbCategory('Gaming', 2, "Gaming",  createSvgIcon('controller', props));

  category.addItem("speedrun", "Speedrun.com",  createFaIcon('trophy', props), 'https://www.speedrun.com/user/Gundwn', 'View Speedrun.com profile');
  category.addItem("youtube", "YouTube",  createFaIcon('youtube', props), 'https://www.youtube.com/@Gundwn', 'View YouTube channel');
  category.addItem("steam", "Steam",  createFaIcon('steam', props), 'https://s.team/p/dwq-wrkt', 'View Steam profile');
  category.addItem("xbox", "Xbox",  createFaIcon('xbox', props), 'https://www.xbox.com/en-US/play/user/Gundwn', 'View Xbox profile');
  // TODO: load the copy data from a config file
  // TODO: url encode the special characters instead of hardcoding
  category.addItem("battle-net", "Battle.Net",  createFaIcon('battle-net', props), "/copy?title=Battle.Net&name=BattleTag%3A&value=Gundwn%2311586", 'View Battle.Net profile');
  category.addItem("exophase", "Exophase",  createSvgIcon('exophase', { className: 'xmb-icon fill-white! text-white' }), 'https://www.exophase.com/user/Gundwn/', 'View Exophase profile');
  category.addItem("true-achievements", "TrueAchievements",  createSvgIcon('true-achievements', { className: 'xmb-icon fill-white! text-white' }), 'https://www.trueachievements.com/gamer/Gundwn', 'View TrueAchievements profile');
  category.addItem("twitch", "Twitch",  createFaIcon('twitch', props), 'https://twitch.tv/Gundwn', 'View Twitch.tv profile');

  return category;
}

function buildSocialCategory(): XmbCategory {
  const category = new XmbCategory('Social', 3, "Social",  createSvgIcon('user', props));

  category.addItem("discord", "Discord",  createFaIcon('discord', props), 'https://discordapp.com/users/266438959230353409', 'View Discord profile');
  category.addItem("youtube", "YouTube",  createFaIcon('youtube', props), 'https://www.youtube.com/@Gundwn', 'View YouTube channel');
  category.addItem("facebook", "Facebook",  createFaIcon('facebook', props), 'https://www.facebook.com/gundwnsrc', 'View Facebook profile');
  category.addItem("instagram", "Instagram",  createFaIcon('instagram', props), 'https://instagram.com/GundwnSRC', 'View Instagram profile');
  category.addItem("x", "X",  createFaIcon('x-twitter', props), 'https://x.com/gundwnsrc', 'View X (Twitter) profile');
  category.addItem("spotify", "Spotify",  createFaIcon('spotify', props), 'https://open.spotify.com/user/1280499465', 'View Spotify profile');
  category.addItem("stats-fm", "Stats.fm",  createSvgIcon('stats-fm', { className: 'xmb-icon fill-white! text-white' }), 'https://stats.fm/gundwn', 'View stats.fm profile');

  return category;
}

function buildSettingsCategory(): IXmbCategory {
  const props = { className: 'xmb-icon fill-white text-white' };
  const category = new XmbCategory('Settings', 4, "Settings",  createFaIcon('toolbox', props));

  category.addItem("git", "Source",  createFaIcon('git', props), 'https://github.com/syntax-tm/syntax-tm.github.io', 'View this project on GitHub');
  category.addItem("github-actions", "Builds",  createSvgIcon('github-actions', { className: 'xmb-icon fill-white! text-white' }), 'https://github.com/syntax-tm/syntax-tm.github.io/actions', 'View latest builds on GitHub');
  category.addItem("fork", "Fork",  createFaIcon('code-fork', props), 'https://github.com/syntax-tm/syntax-tm.github.io/fork', 'Fork this project on GitHub');
  category.addItem("next-js", "Next.js",  createSvgIcon('next-js', props), 'https://nextjs.org/', 'About Next.js');
  category.addItem("font-awesome", "FontAwesome", createFaIcon('font-awesome', props), 'https://fontawesome.com/', 'About FontAwesome');

  return category;
}

const buildMenu = () => {
  const homeCategory =  cache(() => buildHomeCategory());
  const devCategory =  cache(() => buildDevCategory());
  const gamingCategory =  cache(() => buildGamingCategory());
  const socialCategory =  cache(() => buildSocialCategory());
  const settingsCategory =  cache(() => buildSettingsCategory());

  const categories: IXmbCategory[] = [
    homeCategory(),
    devCategory(),
    gamingCategory(),
    socialCategory(),
    settingsCategory(),
  ];

  return new XmbMenu(categories);
};

export default function build(): XmbMenu {
  const cachedBuildMenu = cache(buildMenu);
  return cachedBuildMenu();
}
