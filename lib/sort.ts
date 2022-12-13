export function sortNotes(notes: any, sortSetting: string) {
    // Sort notes by pinned and sortSetting
    notes.sort((a: any, b: any) => {
        if (a.pinned && !b.pinned) {
            return -1;
        }
        if (!a.pinned && b.pinned) {
            return 1;
        }

        if (sortSetting === 'title') {
            if (a[sortSetting] < b[sortSetting]) {
                return -1;
            }
            if (a[sortSetting] > b[sortSetting]) {
                return 1;
            }
            return 0;
        }

        return new Date(b[sortSetting]) - new Date(a[sortSetting]);
    });

    return notes;
}
