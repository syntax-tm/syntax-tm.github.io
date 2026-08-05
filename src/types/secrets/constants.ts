import { AchievementId, SecretGroupType } from "@enums";
import { StatDefinition } from "./stat-definition";
import { SecretGroup } from "./secret-group";
import { SecretGroupMap } from "./secret-group-map";

class Secrets {
  
  private static initialized = false;
  static items: Record<AchievementId, StatDefinition>;

  // private constructor prevents the use of 'new Secrets()'
  private Secrets() {

  }

  static {
    if (this.initialized) {
      console.log('bug');
    }
    else {


      this.initialized = true;
    }
  }

  static init() {
    if (Secrets.initialized) return;

    Secrets.initialized = true;
  }
}

export const secret404: StatDefinition = {
  id: AchievementId._404,
  title: '404',
  description: "There was a page here, but it's gone now.",
  type: SecretGroupType.bg,
};
export const secretAndroid: StatDefinition = {
  id: AchievementId.android,
  title: 'Android',
  description: "Tap tap tap.",
  type: SecretGroupType.bg,
};
export const secretDreamcast: StatDefinition = {
  id: AchievementId.dreamcast,
  title: 'Dreamcast',
  description: "Party like it's 9-9-99.",
  type: SecretGroupType.bg,
};
export const secretIwhbyd: StatDefinition = {
  id: AchievementId.iwhbyd,
  title: 'IWHBYD',
  description: '"I would have been your daddy, but the dog beat me over the fence!"',
  type: SecretGroupType.bg,
};
export const secretKonamiCode: StatDefinition = {
  id: AchievementId.konami_code,
  title: 'Konami Code',
  description: 'Entered the Konami Code.',
  type: SecretGroupType.bg,
};
export const secretMissingNo: StatDefinition = {
  id: AchievementId.missing_no,
  title: 'MissingNo.',
  description: "<Memory Corrupted>",
  type: SecretGroupType.bg,
};
export const secretOceangate: StatDefinition = {
  id: AchievementId.oceangate,
  title: 'Oceangate',
  description: "Submersible not included.",
  type: SecretGroupType.bg,
};
export const secretPspCode: StatDefinition = {
  id: AchievementId.psp_code,
  title: 'PSP Mode',
  description: 'Flash CFW.',
  type: SecretGroupType.theme,
};
export const secretBwFilter: StatDefinition = {
  id: AchievementId.bw_filter,
  title: 'Black & White',
  description: "",
  type: SecretGroupType.filter,
};
export const secretSepiaFilter: StatDefinition = {
  id: AchievementId.dreamcast,
  title: 'Sepia',
  description: "",
  type: SecretGroupType.filter,
};
export const secretHueRotateFilter: StatDefinition = {
  id: AchievementId.dreamcast,
  title: 'Hue Rotate',
  description: "",
  type: SecretGroupType.filter,
};
export const secretSaturateFilter: StatDefinition = {
  id: AchievementId.saturate_filter,
  title: 'Saturate',
  description: "",
  type: SecretGroupType.filter,
};
export const secretInvertFilter: StatDefinition = {
  id: AchievementId.dreamcast,
  title: 'Invert',
  description: "",
  type: SecretGroupType.filter,
};

export const secrets: Record<AchievementId, StatDefinition> =
{
  // bg
  [AchievementId._404]: secret404,
  [AchievementId.android]: secretAndroid,
  [AchievementId.iwhbyd]: secretIwhbyd,
  [AchievementId.konami_code]: secretKonamiCode,
  [AchievementId.missing_no]: secretMissingNo,
  [AchievementId.oceangate]: secretOceangate,
  // theme (font + icons + bg)
  [AchievementId.dreamcast]: secretDreamcast,
  [AchievementId.psp_code]: secretPspCode,
  // filters
  [AchievementId.bw_filter]: secretBwFilter,
  [AchievementId.hue_rotate_filter]: secretHueRotateFilter,
  [AchievementId.invert_filter]: secretInvertFilter,
  [AchievementId.saturate_filter]: secretSaturateFilter,
  [AchievementId.sepia_filter]: secretSepiaFilter,
};

export const allSecrets = Object.values(secrets);

export const bgSecrets = allSecrets.filter(s => s.type === SecretGroupType.bg);
export const secretGroupBackground = new SecretGroup(SecretGroupType.bg, 'Background', bgSecrets);
export const bootSecrets = allSecrets.filter(s => s.type === SecretGroupType.boot);
export const secretGroupBoot = new SecretGroup(SecretGroupType.boot, 'Boot', bootSecrets);
export const filterSecrets = allSecrets.filter(s => s.type === SecretGroupType.filter);
export const secretGroupFilter = new SecretGroup(SecretGroupType.filter, 'Filter', filterSecrets);
export const fontSecrets = allSecrets.filter(s => s.type === SecretGroupType.font);
export const secretGroupFont = new SecretGroup(SecretGroupType.font, 'Font', fontSecrets);
export const iconsSecrets = allSecrets.filter(s => s.type === SecretGroupType.icons);
export const secretGroupIcons = new SecretGroup(SecretGroupType.icons, 'Icons', iconsSecrets);
export const themeSecrets = allSecrets.filter(s => s.type === SecretGroupType.theme);
export const secretGroupTheme = new SecretGroup(SecretGroupType.theme, 'Theme', themeSecrets);

export const secretGroups: SecretGroupMap = new SecretGroupMap([
  [SecretGroupType.bg, secretGroupBackground],
  [SecretGroupType.boot, secretGroupBoot],
  [SecretGroupType.filter, secretGroupFilter],
  [SecretGroupType.font, secretGroupFont],
  [SecretGroupType.icons, secretGroupIcons],
  [SecretGroupType.theme, secretGroupTheme],
]);
