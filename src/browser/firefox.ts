export const getFirefoxTest = (fire: () => void) => {
  const re = /./
  re.toString = fire as any
  console.log(re)
}
