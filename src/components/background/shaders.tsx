import { AchievementId } from '@enums';
import * as shaders from './shaders/';

export type ShaderKind = "android" | "iwhbyd" | "konami_code" | "missing_no" | "oceangate" | "re5" | "silent_hill" | "dreamcast" | "dreamcast_bg" | "default" | "unknown";

export const DEFAULT_SHADER_SORUCE = shaders.defaultShaderSource;

export const shaderSources = new Map<AchievementId, string>([
  ["ANDROID", shaders.androidShaderSource],
  ["IWHBYD", shaders.iwhbydShaderSource],
  ["KONAMI_CODE", shaders.konamiCodeShaderSource],
  ["MISSING_NO", shaders.missingNoShaderSource],
  ["OCEANGATE", shaders.oceangateShaderSource],
  ["_404", shaders.silentHillShaderSource],
]);

export default function getShaderSource(id: AchievementId): string | null {
  return shaderSources.get(id) ?? null;
}
