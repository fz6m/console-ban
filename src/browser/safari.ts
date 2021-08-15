export const getSafariTest = (fire: () => void) => {
  const img = new Image()
  Object.defineProperty(img, 'id', {
    get: () => {
      fire()
    }
  })
  console.log(img)
}
