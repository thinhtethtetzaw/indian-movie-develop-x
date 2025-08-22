// db.ts
import Dexie, { type EntityTable } from "dexie";

interface Bookmark {
  id: string;
}

interface WatchList {
  id: string;
  playHeadInSec: number;
}

const db = new Dexie("IndiaMovie") as Dexie & {
  bookmarks: EntityTable<
    Bookmark,
    "id" // primary key "id" (for the typings only)
  >;
  watchList: EntityTable<
    WatchList,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  bookmarks: "++id", // primary key "id" (for the runtime!)
  watchList: "++id, playHeadInSec", // primary key "id" (for the runtime!)
});

export { db };
export type { Bookmark, WatchList };
