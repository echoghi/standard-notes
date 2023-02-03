export function setLocalStorage(name: string, value: string): void {
  try {
    // Set the local storage with the given name
    localStorage.setItem(name, value);
  } catch (e) {
    throw new Error('Unable to set local storage');
  }
}

export function getLocalStorage(name: string): string | null {
  try {
    // Get the local storage with the given name
    return localStorage.getItem(name);
  } catch (e) {
    throw new Error('Unable to get local storage');
  }
}

export function removeLocalStorageItem(name: string): void {
  try {
    // remove the local storage item with the given name
    localStorage.removeItem(name);
  } catch (e) {
    throw new Error('Unable to remove local storage item');
  }
}
