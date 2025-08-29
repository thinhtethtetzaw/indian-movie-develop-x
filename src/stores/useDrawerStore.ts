import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type DrawerKey = "language" | "share" | null;

type DrawerState = {
  openDrawer: DrawerKey;
  setOpen: (key: Exclude<DrawerKey, null>, value: boolean) => void;
  toggleDrawer: (key: Exclude<DrawerKey, null>) => void;
  showDrawer: (key: Exclude<DrawerKey, null>) => void;
  hideDrawer: () => void;
};

export const useDrawerStore = create<DrawerState>()(
  devtools(
    (set, get) => ({
      openDrawer: null,

      setOpen: (key, value) =>
        set(() => ({ openDrawer: value ? key : null }), false, "setOpen"),

      toggleDrawer: (key) => {
        const { openDrawer } = get();
        set(
          { openDrawer: openDrawer === key ? null : key },
          false,
          "toggleDrawer",
        );
      },

      showDrawer: (key) => {
        const { openDrawer } = get();
        if (openDrawer !== key) {
          set({ openDrawer: key }, false, "showDrawer");
        }
      },

      hideDrawer: () => {
        const { openDrawer } = get();
        if (openDrawer !== null) {
          set({ openDrawer: null }, false, "hideDrawer");
        }
      },
    }),
    { name: "drawer-store" },
  ),
);
