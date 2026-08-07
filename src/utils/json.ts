import { Setting, StatDefinition } from "types";

export function tryParseJSONObject<T>(jsonString: string | undefined) {
  if (!jsonString) return false;
  try {
    const o = JSON.parse(jsonString) as T;

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === "object") {
      return o;
    }
  }
  catch {
    return false;
  }
};

// function customReviver(key: string, value: unknown) {
//   // Check if the value is an object and contains our custom metadata tag
//   if (value && typeof value === "object" && "__dataType" in value) {
//     switch (value.__dataType) {
//       case "Map":
//         return new Map(value);
//       case "Set":
//         return new Set(value);
//       case "BigInt":
//         return BigInt(value);
//       case "Date":
//         return new Date(value);
//     }
//   }
//   return value;
// }

// id: AchievementId;
// stat: StatDefinition;
// isUnlocked: boolean;
// isEnabled: boolean;
// type: SecretGroupType;

// stat
// id: AchievementId;
// title: string;
// description?: string;
// type: SecretGroupType;
// isLocked?: boolean;
// isEnabled?: boolean;

export function customReplacer(key: string, value: unknown) {
  if (value instanceof Map) {
    return { __dataType: "Map", value: Array.from(value.entries()) };
  }
  if (value instanceof Set) {
    return { __dataType: "Set", value: Array.from(value) };
  }
  if (typeof value === "bigint") {
    return { __dataType: "BigInt", value: value.toString() };
  }
  return value;
}

// export function serializeCustomJson(data: unknown): string {
//   return JSON.stringify(data, customReplacer);
// }

// export function deserializeCustomJson<T>(jsonString: string): T {
//   return JSON.parse(jsonString, customReviver) as T;
// }
