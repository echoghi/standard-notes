export interface Note {
    id: string;
    userId: string;
    title: string;
    content: string;
    starred: boolean;
    deleted: boolean;
    pinned: boolean;
    spellCheck: boolean;
    preview: boolean;
    editEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface User {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    salt: string;
    proof: string;
    notes: Note[];
}
