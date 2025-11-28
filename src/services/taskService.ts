import rawData from '../data/data.json';
import type { Board, List } from '../types/types';

export type Task = {
    id: number;
    name: string;
    description?: string;
    isFinished: boolean;
    listId: number;
    dueDate?: string;
};

type DataShape = {
    boards: Board[];
    lists: List[];
    tasks: Task[];
};

// Keep a singleton in-memory copy of the data so updates persist during app runtime
const data: DataShape = JSON.parse(JSON.stringify(rawData));

let nextTaskId = data.tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;

function isIsoDateString(s: string) {
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(s)) return false;
    const d = new Date(s);
    if (isNaN(d.getTime())) return false;
    return d.toISOString().startsWith(s);
}

function isNotPast(s: string) {
    const d = new Date(s);
    const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dOnly >= todayOnly;
}

function sanitizeDueDate(d?: string) {
    if (d === undefined || d === null) return undefined;
    const s = String(d).trim();
    if (s === '') return undefined;
    if (!isIsoDateString(s)) return undefined;
    return s;
}

export function getLists() {
    return data.lists.slice();
}

export function getListById(id: number) {
    return data.lists.find((l) => l.id === id) ?? null;
}

export function getTasksByList(listId: number) {
    return data.tasks.filter((t) => t.listId === listId).slice();
}

export function getAllTasks() {
    return data.tasks.slice();
}

export function createTask(payload: { name: string; description?: string; listId: number; dueDate?: string }) {
    const dd = payload.dueDate === undefined ? undefined : String(payload.dueDate).trim();
    if (dd !== undefined && dd !== '') {
        if (!isIsoDateString(dd)) {
            return { ok: false as const, error: 'Invalid date format (expected YYYY-MM-DD)' };
        }
        if (!isNotPast(dd)) {
            return { ok: false as const, error: 'Due date cannot be in the past' };
        }
    }
    const task: Task = {
        id: nextTaskId++,
        name: payload.name,
        description: payload.description ?? '',
        isFinished: false,
        dueDate: dd || undefined,
        listId: payload.listId,
    };
    data.tasks.push(task);
    return { ok: true as const, task };
}

export function toggleTaskFinished(taskId: number) {
    const t = data.tasks.find((x) => x.id === taskId);
    if (!t) return null;
    t.isFinished = !t.isFinished;
    return t;
}

export function moveTask(taskId: number, toListId: number) {
    const t = data.tasks.find((x) => x.id === taskId);
    if (!t) return null;
    t.listId = toListId;
    return t;
}

export function deleteTask(taskId: number) {
    const idx = data.tasks.findIndex((x) => x.id === taskId);
    if (idx === -1) return false;
    data.tasks.splice(idx, 1);
    return true;
}

export function editTask(taskId: number, updates: Partial<Omit<Task, 'id' | 'listId'>>) {
    const t = data.tasks.find((x) => x.id === taskId);
    if (!t) return { ok: false as const, error: 'Task not found' };
    if (updates.name !== undefined) t.name = updates.name;
    if (updates.description !== undefined) t.description = updates.description;
    if (updates.isFinished !== undefined) t.isFinished = updates.isFinished;
    if ((updates as any).dueDate !== undefined) {
        const dd = (updates as any).dueDate === undefined ? undefined : String((updates as any).dueDate).trim();
        if (dd !== undefined && dd !== '') {
            if (!isIsoDateString(dd)) {
                return { ok: false as const, error: 'Invalid date format (expected YYYY-MM-DD)' };
            }
            if (!isNotPast(dd)) {
                return { ok: false as const, error: 'Due date cannot be in the past' };
            }
        }
        t.dueDate = dd || undefined;
    }
    return { ok: true as const, task: t };
}

export function dueDateTask(taskId: number, dueDate: string) {
    const t = data.tasks.find((x) => x.id === taskId);
    if (!t) return { ok: false as const, error: 'Task not found' };
    const dd = dueDate === undefined ? undefined : String(dueDate).trim();
    if (dd !== undefined && dd !== '') {
        if (!isIsoDateString(dd)) {
            return { ok: false as const, error: 'Invalid date format (expected YYYY-MM-DD)' };
        }
        if (!isNotPast(dd)) {
            return { ok: false as const, error: 'Due date cannot be in the past' };
        }
    }
    t.dueDate = dd || undefined;
    return { ok: true as const, task: t };
}

export function getListsForBoard(boardId: number) {
    return data.lists.filter((l) => l.boardId === boardId).slice();
}
