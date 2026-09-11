import { StatDefinition } from "types/secrets";
import * as s from './secrets/';
import { AchievementId } from "@enums";
import 'types/extensions/strings.extensions';

export const secretMap: Record<AchievementId, StatDefinition> = {
  _404: s.secret404,
  ANDROID: s.secretAndroid,
  BRIX: s.secretBrix,
  DREAMCAST: s.secretDreamcast,
  IWHBYD: s.secretIwhbyd,
  KONAMI_CODE: s.secretKonamiCode,
  MISSING_NO: s.secretMissingNo,
  OCEANGATE: s.secretOceangate,
  PSP: s.secretPsp,
  PS2: s.secretPs2,
  UNKNOWN: s.secretUnknown,
  DEBUG: s.secretDebug,
  WII: s.secretWii,
} as const;

export const stats: StatDefinition[] = Object.values(secretMap);

export const getStat = (id: AchievementId) => {
  return secretMap[id];
};

export { stats as default };
