import { useCallback, useEffect, useState } from "react";
import rawData from "../data/data.json";
import { List } from "../types/types";

let listsStore: List[] | null = null;
const listeners: Array<() => void> = [];

function ensureInit() {
  if (listsStore !== null) return;
  const raw = (rawData as any).lists ?? [];
  listsStore = raw.map((l: any) => ({
    id: Number(l.id),
    name: String(l.name),
    color: String(l.color ?? "#efefef"),
    boardId: Number(l.boardId),
  }));
}

function notifyAll() {
  listeners.forEach((cb) => {
    try { cb(); } catch (e) { /* ignore listener errors */ }
  });
}

export function useLists(boardId: number) {
  ensureInit();

  const [lists, setLists] = useState<List[]>(
    () => (listsStore!.filter((l) => l.boardId === boardId))
  );

  useEffect(() => {
    function onChange() {
      setLists(listsStore!.filter((l) => l.boardId === boardId));
    }
    listeners.push(onChange);
    onChange();
    return () => {
      const idx = listeners.indexOf(onChange);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, [boardId]);

  const reload = useCallback(() => {
    setLists(listsStore!.filter((l) => l.boardId === boardId));
  }, [boardId]);

  const createList = useCallback((payload: { name: string; color?: string }) => {
    if (!payload.name || !payload.name.trim()) {
      throw new Error("List name is required");
    }
    ensureInit();
    const maxId = listsStore!.length ? Math.max(...listsStore!.map((s) => s.id)) : 0;
    const newList: List = {
      id: maxId + 1,
      name: payload.name.trim(),
      color: payload.color ?? "#efefef",
      boardId,
    };
    listsStore!.push(newList);
    notifyAll();
    return newList;
  }, [boardId]);

  const deleteList = useCallback((id: number) => {
    ensureInit();
    const before = listsStore!.length;
    listsStore = listsStore!.filter((l) => l.id !== id);
    const removed = listsStore!.length < before;
    if (removed) notifyAll();
    return removed;
  }, []);

  return { lists, createList, deleteList, reload };
}
