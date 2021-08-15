declare global {
  const __DEV__: boolean

  interface Window {
    chrome?: any
  }
}

export {}
