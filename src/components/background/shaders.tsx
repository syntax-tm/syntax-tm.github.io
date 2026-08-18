import { AchievementId } from '@enums';
import * as shaders from './shaders/';

export const DEFAULT_SHADER_SORUCE = shaders.defaultShaderSource;

export const shaderSources = new Map<AchievementId, string>([
  ["ANDROID", shaders.androidShaderSource],
  ["BRIX", shaders.brixShaderSource],
  ["IWHBYD", shaders.iwhbydShaderSource],
  ["KONAMI_CODE", shaders.re5ShaderSource],
  ["MISSING_NO", shaders.missingNoShaderSource],
  ["OCEANGATE", shaders.oceangateShaderSource],
  ["_404", shaders.silentHillShaderSource],
]);

export default function getShaderSource(id: AchievementId): string | null {
  return shaderSources.get(id) ?? null;
}
