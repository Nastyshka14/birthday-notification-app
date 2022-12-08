const saveDataToStorage = (key: string, data: string): void => {
  window.sessionStorage.setItem(key, data)
}

const getDataFromStorage = (key: string): string | null => {
  return window.sessionStorage.getItem(key)
}

const removeDataFromStorage = (key: string): void => {
  return window.sessionStorage.removeItem(key)
}

export { saveDataToStorage, getDataFromStorage, removeDataFromStorage }
