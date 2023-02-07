function serializeJSON<T>(value: T) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    throw new Error('@rennalabs/hooks - useLocalStorage: Failed to serialize the value');
  }
}

function deserializeJSON(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function setLocalStorage(name: string, value: string): void {
  try {
    // Set the local storage with the given name
    localStorage.setItem(name, serializeJSON(value));
  } catch (e) {
    throw new Error('Unable to set local storage');
  }
}

export function getLocalStorage(name: string): string | null {
  try {
    // Get the local storage with the given name
    const item = localStorage.getItem(name);

    return item ? deserializeJSON(item) : null;
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
