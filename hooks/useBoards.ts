import { useState } from "react";
import boardsData from "../src/data/data.json";
import { Board } from "../types";

export function useBoards() {
    const [boards] = useState<Board[]>(boardsData.boards as Board[]);
    return { boards };
}