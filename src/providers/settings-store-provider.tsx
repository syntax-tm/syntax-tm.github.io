// src/providers/counter-store-provider.tsx
'use client';

import { type ReactNode, createContext, useState, useContext } from 'react';
import { useStore } from 'zustand';

import { type SettingsStore, createSettingsStore } from '@stores/settings-store';

export type SettingsStoreApi = ReturnType<typeof createSettingsStore>

export const SettingsStoreContext = createContext<SettingsStoreApi | undefined>(
  undefined,
);

export interface SettingsStoreProviderProps {
  children: ReactNode
}

export const SettingsStoreProvider = ({
  children,
}: SettingsStoreProviderProps) => {
  const [store] = useState(() => createSettingsStore());
  return (
    <SettingsStoreContext.Provider value={store}>
      {children}
    </SettingsStoreContext.Provider>
  );
};

export const useSettingsStore = <T,>(
  selector: (store: SettingsStore) => T,
): T => {
  const settingsStoreContext = useContext(SettingsStoreContext);
  if (!settingsStoreContext) {
    throw new Error(`useSettingsStore must be used within SettingsStoreContext`);
  }

  return useStore(settingsStoreContext, selector);
};
