export type Board = {
    id: number;
    name: string;
    description: string;
    thumbnailPhoto: string;
}

export interface List {
    id: number;
    name: string;
    color: string;
    boardId: number;
}

export type RootStackParamList = {
    Home: undefined;
    Boards: undefined;

};