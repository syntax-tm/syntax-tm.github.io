import { AchievementId } from "./achievement-id";

type StripLeadingUnderscore<S extends string> = S extends `_${infer Tail}` ? StripLeadingUnderscore<Tail> : S;
type UnderscoreToDash<S extends string> = S extends `${infer Head}_${infer Tail}` ? `${Head}-${UnderscoreToDash<Tail>}` : S;
type TransformKey<S extends string> = Lowercase<UnderscoreToDash<StripLeadingUnderscore<S>>>;

type MapIdToClass<T extends string> = T extends string ? `secret-${TransformKey<T>}` : never;
export type SecretClass = MapIdToClass<AchievementId>;

export const ACHIEVEMENT_MAPPING: Record<AchievementId, SecretClass> = {
  _404: "secret-404",
  ANDROID: "secret-android",
  IWHBYD: "secret-iwhbyd",
  KONAMI_CODE: "secret-konami-code",
  MISSING_NO: "secret-missing-no",
  OCEANGATE: "secret-oceangate",
  // BW_FILTER: "secret-bw-filter",
  // SEPIA_FILTER: "secret-sepia-filter",
  // HUE_ROTATE_FILTER: "secret-hue-rotate-filter",
  // INVERT_FILTER: "secret-invert-filter",
  // SATURATE_FILTER: "secret-saturate-filter",
  DREAMCAST: "secret-dreamcast",
  PSP_CODE: "secret-psp-code",
  CURRENT: "secret-current",
  UNKNOWN: "secret-unknown",
} as const;

export function getSecretClass(id: AchievementId): SecretClass {
  return ACHIEVEMENT_MAPPING[id];
}
