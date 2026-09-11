import { Category, MenuItemType } from "@enums";
import { createContext, useContext, useMemo, useState } from "react";
import { create, useStore } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import createDeepMerge from '@fastify/deepmerge';

const deepMerge = createDeepMerge({ all: true });

export interface XmbState {
  x: number,
  y: number,
  category: Category | undefined,
  item: MenuItemType | undefined,
  cache: Record<Category, number>,
}

type XmbActions = {
  setX: (newX: number) => void,
  //setY: (newY: number) => void,
  // getCacheY: (category: Category) => number | undefined;
  setY: (newY: number) => void;
  // setCachedY: (category: Category, newY: number) => void,
  setCache: (c: Category, newY: number) => void,
  setCategory: (newCategory: Category | undefined) => void,
  setItem: (newItem: MenuItemType | undefined) => void,
  reset: () => void,
}

export type XmbStore = XmbState & XmbActions;

export const createXmbStore = () => {
  return create<XmbStore>()(
    persist(
      (set, get) => ({
        x: 0,
        y: 0,
        category: undefined,
        item: undefined,
        cache: {
          Dev: 0,
          Gaming: 0,
          Home: 0,
          Misc: 0,
          Music: 0,
          Settings: 0,
          Social: 0,
          Unknown: 0,
          Welcome: 0,
        },
        setX: (newX: number) => set({ x: newX }),
        setY: (newY: number) => set({ y: newY }),
        setCache: (c: Category, newY: number) => set((state) => {
          //const next: Record<Category, number> = get().cache;
          return ({ ...state, cache: { ...state.cache, [c]: newY } });
        }),
        // getCacheY: (c: Category) => { return get().cache[c]; },
        setCategory: (newCategory: Category | undefined) => set({ category: newCategory }),
        setItem: (newItem: MenuItemType | undefined) => set({ item: newItem }),
        reset: () => set(() => ({ x: 0, y: 0, category: undefined, item: undefined })),
      }),
      {
        name: 'xmb-storage',
        storage: createJSONStorage(() => localStorage),
        // merge: (persisted, current) => deepMerge(current, persisted) as never,
        partialize: (state) => ({ cache: state.cache }),
      },
    ),
  );
};


interface XmbStoreContextType {
  currentState: ReturnType<typeof createXmbStore>;
}

const XmbStoreContext = createContext<XmbStoreContextType | undefined>(undefined);

export function XmbStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentState] = useState(
    () => createXmbStore(),
  );

  const value = useMemo(() => {
    return {
      currentState,
    };
  }, [currentState]);

  return (
    <XmbStoreContext.Provider value={value}>
      {children}
    </XmbStoreContext.Provider>
  );
};

export const useXmbStore = <U,>(
  selector: (state: XmbStore) => U,
) => {
  const context = useContext(XmbStoreContext);

  if (context === undefined) {
    throw new Error('useXmbStore must be used within an XmbStoreProvider');
  }

  return useStore(context.currentState, selector);
};
