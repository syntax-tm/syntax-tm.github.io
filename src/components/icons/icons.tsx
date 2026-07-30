// TODO: clean this up and remove unused icons
// TODO: add findIconDefinition to load fa icons by name once config is moved to json
// https://docs.fontawesome.com/web/use-with/react/use-with#typescript

/* eslint-disable @next/next/no-img-element */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faCog,
  faTrophy,
  faAward,
  faMusic,
  faC,
  faMedal,
  faInfoCircle,
  faComputer,
  faComputerMouse,
  faKeyboard,
  faHeadset,
  faLaptop,
  faDesktop,
  faDisease,
  faCopy,
  faStar,
  faMessage,
  faChartLine,
  faBoxesPacking,
  faCodeFork,
  faShare,
  faInfo,
  faCircleInfo,
  faQuestion,
  faQuestionCircle,
  faEgg,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faGithubAlt,
  faGitlab,
  faStackOverflow,
  faYoutube,
  faSpotify,
  faFacebook,
  faDiscord,
  faXbox,
  faPlaystation,
  faSteam,
  faAmazon,
  faBattleNet,
  faDocker,
  faGit,
  faXTwitter,
  faSnapchat,
  faInstagram,
  faTwitch,
  faThreads,
  faTelegram,
  faFontAwesome,
} from "@fortawesome/free-brands-svg-icons";
import React, { ReactElement } from "react";
import Image from "next/image";
import homeIcon from "public/image/xmb/home.png";
import displayIcon from "public/image/xmb/display.png";
import gamesIcon from "public/image/xmb/games.png";
import gow3Icon from "public/image/xmb/gow3.png";
//import infoIcon from "public/image/xmb/info.png";
import musicIcon from "public/image/xmb/music.png";
import photoIcon from "public/image/xmb/photo.png";
import primeIcon from "public/image/xmb/prime.png";
import resumeIcon from "public/image/xmb/resume.png";
import settingsIcon from "public/image/xmb/settings.png";
import unchartedIcon from "public/image/xmb/uncharted.png";
import updateIcon from "public/image/xmb/update.png";
import userIcon from "public/image/xmb/social.png";
import videoIcon from "public/image/xmb/video.png";
import trueachievementsIcon from "public/image/xmb/trueachievements.png";
import exophaseIcon from "public/image/xmb/exophase.png";
import chocoIcon from "public/image/xmb/choco.png";
import nugetIcon from "public/image/xmb/nuget.png";
import halo3generalBwIcon from "public/image/halo_3_general_bw.png";
import pspBatteryIcon from "public/image/psp_full_battery.png";
import ghActionsIcon from "public/svg/githubactions.svg";
//import statsFmIcon from "public/svg/statsfm.svg";

const xmbIconClassName = "xmb-icon object-contain justify-self-center w-full h-full overflow-visible";

export const egg: ReactElement = (
  <FontAwesomeIcon icon={faEgg} className={xmbIconClassName} />
);
export const info: ReactElement = (
  <FontAwesomeIcon icon={faInfoCircle} className={xmbIconClassName} />
);
export const infoCircle: ReactElement = (
  <FontAwesomeIcon icon={faInfoCircle} className={xmbIconClassName} />
);
export const question: ReactElement = (
  <FontAwesomeIcon icon={faQuestion} className={xmbIconClassName} />
);
export const questionCircle: ReactElement = (
  <FontAwesomeIcon icon={faQuestionCircle} className={xmbIconClassName} />
);
export const share: ReactElement = (
  <FontAwesomeIcon icon={faShare} className={xmbIconClassName} />
);
export const fontAwesome: ReactElement = (
  <FontAwesomeIcon icon={faFontAwesome} className={xmbIconClassName} />
);
export const codeFork: ReactElement = (
  <FontAwesomeIcon icon={faCodeFork} className={xmbIconClassName} />
);
export const boxes: ReactElement = (
  <FontAwesomeIcon icon={faBoxesPacking} className={xmbIconClassName} />
);
export const chart: ReactElement = (
  <FontAwesomeIcon icon={faChartLine} className={xmbIconClassName} />
);
export const star: ReactElement = (
  <FontAwesomeIcon icon={faStar} className={xmbIconClassName} />
);
export const code: ReactElement = (
  <FontAwesomeIcon icon={faCode} className={xmbIconClassName} />
);
export const cog: ReactElement = (
  <FontAwesomeIcon icon={faCog} className={xmbIconClassName} />
);
export const trophy: ReactElement = (
  <FontAwesomeIcon icon={faTrophy} className={xmbIconClassName} />
);
export const award: ReactElement = (
  <FontAwesomeIcon icon={faAward} className={xmbIconClassName} />
);
export const message: ReactElement = (
  <FontAwesomeIcon icon={faMessage} className={`${xmbIconClassName} overflow-auto`} />
);
// export const music: ReactElement = <FontAwesomeIcon icon={faMusic} className='xmb-icon object-contain justify-self-center w-full h-full' />
export const c: ReactElement = (
  <FontAwesomeIcon icon={faC} className={xmbIconClassName} />
);
export const medal: ReactElement = (
  <FontAwesomeIcon icon={faMedal} className={xmbIconClassName} />
);
//xport const info: ReactElement = <FontAwesomeIcon icon={faInfoCircle} className='xmb-icon object-contain justify-self-center w-full h-full' />
export const computer: ReactElement = (
  <FontAwesomeIcon icon={faComputer} className={xmbIconClassName} />
);
export const computerMouse: ReactElement = (
  <FontAwesomeIcon icon={faComputerMouse} className={xmbIconClassName} />
);
export const keyboard: ReactElement = (
  <FontAwesomeIcon icon={faKeyboard} className={xmbIconClassName} />
);
export const headset: ReactElement = (
  <FontAwesomeIcon icon={faHeadset} className={xmbIconClassName} />
);
export const laptop: ReactElement = (
  <FontAwesomeIcon icon={faLaptop} className={xmbIconClassName} />
);
export const desktop: ReactElement = (
  <FontAwesomeIcon icon={faDesktop} className={xmbIconClassName} />
);
// export const video: ReactElement = <FontAwesomeIcon icon={faVideo} className='xmb-icon object-contain justify-self-center w-full h-full' />
export const disease: ReactElement = (
  <FontAwesomeIcon icon={faDisease} className={xmbIconClassName} />
);
export const copy: ReactElement = (
  <FontAwesomeIcon icon={faCopy} className={xmbIconClassName} />
);
export const github: ReactElement = (
  <FontAwesomeIcon icon={faGithub} className={xmbIconClassName} />
);
export const githubAlt: ReactElement = (
  <FontAwesomeIcon icon={faGithubAlt} className={xmbIconClassName} />
);
export const gitlab: ReactElement = (
  <FontAwesomeIcon icon={faGitlab} className={xmbIconClassName} />
);
export const stackOverflow: ReactElement = (
  <FontAwesomeIcon icon={faStackOverflow} className={xmbIconClassName} />
);
export const youtube: ReactElement = (
  <FontAwesomeIcon icon={faYoutube} className={xmbIconClassName} />
);
export const spotify: ReactElement = (
  <FontAwesomeIcon icon={faSpotify} className={xmbIconClassName} />
);
export const facebook: ReactElement = (
  <FontAwesomeIcon icon={faFacebook} className={xmbIconClassName} />
);
export const discord: ReactElement = (
  <FontAwesomeIcon icon={faDiscord} className={xmbIconClassName} />
);
export const xbox: ReactElement = (
  <FontAwesomeIcon icon={faXbox} className={xmbIconClassName} />
);
export const playstation: ReactElement = (
  <FontAwesomeIcon icon={faPlaystation} className={xmbIconClassName} />
);
export const steam: ReactElement = (
  <FontAwesomeIcon icon={faSteam} className={xmbIconClassName} />
);
export const amazon: ReactElement = (
  <FontAwesomeIcon icon={faAmazon} className={xmbIconClassName} />
);
export const battleNet: ReactElement = (
  <FontAwesomeIcon icon={faBattleNet} className={xmbIconClassName} />
);
export const docker: ReactElement = (
  <FontAwesomeIcon icon={faDocker} className={xmbIconClassName} />
);
export const git: ReactElement = (
  <FontAwesomeIcon icon={faGit} className={xmbIconClassName} />
);
export const xTwitter: ReactElement = (
  <FontAwesomeIcon icon={faXTwitter} className={xmbIconClassName} />
);
export const snapchat: ReactElement = (
  <FontAwesomeIcon icon={faSnapchat} className={xmbIconClassName} />
);
export const instagram: ReactElement = (
  <FontAwesomeIcon icon={faInstagram} className={xmbIconClassName} />
);
export const twitch: ReactElement = (
  <FontAwesomeIcon icon={faTwitch} className={xmbIconClassName} />
);
export const threads: ReactElement = (
  <FontAwesomeIcon icon={faThreads} className={xmbIconClassName} />
);
export const telegram: ReactElement = (
  <FontAwesomeIcon icon={faTelegram} className={xmbIconClassName} />
);
export const home: ReactElement = (
  <Image src={homeIcon} className={xmbIconClassName} alt="home icon" loading="eager" priority={true} />
);
export const display: ReactElement = (
  <Image src={displayIcon} className={xmbIconClassName} alt="display icon" loading="eager" priority={true} />
);
export const games: ReactElement = (
  <Image src={gamesIcon} className={xmbIconClassName} alt="games icon" loading="eager" priority={true} />
);
export const gow3: ReactElement = (
  <Image src={gow3Icon} className={xmbIconClassName} alt="gow3 icon" />
);
export const music: ReactElement = (
  <Image src={musicIcon} className={xmbIconClassName} alt="music icon" loading="eager" priority={true} />
);
export const photo: ReactElement = (
  <Image src={photoIcon} className={xmbIconClassName} alt="photo icon" />
);
export const prime: ReactElement = (
  <Image src={primeIcon} className={xmbIconClassName} alt="prime icon" />
);
export const resume: ReactElement = (
  <Image src={resumeIcon} className={xmbIconClassName} alt="resume icon" />
);
export const settings: ReactElement = (
  <Image src={settingsIcon} className={xmbIconClassName} alt="settings icon" loading="eager" priority={true} />
);
export const uncharted: ReactElement = (
  <Image src={unchartedIcon} className={xmbIconClassName} alt="uncharted icon" />
);
export const update: ReactElement = (
  <Image src={updateIcon} className={xmbIconClassName} alt="update icon" />
);
export const user: ReactElement = (
  <Image src={userIcon} className={xmbIconClassName} alt="user icon" loading="eager" priority={true} />
);
export const video: ReactElement = (
  <Image src={videoIcon} className={xmbIconClassName} alt="video icon" />
);
export const h3general: ReactElement = (
  <Image src={halo3generalBwIcon} className="h3-general" alt="h3 general icon" loading="eager" />
);
export const trueachievements: ReactElement = (
  <Image src={trueachievementsIcon} className={xmbIconClassName} alt="trueachievements icon" />
);
export const exophase: ReactElement = (
  <Image src={exophaseIcon} className={xmbIconClassName} alt="exophase icon" />
);
export const choco: ReactElement = (
  <Image src={chocoIcon} className={xmbIconClassName} alt="choco icon" />
);
export const nuget: ReactElement = (
  <Image src={nugetIcon} className={xmbIconClassName} alt="nuget icon" />
);
export const PspBattery: ReactElement = (
  <Image src={pspBatteryIcon} className="object-contain justify-self-center w-full h-full overflow-visible" alt="psp battery icon" />
);
// #1ed760
export const statsFm: ReactElement = (
  <svg className={`${xmbIconClassName} fill-white stroke-white`} color="white" fill="white" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M77.7698 151.964H31.8607C14.3745 151.964 0.199219 166.169 0.199219 183.691V477.17C0.199219 494.691 14.3745 508.896 31.8607 508.896H77.7698C95.256 508.896 109.431 494.691 109.431 477.17V183.691C109.431 166.169 95.256 151.964 77.7698 151.964Z" />
    <path d="M277.239 0.72998H231.33C213.843 0.72998 199.668 14.9348 199.668 32.4574V477.17C199.668 494.691 213.843 508.896 231.33 508.896H277.239C294.726 508.896 308.9 494.691 308.9 477.17V32.4574C308.9 14.9348 294.726 0.72998 277.239 0.72998Z" />
    <path d="M476.702 291.035H430.794C413.306 291.035 399.133 305.24 399.133 322.761V477.168C399.133 494.691 413.306 508.896 430.794 508.896H476.702C494.19 508.896 508.363 494.691 508.363 477.168V322.761C508.363 305.24 494.19 291.035 476.702 291.035Z" />
  </svg>
);
export const nextJs: ReactElement = (
  <svg className={`${xmbIconClassName} fill-white stroke-white`} color="white" fill="white" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <g>
      <path d="M119.616813,0.0688905149 C119.066276,0.118932037 117.314565,0.294077364 115.738025,0.419181169 C79.3775171,3.69690087 45.3192571,23.3131775 23.7481916,53.4631946 C11.7364614,70.2271045 4.05395894,89.2428829 1.15112414,109.384595 C0.12512219,116.415429 0,118.492153 0,128.025062 C0,137.557972 0.12512219,139.634696 1.15112414,146.665529 C8.10791789,194.730411 42.3163245,235.11392 88.7116325,250.076335 C97.0197458,252.753556 105.778299,254.580072 115.738025,255.680985 C119.616813,256.106338 136.383187,256.106338 140.261975,255.680985 C157.453763,253.779407 172.017986,249.525878 186.382014,242.194795 C188.584164,241.068861 189.00958,240.768612 188.709286,240.518404 C188.509091,240.36828 179.124927,227.782837 167.86393,212.570214 L147.393939,184.922273 L121.743891,146.965779 C107.630108,126.098464 96.0187683,109.034305 95.9186706,109.034305 C95.8185728,109.009284 95.7184751,125.873277 95.6684262,146.465363 C95.5933529,182.52028 95.5683284,183.971484 95.1178886,184.82219 C94.4672532,186.048207 93.9667644,186.548623 92.915738,187.099079 C92.114956,187.499411 91.4142717,187.574474 87.6355816,187.574474 L83.3063539,187.574474 L82.1552297,186.848872 C81.4044966,186.373477 80.8539589,185.747958 80.4785924,185.022356 L79.9530792,183.896422 L80.0031281,133.729796 L80.0782014,83.5381493 L80.8539589,82.5623397 C81.25435,82.0369037 82.1051808,81.3613431 82.7057674,81.0360732 C83.7317693,80.535658 84.1321603,80.4856165 88.4613881,80.4856165 C93.5663734,80.4856165 94.4172043,80.6857826 95.7434995,82.1369867 C96.1188661,82.5373189 110.007429,103.454675 126.623656,128.650581 C143.239883,153.846488 165.962072,188.250034 177.122972,205.139048 L197.392766,235.839522 L198.418768,235.163961 C207.502639,229.259062 217.112023,220.852086 224.719453,212.09482 C240.910264,193.504394 251.345455,170.835585 254.848876,146.665529 C255.874878,139.634696 256,137.557972 256,128.025062 C256,118.492153 255.874878,116.415429 254.848876,109.384595 C247.892082,61.3197135 213.683675,20.9362052 167.288368,5.97379012 C159.105376,3.32158945 150.396872,1.49507389 140.637341,0.394160408 C138.234995,0.143952798 121.693842,-0.131275573 119.616813,0.0688905149 L119.616813,0.0688905149 Z M172.017986,77.4831252 C173.219159,78.0836234 174.195112,79.2345784 174.545455,80.435575 C174.74565,81.0861148 174.795699,94.9976579 174.74565,126.348671 L174.670577,171.336 L166.73783,159.17591 L158.780059,147.01582 L158.780059,114.313685 C158.780059,93.1711423 158.880156,81.2862808 159.030303,80.7108033 C159.430694,79.3096407 160.306549,78.2087272 161.507722,77.5581875 C162.533724,77.0327515 162.909091,76.98271 166.837928,76.98271 C170.541544,76.98271 171.19218,77.0327515 172.017986,77.4831252 Z" />
    </g>
  </svg>
);
export const githubActions: ReactElement = (
  <svg width="800px" height="800px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" className={xmbIconClassName}>
    <path 
      d="M10.984 13.836a.5.5 0 0 1-.353-.146l-.745-.743a.5.5 0 1 1 .706-.708l.392.391 1.181-1.18a.5.5 0 0 1 .708.707l-1.535 1.533a.504.504 0 0 1-.354.146zm9.353-.147l1.534-1.532a.5.5 0 0 0-.707-.707l-1.181 1.18-.392-.391a.5.5 0 1 0-.706.708l.746.743a.497.497 0 0 0 .706-.001zM4.527 7.452l2.557-1.585A1 1 0 0 0 7.09 4.17L4.533 2.56A1 1 0 0 0 3 3.406v3.196a1.001 1.001 0 0 0 1.527.85zm2.03-2.436L4 6.602V3.406l2.557 1.61zM24 12.5c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3h-2.08a3.503 3.503 0 0 1-3.46 3 3.502 3.502 0 0 1-3.46-3h-.558c-.972 0-1.85-.399-2.482-1.042V17c0 1.654 1.346 3 3 3h.04c.244-1.693 1.7-3 3.46-3 1.93 0 3.5 1.57 3.5 3.5S13.43 24 11.5 24a3.502 3.502 0 0 1-3.46-3H8c-2.206 0-4-1.794-4-4V9.899A5.008 5.008 0 0 1 0 5c0-2.757 2.243-5 5-5s5 2.243 5 5a5.005 5.005 0 0 1-4.952 4.998A2.482 2.482 0 0 0 7.482 12h.558c.244-1.693 1.7-3 3.46-3a3.502 3.502 0 0 1 3.46 3h2.08a3.503 3.503 0 0 1 3.46-3c1.93 0 3.5 1.57 3.5 3.5zm-15 8c0 1.378 1.122 2.5 2.5 2.5s2.5-1.122 2.5-2.5-1.122-2.5-2.5-2.5S9 19.122 9 20.5zM5 9c2.206 0 4-1.794 4-4S7.206 1 5 1 1 2.794 1 5s1.794 4 4 4zm9 3.5c0-1.378-1.122-2.5-2.5-2.5S9 11.122 9 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm9 0c0-1.378-1.122-2.5-2.5-2.5S18 11.122 18 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm-13 8a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm12 0c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3.002c-.007.001-.013.005-.021.005l-.506.017h-.017a.5.5 0 0 1-.016-.999l.506-.017c.018-.002.035.006.052.007A3.503 3.503 0 0 1 20.5 17c1.93 0 3.5 1.57 3.5 3.5zm-1 0c0-1.378-1.122-2.5-2.5-2.5S18 19.122 18 20.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5z" />
  </svg>
);
