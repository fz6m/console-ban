// @ts-nocheck
// This file just for reference only
// DO NOT CHANGE IT!

// https://stackoverflow.com/a/71794156
console.log(
  Object.defineProperties(new Error(), {
    message: {
      get() {
        alert('Chrome/Firefox')
      }
    },
    toString: {
      value() {
        new Error().stack.includes('toString@') && alert('Safari')
      }
    }
  })
)
