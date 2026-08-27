// TODO: clean this up and remove unused icons
// TODO: add findIconDefinition to load fa icons by name once config is moved to json
// https://docs.fontawesome.com/web/use-with/react/use-with#typescript

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faCog,
  faTrophy,
  faAward,
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
  faQuestion,
  faQuestionCircle,
  faEgg,
  faToolbox,
  faHouse,
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
import React from "react";
import Image from "next/image";
import displayIcon from "public/image/xmb/display.png";
import musicIcon from "public/image/xmb/music.png";
import photoIcon from "public/image/xmb/photo.png";
import primeIcon from "public/image/xmb/prime.png";
import resumeIcon from "public/image/xmb/resume.png";
import updateIcon from "public/image/xmb/update.png";
import userIcon from "public/image/xmb/social.png";
import videoIcon from "public/image/xmb/video.png";
import chocoIcon from "public/image/xmb/choco.png";
import halo3generalBwIcon from "public/image/halo_3_general_bw.png";
import pspBatteryIcon from "public/image/psp_full_battery.png";

const xmbIconClassName = "xmb-icon";

export interface IconProps {
  className: string;
  width?: number;
  height?: number;
  fill?: boolean;
  stroke?: string;
  strokeWidth?: number;
  objectFit?: string;
}

export const egg = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faEgg} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const info = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faInfoCircle} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const infoCircle = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faInfoCircle} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const question = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faQuestion} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const questionCircle = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faQuestionCircle} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const share = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faShare} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const fontAwesome = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faFontAwesome} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const codeFork = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faCodeFork} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const boxes = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faBoxesPacking} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const chart = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faChartLine} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const star = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faStar} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const code = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faCode} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const cog = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faCog} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const trophy = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faTrophy} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const award = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faAward} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const message = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faMessage} className={`${xmbIconClassName} ${props?.className} overflow-auto`} />;
};
export const c = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faC} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const medal = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faMedal} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const computer = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faComputer} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const computerMouse = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faComputerMouse} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const keyboard = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faKeyboard} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const headset = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faHeadset} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const laptop = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faLaptop} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const desktop = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faDesktop} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const disease = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faDisease} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const copy = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faCopy} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const github = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faGithub} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const githubAlt = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faGithubAlt} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const gitlab = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faGitlab} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const stackOverflow = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faStackOverflow} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const youtube = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faYoutube} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const spotify = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faSpotify} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const facebook = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faFacebook} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const discord = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faDiscord} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const xbox = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faXbox} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const playstation = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faPlaystation} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const steam = (props?: IconProps) => {
  // return (
  //   <svg xmlns="http://www.w3.org/2000/svg"
  //     width={120} height={120}
  //     viewBox="0 0 24 24"
  //     className={`${xmbIconClassName} ${props?.className}`}>
  //     <g>
  //       <path fill="none" d="M0 0H24V24H0z"/>
  //       <path d="M12.004 2c-5.25 0-9.556 4.05-9.964 9.197l5.36 2.216c.454-.31 1.002-.492 1.593-.492.053 0 .104.003.157.005l2.384-3.452v-.049c0-2.08 1.69-3.77 3.77-3.77 2.079 0 3.77 1.692 3.77 3.772s-1.692 3.771-3.77 3.771h-.087l-3.397 2.426c0 .043.003.088.003.133 0 1.562-1.262 2.83-2.825 2.83-1.362 0-2.513-.978-2.775-2.273l-3.838-1.589C3.573 18.922 7.427 22 12.005 22c5.522 0 9.998-4.477 9.998-10 0-5.522-4.477-10-9.999-10zM7.078 16.667c.218.452.595.832 1.094 1.041 1.081.45 2.328-.063 2.777-1.145.22-.525.22-1.1.004-1.625-.215-.525-.625-.934-1.147-1.152-.52-.217-1.075-.208-1.565-.025l1.269.525c.797.333 1.174 1.25.84 2.046-.33.797-1.247 1.175-2.044.843l-1.228-.508zm10.74-7.245c0-1.385-1.128-2.512-2.513-2.512-1.387 0-2.512 1.127-2.512 2.512 0 1.388 1.125 2.513 2.512 2.513 1.386 0 2.512-1.125 2.512-2.513zM15.31 7.53c1.04 0 1.888.845 1.888 1.888s-.847 1.888-1.888 1.888c-1.044 0-1.888-.845-1.888-1.888s.845-1.888 1.888-1.888z"/>
  //     </g>
  //   </svg>
  // );
  return (
    <svg viewBox="0 0 32 32" width={120} height={120} xmlns="http://www.w3.org/2000/svg" className={`${xmbIconClassName} ${props?.className}`}
      style={{ fill: 'currentColor' }}>
      <g>
        <path d="M 22 6 C 18.745659 6 16.09469 8.6041857 16.007812 11.837891 L 12.337891 17.083984 C 12.065931 17.032464 11.786701 17 11.5 17 C 10.551677 17 9.673638 17.297769 8.9472656 17.800781 L 4 15.84375 L 4 21.220703 L 7.1054688 22.449219 C 7.5429388 24.475474 9.3449541 26 11.5 26 C 13.703628 26 15.534282 24.405137 15.917969 22.310547 L 21.691406 17.984375 C 21.794183 17.989633 21.895937 18 22 18 C 25.309 18 28 15.309 28 12 C 28 8.691 25.309 6 22 6 z M 22 8 C 24.206 8 26 9.794 26 12 C 26 14.206 24.206 16 22 16 C 19.794 16 18 14.206 18 12 C 18 9.794 19.794 8 22 8 z M 22 9 A 3 3 0 0 0 22 15 A 3 3 0 0 0 22 9 z M 11.5 18 C 13.43 18 15 19.57 15 21.5 C 15 23.43 13.43 25 11.5 25 C 10.078718 25 8.8581368 24.145398 8.3105469 22.925781 L 10.580078 23.824219 C 10.882078 23.944219 11.192047 24.001953 11.498047 24.001953 C 12.494047 24.001953 13.436219 23.403875 13.824219 22.421875 C 14.333219 21.137875 13.703922 19.683781 12.419922 19.175781 L 10.142578 18.273438 C 10.560118 18.097145 11.019013 18 11.5 18 z">
        </path>
      </g>
    </svg>
  );
};
export const amazon = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faAmazon} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const battleNet = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faBattleNet} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const docker = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faDocker} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const git = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faGit} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const xTwitter = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faXTwitter} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const snapchat = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faSnapchat} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const instagram = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faInstagram} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const twitch = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faTwitch} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const threads = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faThreads} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const telegram = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faTelegram} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const home = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faHouse} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const display = (props?: IconProps) => {
  return <Image src={displayIcon} className={`${xmbIconClassName} ${props?.className}`}
    alt="display icon" loading="eager" priority={true}
  />;
};
export const controller = (props?: IconProps) => {
  return (
    <svg
      width={120}
      height={120}
      viewBox="0 0 119.32708 80.16875"
      version="1.1"
      id="controller-icon"
      xmlSpace="preserve"
      className={`${xmbIconClassName} ${props?.className}`}
      xmlns="http://www.w3.org/2000/svg">
      <g
        id="groupController"
        transform="translate(-75.538544,-110.19896)">
        <path
          id="controller"
          d="m 155.76914,111.1735 c -0.56247,0.20564 -1.21491,0.50125 -1.95734,0.88685 l -2.84701,1.38906 h -15.44593 l -15.67036,0.0568 -2.64222,-1.30483 c -3.78169,-1.86759 -7.03676,-1.92743 -12.42508,-0.22841 -3.87654,1.22232 -10.45724,4.59639 -10.45724,5.36143 0,0.34314 -0.991046,2.44558 -1.438671,3.05201 -0.279243,0.3783 0.23958,0.10785 2.370914,-0.94361 4.669188,-2.30346 9.950907,-3.97443 14.666807,-3.97443 0,0 1.93756,0.24737 2.78071,0.63252 1.47961,0.67588 3.06683,1.89604 3.06683,1.89604 l 8.75834,8.89417 h 10.98997 10.87841 l 3.12745,-3.38343 c 3.07845,-3.08147 4.0566,-4.05453 6.24442,-5.85834 0,0 1.94765,-1.1101 3.07233,-1.54844 0.91292,-0.35581 2.87062,-0.63252 2.87062,-0.63252 4.68069,-0.18007 8.7602,1.6461 13.48497,3.98477 2.04002,1.0098 2.85808,1.31053 2.64583,0.97306 -0.16899,-0.26869 -0.72418,-1.28072 -1.23351,-2.24896 l -0.92605,-1.76061 -3.30729,-1.65261 c -5.0796,-2.63305 -9.77234,-3.99325 -14.07976,-4.03593 -0.84234,-0.008 -1.68476,0.14698 -2.52714,0.44541 z m -46.82437,5.71756 c -1.4239,0.0493 -3.13943,0.47811 -5.62498,1.10587 -3.2572,0.82265 -12.363984,4.59442 -13.446721,5.56917 -0.600118,0.54027 -6.667997,16.97457 -9.158614,24.80572 -7.632959,24.00003 -6.319898,36.43045 4.327902,40.97425 v -5.2e-4 c 3.301502,1.40887 3.726804,1.18487 10.823628,-5.70094 10.443375,-10.13285 12.439045,-11.82425 15.377875,-13.03332 l 1.46864,-0.6041 22.37538,-0.006 c 28.23681,-0.008 24.12041,-1.23305 36.89129,10.97918 10.75321,10.28283 10.33384,10.05438 14.5557,7.93078 10.55882,-5.31112 10.97627,-18.57417 1.45779,-46.30053 -2.51497,-7.32587 -5.39576,-15.11278 -6.50916,-17.59376 l -0.67748,-1.50895 -3.09025,-1.48725 c -15.20953,-7.31789 -17.71022,-7.03762 -27.3234,3.06131 l -3.46284,3.63802 h -11.54709 -11.5471 l -4.63538,-4.71444 c -5.40176,-5.49382 -7.12261,-7.22281 -10.25519,-7.11429 z m 56.6844,6.18567 c 0.0233,-1e-5 0.0465,1.6e-4 0.0698,5.1e-4 1.34176,0.0168 2.40776,0.56141 3.11661,1.36891 0.77353,0.81582 1.20467,1.89728 1.20457,3.02152 5e-5,2.42507 -1.96587,4.39099 -4.39094,4.39095 -2.42507,5e-5 -4.391,-1.96588 -4.39095,-4.39095 0.005,-2.0827 1.47184,-3.87559 3.51245,-4.29224 0.073,-0.0162 0.14634,-0.0323 0.22169,-0.0444 0.0563,-0.009 0.11286,-0.0159 0.1695,-0.0222 0.1583,-0.0187 0.31962,-0.0318 0.48731,-0.032 z m -60.89913,2.81016 c 0.0164,9.9e-4 0.0327,0.002 0.0491,0.003 1.14998,-0.0243 2.35363,0.17276 3.57911,0.65836 3.47786,1.37812 5.24562,4.77845 5.23533,8.20002 v 0.002 c 0,8.6e-4 1e-5,0.002 0,0.003 -0.0106,3.05805 -1.43781,6.13198 -4.39404,7.79332 -0.76957,0.43248 -1.63901,0.71548 -2.55282,0.85783 -0.62936,0.13942 -1.27206,0.20977 -1.91668,0.2098 -3.44613,-1.2e-4 -6.579806,-1.99767 -8.034648,-5.12165 -0.445602,-0.9132 -0.697395,-1.85975 -0.779281,-2.80499 -0.03307,-0.31121 -0.04962,-0.62394 -0.04961,-0.9369 5e-6,-4.83074 3.868282,-8.77186 8.698179,-8.86199 0.0551,-10e-4 0.11024,-0.002 0.16536,-0.002 z m 52.62625,4.36408 c 2.42507,-4e-5 4.39098,1.96587 4.39094,4.39094 1e-5,0.0746 -0.002,0.14923 -0.006,0.22376 0.0272,1.41335 -0.79572,2.89832 -2.03553,3.59513 -0.55426,0.31151 -1.13255,0.47888 -1.70274,0.52348 -0.21418,0.0319 -0.43044,0.048 -0.64699,0.0481 -2.42487,5e-5 -4.39071,-1.96556 -4.39095,-4.39043 -4e-5,-2.42507 1.96588,-4.39099 4.39095,-4.39094 z m 16.53542,0 c 2.42507,-5e-5 4.39099,1.96587 4.39095,4.39094 -3.3e-4,2.16342 -1.57643,4.00422 -3.71399,4.33772 -0.60256,0.12688 -1.21131,0.0859 -1.78283,-0.0889 -1.93451,-0.50341 -3.28484,-2.24991 -3.28507,-4.24884 -4e-5,-2.42507 1.96587,-4.39098 4.39094,-4.39094 z m -8.26254,7.34993 c 2.42507,-4e-5 4.39099,1.96588 4.39094,4.39095 -6e-5,0.46065 -0.0726,0.91842 -0.21497,1.35651 -0.10388,1.06483 -0.63293,2.10981 -1.66243,2.87114 -1.01787,0.75272 -2.83639,0.87026 -4.12636,0.26717 -0.8873,-0.41483 -1.49082,-1.05266 -1.84382,-1.78697 -0.60538,-0.77279 -0.93433,-1.72617 -0.93431,-2.70785 -5e-5,-2.42507 1.96588,-4.391 4.39095,-4.39095 z m -16.10445,6.30091 c 4.66989,-0.32825 9.68144,2.7982 9.70691,9.02736 0.0151,3.69879 -2.4173,7.22028 -5.65031,8.18038 -0.12073,0.0358 -0.24096,0.0691 -0.36121,0.10025 -0.9574,0.34226 -1.96655,0.51724 -2.98328,0.51728 -4.8952,0 -8.86355,-3.96834 -8.86355,-8.86354 -2e-5,-1.60776 0.43727,-3.18525 1.26504,-4.56355 1.40549,-2.76034 4.08447,-4.20123 6.8864,-4.39818 z m -27.02735,1.39343 v 5.82083 h 5.82084 l -1e-5,5.82083 h -5.82083 v 5.82084 h -5.82083 v -5.82084 h -5.82081 v -5.82083 h 5.82083 v -5.82083 z"
          className="controller" />
      </g>
    </svg>
  );
};
export const music = (props?: IconProps) => {
  return <Image src={musicIcon} className={`${xmbIconClassName} ${props?.className}`}
    alt="music icon" loading="eager" priority={true} />;
};
export const photo = (props?: IconProps) => {
  return <Image src={photoIcon} className={`${xmbIconClassName} ${props?.className}`} alt="photo icon" />;
};
export const prime = (props?: IconProps) => {
  return <Image src={primeIcon} className={`${xmbIconClassName} ${props?.className}`} alt="prime icon" />;
};
export const resume = (props?: IconProps) => {
  return <Image src={resumeIcon} className={`${xmbIconClassName} ${props?.className}`}
    alt="resume icon" />;
};
export const settings = (props?: IconProps) => {
  return <FontAwesomeIcon icon={faToolbox} className={`${xmbIconClassName} ${props?.className}`} />;
};
export const update = (props?: IconProps) => {
  return <Image src={updateIcon} className={`${xmbIconClassName} ${props?.className}`}
    alt="update icon" />;
};
export const user = (props?: IconProps) => {
  return <Image src={userIcon} className={`${xmbIconClassName} ${props?.className}`}
    alt="user icon" loading="eager" priority={true} />;
};
export const video = (props?: IconProps) => {
  return <Image src={videoIcon} className={`${xmbIconClassName} ${props?.className}`} alt="video icon" />;
};
export const h3general = (props?: IconProps) => {
  return <Image src={halo3generalBwIcon} className={`h3-general ${props?.className}`}
    alt="h3 general icon" loading="eager" />;
};
export const trueachievements = (props?: IconProps) => {
  return (
    <svg
      width={120}
      height={120}
      viewBox="0 0 661.45832 661.45833"
      version="1.1"
      id="trueachievements"
      xmlSpace="preserve"
      style={{ fill: 'currentColor' }}
      className={`${xmbIconClassName} ${props?.className}`}
      xmlns="http://www.w3.org/2000/svg">
      <g id="groupTa" transform="translate(75.93541,315.38333)">
        <path
          id="ta"
          d="M 93.275965 -139.4318 C 86.995875 -139.4228 81.472387 -135.3249 79.56414 -129.25981 C 78.984477 -127.41743 78.97813 -127.20879 78.97813 -110.46354 C 78.97813 -92.353004 79.038529 -91.318759 80.447291 -85.270764 C 84.429508 -68.17459 95.819941 -53.427175 110.99271 -45.722791 C 117.51632 -42.410252 124.87013 -40.326822 132.23586 -39.704553 C 133.64907 -39.585162 145.34225 -39.503707 158.22084 -39.523169 L 181.63646 -39.558309 L 183.37537 -40.147937 C 185.6127 -40.90687 187.89597 -42.402641 189.61479 -44.234509 C 194.80385 -49.764863 194.66667 -58.809571 189.31248 -64.164559 C 187.49599 -65.981318 186.05088 -66.897078 183.6105 -67.777775 L 181.90105 -68.394791 L 156.76563 -68.533801 L 131.63021 -68.672811 L 129.07688 -69.371476 C 119.15253 -72.088649 111.50392 -79.833705 108.72153 -89.983654 C 108.1209 -92.174718 108.11002 -92.470574 107.96189 -110.19896 L 107.81151 -128.19062 L 107.1423 -129.91455 C 105.7848 -133.41197 103.42326 -136.14947 100.35202 -137.78642 C 98.169858 -138.9495 96.078036 -139.43595 93.275965 -139.4318 z M 350.5693 -70.114583 C 295.73679 -70.114583 298.45542 -70.178357 295.42383 -68.820088 C 292.51744 -67.517918 289.48404 -64.33952 288.19998 -61.251042 C 286.35769 -56.819903 286.91411 -51.355355 289.6061 -47.446716 C 291.48177 -44.723329 294.09421 -42.838379 297.65625 -41.637769 C 299.04704 -41.168991 301.33669 -41.14122 349.38229 -41.009383 C 405.06197 -40.856599 399.92412 -41.027364 404.74791 -39.167118 C 412.24052 -36.277662 418.87091 -29.184671 421.33242 -21.425049 C 422.36322 -18.175593 422.61301 -15.613766 422.47344 -9.723438 C 422.36352 -5.0843821 422.25637 -4.0241377 421.67349 -1.8205613 C 419.29498 7.1713832 412.86188 14.051876 404.011 17.070275 C 399.69822 18.541055 400.21768 18.520832 366.32699 18.520832 C 346.1673 18.520832 334.02739 18.621128 332.16422 18.802986 C 307.83461 21.177714 287.34705 39.251656 281.94817 63.103124 C 281.7176 64.12177 281.39598 65.61005 281.23348 66.410415 C 280.79299 68.579893 280.60008 84.721714 280.97768 87.818411 C 282.30199 98.679356 286.87714 109.06201 294.17533 117.76852 C 301.80448 126.86986 313.06941 133.8009 324.64375 136.51466 C 330.18081 137.81289 329.88043 137.80433 367.63854 137.74921 L 403.09271 137.69754 L 406.36021 136.97148 C 423.9518 133.06425 438.11498 122.05832 445.83118 106.29894 C 447.92196 102.02879 449.58202 97.217252 450.45002 92.91164 C 451.08921 89.741049 451.64375 85.028447 451.64375 82.76859 C 451.64375 81.526129 451.66525 81.491665 452.4375 81.491665 C 453.14011 81.491665 453.23125 81.40192 453.23125 80.710834 C 453.23125 79.249128 452.65288 77.130046 451.71093 75.141665 C 450.60844 72.814396 447.8438 69.886012 445.64412 68.715184 C 443.92967 67.802633 440.60594 66.938192 438.83523 66.944233 C 432.59847 66.965503 427.0316 70.939695 424.98078 76.834585 C 424.43889 78.392207 424.28974 79.483012 424.11055 83.211457 C 423.79732 89.728815 422.55874 93.894561 419.57129 98.477708 C 415.87611 104.14661 410.6535 108.00668 404.30039 109.76384 L 401.76979 110.46354 L 368.56458 110.46354 L 335.35938 110.46354 L 332.80088 109.75661 C 327.37043 108.25601 322.96341 105.74507 319.19602 102.00514 C 314.40348 97.247541 311.99951 91.957525 311.37686 84.798957 C 311.02337 80.734837 311.29096 73.831009 311.92101 70.755886 C 313.99502 60.632799 321.45086 52.944325 331.98801 50.06361 L 334.56563 49.35926 L 368.82917 49.198029 C 402.25824 49.040842 403.16359 49.023119 406.00313 48.47766 C 418.33936 46.107938 429.02143 40.337615 437.43118 31.500402 C 445.30986 23.221262 450.3586 13.285561 452.47574 1.8934238 C 453.15612 -1.7676274 453.45436 -13.918238 452.98785 -18.97662 C 451.68948 -33.054954 445.79516 -45.513004 435.97959 -54.924813 C 427.49862 -63.05692 416.05638 -68.355038 403.76089 -69.843282 C 402.3007 -70.020022 383.75202 -70.114583 350.5693 -70.114583 z M 93.553984 -31.480766 C 89.815465 -31.468016 86.011307 -29.896837 83.315849 -27.252084 C 81.580243 -25.549126 80.630554 -24.020998 79.538302 -21.172868 L 78.97813 -19.711459 L 78.897514 32.411457 C 78.842554 67.969038 78.908107 85.75365 79.103187 88.370832 C 79.260468 90.480884 79.689318 93.69557 80.056617 95.514581 C 85.023087 120.11056 106.51072 139.16416 131.36563 141.01206 C 132.82083 141.12025 147.52505 141.22242 164.04167 141.23892 C 188.4107 141.26322 194.45533 141.20084 196.10535 140.90664 C 199.07759 140.3766 201.38563 139.15325 203.60515 136.93169 C 206.66145 133.87257 207.75239 131.17622 208.11702 125.78043 C 208.32824 122.65491 208.02651 121.00112 206.82924 118.7204 C 205.86246 116.8787 203.49271 114.60901 201.55876 113.67213 C 198.36311 112.12401 199.78725 112.18333 165.76508 112.18333 C 145.55439 112.18333 133.74565 112.08541 132.31389 111.90583 C 120.39622 110.41148 109.90036 99.999298 108.23733 88.020982 C 108.03865 86.589968 107.94857 69.812022 107.94587 33.649108 C 107.94187 -24.30325 108.06409 -20.287522 106.19249 -23.849191 C 105.07604 -25.973795 102.30788 -28.736372 100.25125 -29.778544 C 98.506744 -30.662551 95.26481 -31.486602 93.553984 -31.480766 z "/>
      </g>
      <g id="ringGroup" transform="translate(75.93541,315.38333)">
        <path
          id="ring"
          style={{
            strokeLinejoin: 'round',
            strokeLinecap: 'round',
          }}
          d="M 216.07157 -313.10853 A 330.72916 330.72916 0 0 0 -73.660613 -23.376351 L -23.536542 -23.376351 A 281.01096 281.01096 0 0 1 216.07157 -262.98446 L 216.07157 -313.10853 z M 293.51594 -313.10853 L 293.51594 -262.98446 A 281.01096 281.01096 0 0 1 533.12405 -23.376351 L 583.24812 -23.376351 A 330.72916 330.72916 0 0 0 293.51594 -313.10853 z M -73.660613 54.068016 A 330.72916 330.72916 0 0 0 216.07157 343.8002 L 216.07157 293.67613 A 281.01096 281.01096 0 0 1 -23.536542 54.068016 L -73.660613 54.068016 z M 533.12405 54.068016 A 281.01096 281.01096 0 0 1 293.51594 293.67613 L 293.51594 343.8002 A 330.72916 330.72916 0 0 0 583.24812 54.068016 L 533.12405 54.068016 z "/>
      </g>
    </svg>
  );
};
export const exophase = (props?: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width={120}
      height={120}
      viewBox="0 0 158.75 158.75"
      fill="currentColor"
      className={`${xmbIconClassName} ${props?.className}`}
    >
      <path
        d="M54.493 95.71c-3.808.017-4.96 0-5.823 1.757-.424.863-.537 1.223-.468 6.074.003 7.368 0 7.368 1.79 7.368h5.89l4.961.001v-2.646h-4.498c-4.145 0-5.23.064-5.23-.416v-1.917s.316-.22 4.565-2.17l4.892-2.243.003-1.456c-.003-2.595 0-3.296-1.849-3.827-.89-.256-1.371-.536-4.233-.524zm-.034 2.765c2.783 0 3.406 0 3.473.94 0 .275-.965.765-5.754 2.925l-1.39.626v-1.852c0-2.64.139-2.64 3.67-2.64zM98.149 95.697c-5.173-.133-6.562-.1-6.562 1.85v9.328l-.08 8.798H94.446V110.95l3.686-.086c4.387.046 6.328.046 6.328-1.3V97.547c0-1.85-2.027-1.85-6.31-1.85zm-.01 2.858c3.39-.023 3.39 0 3.39.9v3.782c0 4.373 0 4.37-.719 4.373l-5.48.018c-.517.002-.517-.753-.517-3.983v-3.808c0-1.305 0-1.313.9-1.305zM82.489 95.564H78.07c-1.832 0-1.828 2.33-1.832 7.616-.006 7.73 0 7.73 6.613 7.674 3.074.056 0 0 3.392 0 1.274 0 1.994-.127 2.457-1.081.613-1.264.289-3.49.32-6.633.067-6.505.046-7.576-2.328-7.576zm0 3.09c2.646.04 3.754 0 3.754 1.056 0 1.353.103 4.743.135 7.264.016 1.29 0 1.157-3.737 1.155-4.042 0-3.896 0-3.896-4.439v-3.395c0-1.64 0-1.695 3.744-1.64zM157.868 95.576s-1.676-.008-2.409 0c-2.98.031-3.57.467-4.376 1.708-.436.671-.383 1.453-.414 6.04-.035 4.929 0 5.83.255 6.581.531.804.072 1.005 7.17 1.005h5.142v-2.646h-4.447c-4.875 0-5.685.4-5.624-1.375v-.874l4.929-2.249 4.929-2.248V99.93c0-2.92-.083-3.062-.93-3.72-.788-.61-1.33-.614-3.304-.634zm-.988 3.031c3.478 0 3.465 0 3.478 1.323-1.002.649-7.176 3.307-7.176 3.307v-1.897c0-2.688-.02-2.733 3.698-2.733zM148.42 95.564l-4.167.015c-4.764.018-5.389-.006-6.638.99-.604.481-.572 1.462-.572 3.426 0 2.319.087 2.66 1.092 3.488.987.813 1.85.815 4.14.813 2.933-.002 3.13 0 3.13 1.77v1.42c0 .874-.775.778-4.4.778h-3.962v2.646h4.3c3.57 0 4.198-.042 5.075 0 2.002.097 2.002-2.392 2.002-4.568 0-2.21-.491-3.457-1.638-4.156-.723-.44-1.335-.534-3.501-.535-1.222-.044-2.087 0-2.632 0-.96 0-.982-.774-.96-1.709.018-.796.302-1.467 1.183-1.467h7.548V97.02ZM61.372 95.564l5.285 7.363-5.285 7.983h3.172l3.681-6.067 3.491 6.036h3.217L70 102.927l4.933-7.363h-3.217l-3.49 5.343-3.682-5.343zM122.226 95.524v2.951h5.093c3.115 0 4.192-.108 4.623.177.338.224.773 1.457-.155 1.457-1.134 0-1.1.01-3.145 0-4.693.076-6.641-.297-6.641 2.112v3.452c0 2.55.045 4.144 1.41 4.774 1.248.576 1.948.429 5.297.446 2.519.013 3.789.017 4.423.017 1.321 0 1.79-1.157 1.79-2.028 0-.613-.003-1.33 0-5.856.008-7.32 0-7.462-7.602-7.416zm6.422 7.449h2.77c.61 0 .61.644.61.922v3.66c0 .714-.87.665-3.1.714-1.43.032-2.134 0-3.133 0-.923 0-.96-1.18-.923-2.793.037-1.581-.151-2.503.655-2.503h3.12c2.34 0 0 0 0 0zM106.88 90.802v20.108h2.911V99.152c.344-.745.903-.8 3.373-.745 3.345.075 3.77 0 3.77 1.254v11.25h2.646V104.6c0-6.121 0-6.477-.713-7.548-.997-1.497-1.864-1.487-5.703-1.487h-3.373v-4.763z"
        style={{
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        transform="translate(-34.913 -23.862)"
      />
      <path
        d="M167.102 102.708h2.675v2.646h-2.675zM167.102 97.284h2.675v2.646h-2.675zM167.102 108.132h2.675v2.646h-2.675zM177.892 102.708h2.675v2.646h-2.675z"
        style={{
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        transform="translate(-34.913 -23.862)"
      />
      <path
        d="M142.978 73.422h2.675v2.646h-2.675z"
        style={{
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
      <path
        d="M177.892 108.132h2.675v2.646h-2.675z"
        style={{
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        transform="translate(-34.913 -23.862)"
      />
      <path
        d="M137.584 78.846h2.675v2.646h-2.675zM137.584 73.422h2.675v2.646h-2.675zM137.584 84.27h2.675v2.646h-2.675z"
        style={{
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
    </svg>
  );
};
export const choco = (props?: IconProps) => {
  return <Image src={chocoIcon} className={`${xmbIconClassName} ${props?.className}`} alt="choco icon" />;
};
export const PspBattery = (props?: IconProps) => {
  return (
    <Image
      src={pspBatteryIcon}
      className={`object-contain justify-self-center w-full h-full overflow-visible ${props?.className}`}
      alt="psp battery icon"
    />
  );
};
// #1ed760
export const statsFm = (props?: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="statsfm"
      width={80}
      height={80}
      viewBox="0 0 512 512"
      className={`${xmbIconClassName} ${props?.className}`}
    >
      <style id="style3">{".bar{fill:currentColor}"}</style>
      <path
        id="bar-3"
        d="M476.702 291.035h-45.908c-17.488 0-31.661 14.205-31.661 31.726v154.407c0 17.523 14.173 31.728 31.661 31.728h45.908c17.488 0 31.661-14.205 31.661-31.728V322.761c0-17.521-14.173-31.726-31.661-31.726Z"
        className="bar"
        style={{
          fill: "currentColor",
          fillOpacity: 1,
          strokeOpacity: 1,
          strokeDasharray: "none",
        }}
      />
      <path
        id="bar-2"
        d="M277.239.73H231.33c-17.487 0-31.662 14.205-31.662 31.727V477.17c0 17.521 14.175 31.726 31.662 31.726h45.909c17.487 0 31.661-14.205 31.661-31.726V32.457C308.9 14.935 294.726.73 277.239.73Z"
        className="bar"
        style={{
          fill: "currentColor",
          fillOpacity: 1,
          strokeOpacity: 1,
          strokeDasharray: "none",
        }}
      />
      <path
        id="bar-1"
        d="M77.77 151.964H31.86C14.375 151.964.2 166.169.2 183.691V477.17c0 17.521 14.175 31.726 31.66 31.726h45.91c17.486 0 31.661-14.205 31.661-31.726V183.691c0-17.522-14.175-31.727-31.661-31.727Z"
        className="bar"
        style={{
          fill: "currentColor",
          fillOpacity: 1,
          strokeOpacity: 1,
          strokeDasharray: "none",
        }}
      />
    </svg>
  );
};
export const nextJs = (props?: IconProps) => {
  return (
    <svg
      className={`${xmbIconClassName} ${props?.className}`}
      viewBox="0 0 256 256"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink">
      <g>
        <path d="M119.616813,0.0688905149 C119.066276,0.118932037 117.314565,0.294077364 115.738025,0.419181169 C79.3775171,3.69690087 45.3192571,23.3131775 23.7481916,53.4631946 C11.7364614,70.2271045 4.05395894,89.2428829 1.15112414,109.384595 C0.12512219,116.415429 0,118.492153 0,128.025062 C0,137.557972 0.12512219,139.634696 1.15112414,146.665529 C8.10791789,194.730411 42.3163245,235.11392 88.7116325,250.076335 C97.0197458,252.753556 105.778299,254.580072 115.738025,255.680985 C119.616813,256.106338 136.383187,256.106338 140.261975,255.680985 C157.453763,253.779407 172.017986,249.525878 186.382014,242.194795 C188.584164,241.068861 189.00958,240.768612 188.709286,240.518404 C188.509091,240.36828 179.124927,227.782837 167.86393,212.570214 L147.393939,184.922273 L121.743891,146.965779 C107.630108,126.098464 96.0187683,109.034305 95.9186706,109.034305 C95.8185728,109.009284 95.7184751,125.873277 95.6684262,146.465363 C95.5933529,182.52028 95.5683284,183.971484 95.1178886,184.82219 C94.4672532,186.048207 93.9667644,186.548623 92.915738,187.099079 C92.114956,187.499411 91.4142717,187.574474 87.6355816,187.574474 L83.3063539,187.574474 L82.1552297,186.848872 C81.4044966,186.373477 80.8539589,185.747958 80.4785924,185.022356 L79.9530792,183.896422 L80.0031281,133.729796 L80.0782014,83.5381493 L80.8539589,82.5623397 C81.25435,82.0369037 82.1051808,81.3613431 82.7057674,81.0360732 C83.7317693,80.535658 84.1321603,80.4856165 88.4613881,80.4856165 C93.5663734,80.4856165 94.4172043,80.6857826 95.7434995,82.1369867 C96.1188661,82.5373189 110.007429,103.454675 126.623656,128.650581 C143.239883,153.846488 165.962072,188.250034 177.122972,205.139048 L197.392766,235.839522 L198.418768,235.163961 C207.502639,229.259062 217.112023,220.852086 224.719453,212.09482 C240.910264,193.504394 251.345455,170.835585 254.848876,146.665529 C255.874878,139.634696 256,137.557972 256,128.025062 C256,118.492153 255.874878,116.415429 254.848876,109.384595 C247.892082,61.3197135 213.683675,20.9362052 167.288368,5.97379012 C159.105376,3.32158945 150.396872,1.49507389 140.637341,0.394160408 C138.234995,0.143952798 121.693842,-0.131275573 119.616813,0.0688905149 L119.616813,0.0688905149 Z M172.017986,77.4831252 C173.219159,78.0836234 174.195112,79.2345784 174.545455,80.435575 C174.74565,81.0861148 174.795699,94.9976579 174.74565,126.348671 L174.670577,171.336 L166.73783,159.17591 L158.780059,147.01582 L158.780059,114.313685 C158.780059,93.1711423 158.880156,81.2862808 159.030303,80.7108033 C159.430694,79.3096407 160.306549,78.2087272 161.507722,77.5581875 C162.533724,77.0327515 162.909091,76.98271 166.837928,76.98271 C170.541544,76.98271 171.19218,77.0327515 172.017986,77.4831252 Z" />
      </g>
    </svg>
  );
};
export const githubActions = (props?: IconProps) => {
  return (
    <svg
      className={`${xmbIconClassName} ${props?.className}`}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M10.984 13.836a.5.5 0 0 1-.353-.146l-.745-.743a.5.5 0 1 1 .706-.708l.392.391 1.181-1.18a.5.5 0 0 1 .708.707l-1.535 1.533a.504.504 0 0 1-.354.146zm9.353-.147l1.534-1.532a.5.5 0 0 0-.707-.707l-1.181 1.18-.392-.391a.5.5 0 1 0-.706.708l.746.743a.497.497 0 0 0 .706-.001zM4.527 7.452l2.557-1.585A1 1 0 0 0 7.09 4.17L4.533 2.56A1 1 0 0 0 3 3.406v3.196a1.001 1.001 0 0 0 1.527.85zm2.03-2.436L4 6.602V3.406l2.557 1.61zM24 12.5c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3h-2.08a3.503 3.503 0 0 1-3.46 3 3.502 3.502 0 0 1-3.46-3h-.558c-.972 0-1.85-.399-2.482-1.042V17c0 1.654 1.346 3 3 3h.04c.244-1.693 1.7-3 3.46-3 1.93 0 3.5 1.57 3.5 3.5S13.43 24 11.5 24a3.502 3.502 0 0 1-3.46-3H8c-2.206 0-4-1.794-4-4V9.899A5.008 5.008 0 0 1 0 5c0-2.757 2.243-5 5-5s5 2.243 5 5a5.005 5.005 0 0 1-4.952 4.998A2.482 2.482 0 0 0 7.482 12h.558c.244-1.693 1.7-3 3.46-3a3.502 3.502 0 0 1 3.46 3h2.08a3.503 3.503 0 0 1 3.46-3c1.93 0 3.5 1.57 3.5 3.5zm-15 8c0 1.378 1.122 2.5 2.5 2.5s2.5-1.122 2.5-2.5-1.122-2.5-2.5-2.5S9 19.122 9 20.5zM5 9c2.206 0 4-1.794 4-4S7.206 1 5 1 1 2.794 1 5s1.794 4 4 4zm9 3.5c0-1.378-1.122-2.5-2.5-2.5S9 11.122 9 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm9 0c0-1.378-1.122-2.5-2.5-2.5S18 11.122 18 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm-13 8a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm12 0c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3.002c-.007.001-.013.005-.021.005l-.506.017h-.017a.5.5 0 0 1-.016-.999l.506-.017c.018-.002.035.006.052.007A3.503 3.503 0 0 1 20.5 17c1.93 0 3.5 1.57 3.5 3.5zm-1 0c0-1.378-1.122-2.5-2.5-2.5S18 19.122 18 20.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5z" />
    </svg>
  );
};
