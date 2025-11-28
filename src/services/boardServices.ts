import rawData from '../data/data.json';
import type { Board, List, Task } from '../types/types';

type DataShape = {
    boards: Board[];
    lists: List[];
    tasks: Task[];
  };

const data: DataShape = rawData as DataShape;

export function getBoardById(id: number) {
    return data.boards.find((b) => b.id === id) ?? null;
}

export function getAllBoards() {
    return data.boards.slice();
}

export function createBoard(payload: { name: string; description?: string; thumbnailPhoto?: string }) {
    const newId = data.boards.reduce((max, b) => Math.max(max, b.id), 0) + 1;
    const board: Board = {
        id: newId,
        name: payload.name,
        description: payload.description ?? '',
        thumbnailPhoto: payload.thumbnailPhoto ?? '',
    };
    data.boards.push(board);
    return board;
}

export function deleteBoard(boardId: number) {
    const idx = data.boards.findIndex((b) => b.id === boardId);
    if (idx === -1) {
        return false;
    }
    data.boards.splice(idx, 1);
    return true;
}

export function updateBoard(boardId: number, updates: Partial<Omit<Board, 'id'>>) {
    const board = getBoardById(boardId);
    if (!board) {
        return null;
    }
    Object.assign(board, updates);
    return board;
}