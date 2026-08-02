import androidShaderSource from "./shaders/android.glsl";
import iwhbydShaderSource from "./shaders/iwhbyd.glsl";
import konamiCodeShaderSource from "./shaders/konami_code.glsl";
import missingNoShaderSource from "./shaders/missing_no.glsl";
import oceangateShaderSource from "./shaders/oceangate.glsl";
import re5ShaderSource from "./shaders/re5.glsl";
import silentHillShaderSource from "./shaders/silent_hill.glsl";
import defaultVertextSource from "./shaders/default.vert";

export type ShaderKind = "android" | "iwhbyd" | "konami_code" | "missing_no" | "oceangate" | "re5" | "silent_hill" | "default";

export const shaderSources: Record<ShaderKind, string> = {
  "android": androidShaderSource,
  "iwhbyd": iwhbydShaderSource,
  "konami_code": konamiCodeShaderSource,
  "missing_no": missingNoShaderSource,
  "oceangate": oceangateShaderSource,
  "re5": re5ShaderSource,
  "silent_hill": silentHillShaderSource,
  "default": defaultVertextSource,
};

export default function getShaderSource(shaderName: ShaderKind): string | undefined {
  return shaderSources[shaderName];
}
