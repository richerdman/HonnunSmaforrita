import { ListModel } from "../models/list";

let lists: ListModel[] = [];

export const listService = {
  init(initialLists: Partial<ListModel>[] = []) {
    lists = initialLists
      .map(l => ({
        id: typeof l.id === "number" ? l.id : NaN,
        name: l.name ?? "Untitled",
        color: l.color ?? "#efefef",
        boardId: typeof l.boardId === "number" ? l.boardId : -1,
      }))
      .filter(l => !Number.isNaN(l.id));
  },

  getAll(): ListModel[] {
    return [...lists];
  },

  getByBoardId(boardId: number): ListModel[] {
    return lists.filter(l => l.boardId === boardId);
  },

  create(payload: { name: string; color?: string; boardId: number }): ListModel {
    if (!payload.name || !payload.name.trim()) {
      throw new Error("List name is required");
    }
    if (typeof payload.boardId !== "number") {
      throw new Error("boardId must be a number");
    }

    const maxId = lists.length ? Math.max(...lists.map(l => l.id)) : 0;
    const newId = maxId + 1;

    const newList: ListModel = {
      id: newId,
      name: payload.name.trim(),
      color: payload.color ?? "#efefef",
      boardId: payload.boardId,
    };
    lists.push(newList);
    return newList;
  },

  update(id: number, patch: Partial<Pick<ListModel, "name" | "color">>): ListModel | null {
    const idx = lists.findIndex(l => l.id === id);
    if (idx === -1) return null;
    const updated = { ...lists[idx], ...patch };
    lists[idx] = updated;
    return updated;
  },

  delete(id: number): boolean {
    const before = lists.length;
    lists = lists.filter(l => l.id !== id);
    return lists.length < before;
  },

  clear() {
    lists = [];
  },

  _dump() {
    return [...lists];
  }
};