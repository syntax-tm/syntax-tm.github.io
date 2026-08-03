import androidShaderSource from "./shaders/android";
import dreamcastShaderSource from "./shaders/dreamcast";
import iwhbydShaderSource from "./shaders/iwhbyd";
import konamiCodeShaderSource from "./shaders/konami_code";
import missingNoShaderSource from "./shaders/missing_no";
import oceangateShaderSource from "./shaders/oceangate";
import re5ShaderSource from "./shaders/re5";
import silentHillShaderSource from "./shaders/silent_hill";
import defaultVertextSource from "./shaders/default";

export type ShaderKind = "android" | "iwhbyd" | "konami_code" | "missing_no" | "oceangate" | "re5" | "silent_hill" | "dreamcast" | "dreamcast_bg" | "default" | "unknown";

export const shaderSources: Record<ShaderKind, string | null> = {
  "android": androidShaderSource,
  "dreamcast": dreamcastShaderSource,
  "dreamcast_bg": null,
  "iwhbyd": iwhbydShaderSource,
  "konami_code": konamiCodeShaderSource,
  "missing_no": missingNoShaderSource,
  "oceangate": oceangateShaderSource,
  "re5": re5ShaderSource,
  "silent_hill": silentHillShaderSource,
  "default": defaultVertextSource,
  "unknown": null,
};

export default function getShaderSource(shaderName: ShaderKind): string | null {
  return shaderSources[shaderName];
}
