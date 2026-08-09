"use client";

import { createStore } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import { AchievementId } from "@enums";
import { Setting, defaultSettings } from "types";

const initSettings = new Map<AchievementId, Setting>();

defaultSettings.forEach(s => {
  // TODO: re-enable fitlers by default once they have been added
  //if (s.type === "FILTER") s.isUnlocked = true;
  if (s.type === "FONT") s.isUnlocked = true;
  // TODO: re-enable icons by default once they have been added
  //if (s.type === "ICONS") s.isUnlocked = true;
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

export const createSettingsStore = (
  initState: SettingsState = defaultInitState,
) => {
  return createStore<SettingsStore>()(
    persist(
      (set, get) => (
        {
          ...initState,
          // currentSetting: undefined,
          // toggle
          toggle: (id: AchievementId) => {
            set(
              () => {
                const state = get();
                const next = new Map(state.settings);
                const setting = state.settings.get(id);
                if (!setting) {
                  return state;
                }
                const value = !setting.isEnabled;

                // since we are enabling this setting, first
                // make sure they are all disabled
                const currentSettings = next.values().filter(s => s.isEnabled).toArray();
                if (value) {
                  currentSettings
                    .forEach(s => {
                      s.isEnabled = false;
                      next.set(s.id, s);
                    });
                }

                const updated = {...setting, isEnabled: value};
                next.set(id, updated);

                let current;
                if (value) {
                  current = updated;
                }
                else if (currentSettings.length > 0) {
                  current = currentSettings[0];
                }
                else {
                  current = undefined;
                }

                next.set(id, updated);
                return { settings: next, currentSetting: current };
              },
            );
          },
          // setEnabled
          setEnabled: (id: AchievementId, value: boolean) => {
            set(
              () => {
                const state = get();
                const next = new Map(state.settings);
                const setting = state.settings.get(id);
                if (!setting) {
                  return state;
                }

                // since we are automatically enabling this setting, first
                // make sure they are all disabled
                const currentSettings = next.values().filter(s => s.isEnabled).toArray();
                if (value) {
                  currentSettings
                    .forEach(s => {
                      s.isEnabled = false;
                      next.set(s.id, s);
                    });
                }

                const updated = {...setting, isEnabled: value};
                next.set(id, updated);

                let current;
                if (value) {
                  current = updated;
                }
                else if (currentSettings.length > 0) {
                  current = currentSettings[0];
                }
                else {
                  current = undefined;
                }

                next.set(id, updated);
                return { settings: next, currentSetting: current };
              },
            );
          },
          // setUnlocked
          setUnlocked: (id: AchievementId, value: boolean) => {
            set(
              () => {
                const state = get();
                const next = new Map(state.settings);
                const setting = state.settings.get(id);
                if (!setting) {
                  return state;
                }

                // since we are automatically enabling this setting, first
                // make sure they are all disabled
                const currentSettings = next.values().filter(s => s.isEnabled).toArray();
                if (value) {
                  currentSettings
                    .forEach(s => {
                      s.isEnabled = false;
                      next.set(s.id, s);
                    });
                }

                const updated = {...setting, isUnlocked: value, isEnabled: value};
                next.set(id, updated);

                let current;
                if (value) {
                  current = updated;
                }
                else if (currentSettings.length > 0) {
                  current = currentSettings[0];
                }
                else {
                  current = undefined;
                }

                return { settings: next, currentSetting: current };
              },
            );
          },
          // lock
          lock: (id: AchievementId) => {
            set(
              () => {
                const state = get();
                const next = new Map(state.settings);
                const setting = state.settings.get(id);
                if (!setting) {
                  return state;
                }
                // since we are enabling this setting, first
                // make sure they are all disabled
                let current = undefined;
                const currentSettings = next.values().filter(s => s.isEnabled).toArray();
                if (currentSettings.length > 1) {
                  // just assume the first one is valid
                  current = currentSettings[0];
                  // any additional enabled settings will be disabled
                  currentSettings
                    .slice(1)
                    .forEach(s => {
                      s.isEnabled = false;
                      next.set(s.id, s);
                    });
                }

                next.set(id, {...setting, isUnlocked: false, isEnabled: false});
                return { settings: next, currentSetting: current };
              },
            );
          },
          // unlock
          unlock: (id: AchievementId) => {
            set(
              () => {
                const state = get();
                const next = new Map(state.settings);
                const setting = state.settings.get(id);
                if (!setting) {
                  return state;
                }
                if (setting.isUnlocked) {
                  return state;
                }
                // since we are automatically enabling this setting, first
                // make sure they are all disabled
                const currentSettings = next.values().filter(s => s.isEnabled).toArray();
                currentSettings
                  .forEach(s => {
                    s.isEnabled = false;
                    next.set(s.id, s);
                  });

                const updated = {...setting, isUnlocked: true, isEnabled: true};
                next.set(id, updated);
                return { settings: next, currentSetting: updated };
              },
            );
          },
        }
      ),
      {
        name: "settings",
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const existingValue = JSON.parse(str) as StorageValue<SettingsState>;
            return {
              ...existingValue,
              state: {
                ...existingValue.state,
                settings:  new Map<AchievementId, Setting>(existingValue.state.settings),
              },
            };
          },
          setItem: (name, newValue: StorageValue<SettingsState>) => {
            // functions cannot be JSON encoded
            const str = JSON.stringify({
              ...newValue,
              state: {
                ...newValue.state,
                settings: Array.from(newValue.state.settings.entries()),
              },
            });
            localStorage.setItem(name, str);
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
      },
    ),
  );
};
