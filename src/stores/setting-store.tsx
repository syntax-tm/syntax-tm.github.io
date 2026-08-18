import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createStore, useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { AchievementId } from '@enums';
import { createContext } from 'react';

export type SettingState = {
  id: AchievementId,
  isUnlocked: boolean,
  isEnabled: boolean,
}

type SettingActions = {
  unlock: () => void,
  lock: () => void,
  enable: () => void,
  disable: () => void,
  toggle: () => void,
  reset: () => void,
}

export type SettingStore = SettingState & SettingActions;

export const createSettingStore = (id: AchievementId) => {
  return createStore<SettingStore>()(
    persist(
      (set) => ({
        id,
        isEnabled: false,
        isUnlocked: false,
        unlock: () => { set((state) => ({ ...state, isUnlocked: true, isEnabled: true })); },
        lock: () => { set((state) => ({ ...state, isUnlocked: false })); },
        enable: () => { set((state) => ({ ...state, isEnabled: true })); },
        disable: () => { set((state) => ({ ...state, isEnabled: false })); },
        toggle: () => { set((state) => ({ ...state, isEnabled: !state.isEnabled })); },
        reset: () => { set((state) => ({ ...state, isEnabled: false, isUnlocked: false })); },
      }),
      {
        name: id,
      },
    ),
  );
};

type CurrentSettingState = {
  id: AchievementId | null,
}

type CurrentSettingActions = {
  update: (id: AchievementId | null) => void,
  reset: () => void,
}

export type CurrentSettingStore = CurrentSettingState & CurrentSettingActions;

export const createCurrentSettingStore = () => {
  return createStore<CurrentSettingStore>()(
    persist(
      (set) => ({
        id: null,
        update: (id: AchievementId | null) => { set((state) => ({ id })); },
        reset: () => { set((state) => ({ id: null })); },
      }),
      {
        name: 'current',
      },
    ),
  );
};

export const createSettingStoreFactory = (
  context: settingStoresContextType,
) => {
  return (settingStoreKey: AchievementId) => {
    const settingStores = context.stores!;
    // create and add to the registry for synchronization between stores
    if (!settingStores.has(settingStoreKey)) {
      const store = createSettingStore(settingStoreKey);
      settingStores.set(settingStoreKey, store);
      registerSettingStore(store, context.currentState);
      return store;
    }
    return settingStores.get(settingStoreKey)!;
  };
};

interface settingStoresContextType {
  stores: Map<AchievementId, ReturnType<typeof createSettingStore>> | undefined;
  current: AchievementId | null;
  currentState: ReturnType<typeof createCurrentSettingStore>;
}

export const settingStoreRegistry = new Set<ReturnType<typeof createSettingStore>>();

const SettingStoresContext = createContext<settingStoresContextType | undefined>(undefined);

export function SettingStoresProvider({ children }: { children: React.ReactNode }) {
  const [stores] = useState(
    () => new Map<AchievementId, ReturnType<typeof createSettingStore>>(),
  );
  const [currentState] = useState(
    () => createCurrentSettingStore(),
  );
  const [current, setCurrent] = useState<AchievementId | null>(null);

  const value = useMemo(() => {
    return {
      stores,
      currentState,
      current,
    };
  }, [stores, currentState, current]);


  useEffect(() => {
    currentState.subscribe((state) => {
      setCurrent(state.id ?? null);
    });
  }, [currentState]);

  return (
    <SettingStoresContext.Provider value={value}>
      {children}
    </SettingStoresContext.Provider>
  );
};


function registerSettingStore(store: ReturnType<typeof createSettingStore>, currentStore: ReturnType<typeof createCurrentSettingStore>) {
  settingStoreRegistry.add(store);
  // subscribe to changes in this store
  store.subscribe((state, prevState) => {

    const fireChangeEvent = (id: AchievementId | null) => {
      // fire change event
      if (typeof window !== "undefined") {
        const event = new CustomEvent("themeChange", {
          detail: {
            id,
          },
        });
        window.dispatchEvent(event);
      }
    };

    const disableOtherSettings = () => {
      settingStoreRegistry.forEach((otherStore) => {
        if (otherStore !== store) {
          otherStore.getState().disable();
        }
      });
    };

    const isEnabledChanged = state.isEnabled !== prevState.isEnabled;
    const isUnlockedChanged = state.isUnlocked !== prevState.isUnlocked;

    if (isUnlockedChanged) {
      // was unlocked
      if (state.isUnlocked) {
        currentStore.getState().update(state.id);
        fireChangeEvent(state.id);
      }
      else if (prevState.isEnabled) {
        currentStore.getState().update(null);
        fireChangeEvent(null);
      }
    }
    // only act if this store was just flipped from disabled to enabled
    if (state.isEnabled && !prevState.isEnabled) {
      disableOtherSettings();
      fireChangeEvent(state.id);
      //currentStore.getState().update(state);
      // loop through all other registered stores and disable them
      
    }
  });
}

export const useSettings = <U,>(
  selector: (state: CurrentSettingStore) => U,
) => {
  const context = useContext(SettingStoresContext);

  if (context === undefined) {
    throw new Error('useSettingStore must be used within a SettingStoresProvider');
  }

  return useStore(context.currentState, selector);
};

export const useSettingStores = () => {
  const context = useContext(SettingStoresContext);

  if (context === undefined) {
    throw new Error('useSettingStores must be used within a SettingStoresProvider');
  }

  return {
    stores: context.stores,
  };
};

export const useSettingStore = <U,>(
  key: AchievementId,
  selector: (state: SettingStore) => U,
) => {
  const context = useContext(SettingStoresContext);

  if (context === undefined) {
    throw new Error('useSettingStore must be used within a SettingStoresProvider');
  }

  const getOrCreateSettingStoreByKey = useCallback(
    (key: AchievementId) => createSettingStoreFactory(context)(key),
    [context.stores],
  );

  return useStore(getOrCreateSettingStoreByKey(key), selector);
};
