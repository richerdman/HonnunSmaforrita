import { useState } from "react";
import { Board } from "../types";
import boardsData from "../data/data.json";

export function useBoards() {
    const [boards] = useState<Board[]>(boardsData.boards as Board[]);
    return { boards };
}