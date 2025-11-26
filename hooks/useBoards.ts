import { useState } from "react";
import boardsData from "../data/data.json";
import { Board } from "../types";

export function useBoards() {
    const [boards, setBoards] = useState<Board[]>(boardsData.boards as Board[]);
    const addBoard = (board: Omit<Board, "id">) => {
        const newBoard: Board = {
            ...board,
            id: Math.max(...boards.map(b => b.id),0) + 1, // id generation 
        };
        setBoards([...boards, newBoard]);
        }
    return { boards, addBoard };
}