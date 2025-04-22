"use client";

import type { Modifiers } from "@dnd-kit/core";
import type { SortingStrategy } from "@dnd-kit/sortable";
import React, { useEffect } from "react";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

import type { SortableItemDef } from "../types";

type SortableState = {
  items: SortableItemDef[];

  activeItem?: SortableItemDef | null;

  modifiers?: Modifiers;
  strategy?: SortingStrategy;

  flatCursor?: boolean;
};
type SortableActions = {
  setItems: (items: SortableItemDef[]) => void;
  setStrategy: (strategy: SortingStrategy | undefined) => void;
  setActiveItem: (item: SortableItemDef | null) => void;
  setModifiers: (modifiers: Modifiers | undefined) => void;
};
type SortableStore = SortableState & SortableActions;

const defaultInitState: SortableState = {
  items: [],
  strategy: rectSortingStrategy,
  flatCursor: true,
};

const createSortableStore = (initState: SortableState = defaultInitState) => {
  return createStore<SortableStore>()((set) => ({
    ...initState,
    setItems: (items) => {
      set({ items });
    },
    setStrategy: (strategy) => {
      set({ strategy });
    },
    setActiveItem: (item) => {
      set({ activeItem: item });
    },
    setModifiers: (modifiers) => {
      set({ modifiers });
    },
  }));
};

type SortableStoreApi = ReturnType<typeof createSortableStore>;

const SortableStoreContext = React.createContext<SortableStoreApi | undefined>(
  undefined,
);

type SortableStoreProviderProps = SortableState & {
  children: React.ReactNode;
};
export const SyncSortableStoreProvider = ({
  children,
  items,
  strategy,
}: SortableStoreProviderProps) => {
  const { setItems, setStrategy } = useSortableStore((s) => s);
  useEffect(() => {
    setItems(items);
  }, [items, setItems]);
  useEffect(() => {
    setStrategy(strategy);
  }, [strategy, setStrategy]);

  return <>{children}</>;
};
export const SortableStoreProvider = ({
  children,
  ...props
}: SortableStoreProviderProps) => {
  const storeRef = React.useRef<SortableStoreApi>(null);
  storeRef.current ??= createSortableStore({
    ...defaultInitState,
    ...props,
  });
  return (
    <SortableStoreContext.Provider value={storeRef.current}>
      <SyncSortableStoreProvider {...props}>
        {children}
      </SyncSortableStoreProvider>
    </SortableStoreContext.Provider>
  );
};

export function useSortableStore(): SortableStore;
export function useSortableStore<T>(selector: (store: SortableStore) => T): T;
export function useSortableStore<T>(selector?: (store: SortableStore) => T): T {
  const sortableStoreContext = React.useContext(SortableStoreContext);

  if (!sortableStoreContext) {
    throw new Error(
      `useSortableStore must be used within SortableStoreProvider`,
    );
  }

  return useStore(
    sortableStoreContext,
    selector ?? ((store: SortableStore) => store as T),
  );
}
