import { EBrowser } from '@/constants'
import { IFireRunner } from '@/interface'

export const getSafariTest = (fire: IFireRunner) => {
  const img = new Image()
  Object.defineProperty(img, 'id', {
    get: () => {
      fire(EBrowser.Safari)
    }
  })
  console.log(img)
}
