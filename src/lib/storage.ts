import * as SecureStore from "expo-secure-store";

export async function getItem(key: string): Promise<string | null> {
  // Use SecureStore when available (native). Fallback to localStorage on web.
  try {
    if (typeof SecureStore.getItemAsync === "function") {
      return await SecureStore.getItemAsync(key);
    }
  } catch (e) {
    // fallthrough to localStorage
  }

  if (typeof window !== "undefined" && window.localStorage) {
    return Promise.resolve(window.localStorage.getItem(key));
  }

  return null;
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    if (typeof SecureStore.setItemAsync === "function") {
      await SecureStore.setItemAsync(key, value);
      return;
    }
  } catch (e) {
    // fallthrough
  }

  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(key, value);
  }
}

export async function deleteItem(key: string): Promise<void> {
  try {
    if (typeof SecureStore.deleteItemAsync === "function") {
      await SecureStore.deleteItemAsync(key);
      return;
    }
  } catch (e) {
    // fallthrough
  }

  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.removeItem(key);
  }
}

export default { getItem, setItem, deleteItem };
