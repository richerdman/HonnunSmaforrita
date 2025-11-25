export type Board = {
    id: string;
    name: string;
    description?: string;
    thumbnailPhoto?: string;
}

export type List = {
    id: string;
    boardId: string;
    name: string;
    color?: string;
}

export type Task = {
    id: string;
    name: string;
    description?: string;
    isFinished: boolean;
    listId: string;
}