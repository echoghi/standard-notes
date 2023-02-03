export function sortNotes(notes: any, sortSetting: string) {
  // Sort notes by pinned and sortSetting
  return notes.sort((a: any, b: any) => {
    // If both a and b are pinned, sort by sortSetting
    if (a.pinned && b.pinned) {
      if (sortSetting === 'title') {
        return a[sortSetting].localeCompare(b[sortSetting]);
      }
      return new Date(b[sortSetting]).getTime() - new Date(a[sortSetting]).getTime();
    }
    // If only a is pinned, a should come first
    if (a.pinned) {
      return -1;
    }
    // If only b is pinned, b should come first
    if (b.pinned) {
      return 1;
    }
    // If neither a nor b are pinned, sort by sortSetting
    if (sortSetting === 'title') {
      return a[sortSetting].localeCompare(b[sortSetting]);
    }

    return new Date(b[sortSetting]).getTime() - new Date(a[sortSetting]).getTime();
  });
}
