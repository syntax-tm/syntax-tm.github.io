import { XmbMenu, XmbCategory } from "types/xmb/";
import * as icons from '@components/icons/icons';

function buildHomeCategory(): XmbCategory {
  const category: XmbCategory = new XmbCategory(0, "Home", icons.home);

  category.addItem("about", "About", icons.info, '/about', "Display the about screen");
  category.addItem("help", "Help", icons.questionCircle, '/help', "Display the help screen");
  category.addItem("contact", "Contact", icons.message, 'mailto:info@test.com', 'Send a message');
  category.addItem("secrets", "Secrets", icons.egg, '/secrets', 'View current secret progress');

  return category;
}

function buildDevCategory(): XmbCategory {
  const category: XmbCategory = new XmbCategory(1, "Dev", icons.code);

  category.addItem("github", "GitHub", icons.github, 'https://github.com/syntax-tm', 'View GitHub profile');
  category.addItem("github-gists", "GitHub Gists", icons.githubAlt, 'https://gist.github.com/syntax-tm', 'View GitHub Gists');
  category.addItem("gitlab", "GitLab", icons.gitlab, 'https://gitlab.com/syntax-tm', 'View GitLab profile');
  category.addItem("dockerhub", "DockerHub", icons.docker, 'https://hub.docker.com/u/syntaxtm', 'View DockerHub profile');
  category.addItem("stackoverflow", "StackOverflow", icons.stackOverflow, 'https://stackoverflow.com/users/6823084/trey', 'View StackOverflow profile');

  return category;
}

function buildGamingCategory(): XmbCategory {
  const category: XmbCategory = new XmbCategory(2, "Gaming", icons.games);

  category.addItem("speedrun", "Speedrun.com", icons.trophy, 'https://www.speedrun.com/user/Gundwn', 'View Speedrun.com profile');
  category.addItem("youtube", "YouTube", icons.youtube, 'https://www.youtube.com/@Gundwn', 'View YouTube channel');
  category.addItem("steam", "Steam", icons.steam, 'https://s.team/p/dwq-wrkt', 'View Steam profile');
  category.addItem("xbox", "Xbox", icons.xbox, 'https://www.xbox.com/en-US/play/user/Gundwn', 'View Xbox profile');
  // TODO: load the copy data from a config file
  // TODO: url encode the special characters instead of hardcoding
  category.addItem("bnet", "Battle.Net", icons.battleNet, "/copy?title=Battle.Net&name=BattleTag%3A&value=Gundwn%2311586", 'View Battle.Net profile');
  category.addItem("exophase", "Exophase", icons.exophase, 'https://www.exophase.com/user/Gundwn/', 'View Exophase profile');
  category.addItem("trueachievements", "TrueAchievements", icons.trueachievements, 'https://www.trueachievements.com/gamer/Gundwn', 'View TrueAchievements profile');
  category.addItem("twitch", "Twitch", icons.twitch, 'https://twitch.tv/Gundwn', 'View Twitch.tv profile');

  return category;
}

function buildSocialCategory(): XmbCategory {
  const category: XmbCategory = new XmbCategory(3, "Social", icons.user);

  category.addItem("discord", "Discord", icons.discord, 'https://discordapp.com/users/266438959230353409', 'View Discord profile');
  category.addItem("youtube", "YouTube", icons.youtube, 'https://www.youtube.com/@Gundwn', 'View YouTube channel');
  category.addItem("facebook", "Facebook", icons.facebook, 'https://www.facebook.com/gundwnsrc', 'View Facebook profile');
  category.addItem("instagram", "Instagram", icons.instagram, 'https://instagram.com/GundwnSRC', 'View Instagram profile');
  category.addItem("x", "X", icons.xTwitter, 'https://x.com/gundwnsrc', 'View X (Twitter) profile');
  category.addItem("spotify", "Spotify", icons.spotify, 'https://open.spotify.com/user/1280499465', 'View Spotify profile');
  category.addItem("stats.fm", "Stats.fm", icons.statsFm, 'https://stats.fm/gundwn', 'View stats.fm profile');

  return category;
}

function buildSettingsCategory(): XmbCategory {
  const category: XmbCategory = new XmbCategory(4, "Settings", icons.settings);

  category.addItem("viewSource", "Source", icons.git, 'https://github.com/syntax-tm/syntax-tm.github.io', 'View this project on GitHub');
  category.addItem("builds", "Builds", icons.githubActions, 'https://github.com/syntax-tm/syntax-tm.github.io/actions', 'View latest builds on GitHub');
  category.addItem("fork", "Fork", icons.codeFork, 'https://github.com/syntax-tm/syntax-tm.github.io/fork', 'Fork this project on GitHub');
  category.addItem("nextjs", "Next.js", icons.nextJs, 'https://nextjs.org/', 'About Next.js');
  category.addItem("fa", "FontAwesome", icons.fontAwesome, 'https://fontawesome.com/', 'About FontAwesome');

  return category;
}

export default function build(): XmbMenu {
  const homeCategory = buildHomeCategory();
  const devCategory = buildDevCategory();
  const gamingCategory = buildGamingCategory();
  const socialCategory = buildSocialCategory();
  const settingsCategory = buildSettingsCategory();

  const categories: XmbCategory[] = [
    homeCategory,
    devCategory,
    gamingCategory,
    socialCategory,
    settingsCategory,
  ];

  return new XmbMenu(categories);
}
