import { XmbMenu, XmbCategory } from "types/xmb/";
import { getIcon } from "@components/icons/icon-loader";

function buildHomeCategory(): XmbCategory {
  const category: XmbCategory = new XmbCategory('Home', 0, "Home", getIcon('home'));

  category.addItem("about", "About", getIcon('info'), '/about', "Display the about screen");
  category.addItem("help", "Help", getIcon('questionCircle'), '/help', "Display the help screen");
  category.addItem("contact", "Contact", getIcon('message'), 'mailto:info@test.com', 'Send a message');
  category.addItem("secrets", "Secrets", getIcon('egg'), '/secrets', 'View current secret progress');

  return category;
}

function buildDevCategory(): XmbCategory {
  const category: XmbCategory = new XmbCategory('Dev', 1, "Dev", getIcon('code'));

  category.addItem("github", "GitHub", getIcon('github'), 'https://github.com/syntax-tm', 'View GitHub profile');
  category.addItem("github-gists", "GitHub Gists", getIcon('githubAlt'), 'https://gist.github.com/syntax-tm', 'View GitHub Gists');
  category.addItem("gitlab", "GitLab", getIcon('gitlab'), 'https://gitlab.com/syntax-tm', 'View GitLab profile');
  category.addItem("dockerhub", "DockerHub", getIcon('docker'), 'https://hub.docker.com/u/syntaxtm', 'View DockerHub profile');
  category.addItem("stackoverflow", "StackOverflow", getIcon('stackOverflow'), 'https://stackoverflow.com/users/6823084/trey', 'View StackOverflow profile');

  return category;
}

function buildGamingCategory(): XmbCategory {
  const category: XmbCategory = new XmbCategory('Gaming', 2, "Gaming", getIcon('controller'));

  category.addItem("speedrun", "Speedrun.com", getIcon('trophy'), 'https://www.speedrun.com/user/Gundwn', 'View Speedrun.com profile');
  category.addItem("youtube", "YouTube", getIcon('youtube'), 'https://www.youtube.com/@Gundwn', 'View YouTube channel');
  category.addItem("steam", "Steam", getIcon('steam'), 'https://s.team/p/dwq-wrkt', 'View Steam profile');
  category.addItem("xbox", "Xbox", getIcon('xbox'), 'https://www.xbox.com/en-US/play/user/Gundwn', 'View Xbox profile');
  // TODO: load the copy data from a config file
  // TODO: url encode the special characters instead of hardcoding
  category.addItem("battlenet", "Battle.Net", getIcon('battleNet'), "/copy?title=Battle.Net&name=BattleTag%3A&value=Gundwn%2311586", 'View Battle.Net profile');
  category.addItem("exophase", "Exophase", getIcon('exophase'), 'https://www.exophase.com/user/Gundwn/', 'View Exophase profile');
  category.addItem("trueachievements", "TrueAchievements", getIcon('trueachievements'), 'https://www.trueachievements.com/gamer/Gundwn', 'View TrueAchievements profile');
  category.addItem("twitch", "Twitch", getIcon('twitch'), 'https://twitch.tv/Gundwn', 'View Twitch.tv profile');

  return category;
}

function buildSocialCategory(): XmbCategory {
  const category: XmbCategory = new XmbCategory('Social', 3, "Social", getIcon('user'));

  category.addItem("discord", "Discord", getIcon('discord'), 'https://discordapp.com/users/266438959230353409', 'View Discord profile');
  category.addItem("youtube", "YouTube", getIcon('youtube'), 'https://www.youtube.com/@Gundwn', 'View YouTube channel');
  category.addItem("facebook", "Facebook", getIcon('facebook'), 'https://www.facebook.com/gundwnsrc', 'View Facebook profile');
  category.addItem("instagram", "Instagram", getIcon('instagram'), 'https://instagram.com/GundwnSRC', 'View Instagram profile');
  category.addItem("x", "X", getIcon('xTwitter'), 'https://x.com/gundwnsrc', 'View X (Twitter) profile');
  category.addItem("spotify", "Spotify", getIcon('spotify'), 'https://open.spotify.com/user/1280499465', 'View Spotify profile');
  category.addItem("statsfm", "Stats.fm", getIcon('statsFm'), 'https://stats.fm/gundwn', 'View stats.fm profile');

  return category;
}

function buildSettingsCategory(): XmbCategory {
  const category: XmbCategory = new XmbCategory('Settings', 4, "Settings", getIcon('settings'));

  category.addItem("git", "Source", getIcon('git'), 'https://github.com/syntax-tm/syntax-tm.github.io', 'View this project on GitHub');
  category.addItem("githubactions", "Builds", getIcon('githubActions'), 'https://github.com/syntax-tm/syntax-tm.github.io/actions', 'View latest builds on GitHub');
  category.addItem("fork", "Fork", getIcon('codeFork'), 'https://github.com/syntax-tm/syntax-tm.github.io/fork', 'Fork this project on GitHub');
  category.addItem("nextjs", "Next.js", getIcon('nextJs'), 'https://nextjs.org/', 'About Next.js');
  category.addItem("fontawesome", "FontAwesome", getIcon('fontAwesome'), 'https://fontawesome.com/', 'About FontAwesome');

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
