import { AchievementId } from "@enums";

export interface IDebugOptions {
  showBackground: boolean,
  highlightXmbItems: boolean,
  showDebugView: boolean,
  showLogView: boolean,
  showSecrets: boolean,
  showToolTips: boolean,
  setTheme: (id: AchievementId) => void,
  lockSecrets: () => void,
  unlockSecrets: () => void,
  enableSecret: (id: AchievementId) => void,
  disableSecret: (id: AchievementId) => void,
  toggleSecret: (id: AchievementId) => void,
  disableGamepad: boolean,
  disableKeyboard: boolean,
  disableSwipe: boolean,
  showBoot: (componentId: string) => void,
}