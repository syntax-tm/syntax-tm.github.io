"use client";

// import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createStore } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AchievementId } from "@enums";
import { Setting, defaultSettings } from "types";

const initSettings = new Map<AchievementId, Setting>();

defaultSettings.forEach(s => {
  initSettings.set(s.id, s);
});

export type SettingsState = {
  settings: Map<AchievementId, Setting>,
  currentSetting: Setting | undefined,
}

export type SettingsActions = {
  setEnabled: (id: AchievementId, value: boolean) => void,
  setUnlocked: (id: AchievementId, value: boolean) => void,
  toggle: (id: AchievementId) => void,
}

export type SettingsStore = SettingsState & SettingsActions;

export const defaultInitState: SettingsState = {
  settings: initSettings,
  currentSetting: undefined,
};

// export const createSettingsStore = (
//   initState: SettingsState = defaultInitState,
// ) => {
//   return createStore<SettingsStore>()((set) => ({
//     ...initState,
//     // toggle
//     toggle: (id: AchievementId) => {
//       set(
//         (state) => {
//           const next = new Map(state.settings);
//           const setting = state.settings.get(id);
//           if (!setting) {
//             return state;
//           }
//           const isEnabled = !setting.isEnabled;
//           // disable all settings if this one is going to be enabled
//           if (isEnabled) {
//             next.forEach(s => {
//               s.isEnabled = false;
//             });
//           }
//           next.set(id, {...setting, isEnabled});
//           return { settings: next };
//         },
//       );
//     },
//     // setEnabled
//     setEnabled: (id: AchievementId, value: boolean) => {
//       set(
//         (state) => {
//           const next = new Map(state.settings);
//           const setting = state.settings.get(id);
//           if (!setting) {
//             return state;
//           }
//           // disable all settings if this one is going to be enabled
//           if (value) {
//             next.forEach(s => {
//               s.isEnabled = false;
//             });
//           }
//           next.set(id, {...setting, isEnabled: value});

//           const current = value ? setting : undefined;
//           return { settings: next, currentSetting: current };
//         },
//       );
//     },
//     // setUnlocked
//     setUnlocked: (id: AchievementId, value: boolean) => {
//       set(
//         (state) => {
//           const next = new Map(state.settings);
//           const setting = state.settings.get(id);
//           if (!setting) {
//             return state;
//           }
//           // since we are automatically enabling this setting, first
//           // make sure they are all disabled
//           const current = value ? setting : undefined;
//           if (value) {
//             next.forEach(s => {
//               s.isEnabled = false;
//             });
//           }
//           next.set(id, {...setting, isUnlocked: value, isEnabled: value});
//           return { settings: next, currentSetting: current };
//         },
//       );
//     },
//   }));
// };

export const createSettingsStore = (
  initState: SettingsState = defaultInitState,
) => {
  return createStore<SettingsStore>()(
    persist(
      (set) => (
        {
          ...initState,
          currentSetting: undefined,
          // toggle
          toggle: (id: AchievementId) => {
            set(
              (state) => {
                const next = new Map(state.settings);
                const setting = state.settings.get(id);
                if (!setting) {
                  return state;
                }
                const isEnabled = !setting.isEnabled;
                // disable all settings if this one is going to be enabled
                if (isEnabled) {
                  next.forEach(s => {
                    s.isEnabled = false;
                  });
                }
                next.set(id, {...setting, isEnabled});
                return { settings: next };
              },
            );
          },
          // setEnabled
          setEnabled: (id: AchievementId, value: boolean) => {
            set(
              (state) => {
                const next = new Map(state.settings);
                const setting = state.settings.get(id);
                if (!setting) {
                  return state;
                }
                // disable all settings if this one is going to be enabled
                if (value) {
                  next.forEach(s => {
                    s.isEnabled = false;
                  });
                }
                next.set(id, {...setting, isEnabled: value});

                const current = value ? setting : undefined;
                return { settings: next, currentSetting: current };
              },
            );
          },
          // setUnlocked
          setUnlocked: (id: AchievementId, value: boolean) => {
            set(
              (state) => {
                const next = new Map(state.settings);
                const setting = state.settings.get(id);
                if (!setting) {
                  return state;
                }
                // since we are automatically enabling this setting, first
                // make sure they are all disabled
                const current = value ? setting : undefined;
                if (value) {
                  next.forEach(s => {
                    s.isEnabled = false;
                  });
                }
                next.set(id, {...setting, isUnlocked: value, isEnabled: value});
                return { settings: next, currentSetting: current };
              },
            );
          },
        }
      ),
      {
        name: "settings",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
};
