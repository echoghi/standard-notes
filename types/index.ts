export interface Note {
    id: string;
    userId: string;
    title: string;
    content: string;
    starred: boolean;
    archived: boolean;
    deleted: boolean;
    pinned: boolean;
    spellCheck: boolean;
    preview: boolean;
    editEnabled: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    deleteFlag?: boolean;
}

export interface User {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    salt: string;
    proof: string;
    sort: string;
    theme: string;
    notes: Note[];
}
