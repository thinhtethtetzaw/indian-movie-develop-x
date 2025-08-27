// db.ts
import Dexie, { type EntityTable } from "dexie";

interface Bookmark {
  id: string;
}

interface WatchList {
  id: string;
  play_head_in_sec: number;
  created_at: Date;
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
  bookmarks: "++id", // primary key "id"
  watchList: "++id, epId, play_head_in_sec, created_at", // primary key "id" (not auto-incrementing)
});

export { db };
export type { Bookmark, WatchList };
