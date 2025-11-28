import { useState } from "react";
import { createBoard, deleteBoard, getAllBoards, getBoardById, updateBoard } from "../services/boardServices";
import { Board } from "../types/types";

export function useBoards() {
    const [boards, setBoards] = useState<Board[]>(getAllBoards());
    const addBoard = (board: Omit<Board, "id">) => {
        const newBoard = createBoard({
            name: board.name,
            description: board.description,
            thumbnailPhoto: board.thumbnailPhoto,
        })
        setBoards([...boards, newBoard]);
        return newBoard;
    };

    const removeBoard = (id: number) => {
        deleteBoard(id);
        console.log("Removing board with id:", id);
        setBoards([...getAllBoards()]);
        console.log("Updated boards:", getAllBoards());
    };

    const editBoard = (id: number, updates: Partial<Omit<Board, "id">>) => {
        updateBoard(id, updates);
        setBoards([...getAllBoards()]);
    }

    const getBoard = (id: number) => {
        return getBoardById(id);
    };

    return { boards, addBoard, removeBoard, getBoard, editBoard };
}