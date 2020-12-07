import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'

// https://github.com/TrySound/rollup-plugin-terser
import { terser } from 'rollup-plugin-terser'

// https://github.com/saf33r/rollup-plugin-cleaner
import cleaner from 'rollup-plugin-cleaner'

// https://github.com/egoist/rollup-plugin-postcss
import postcss from 'rollup-plugin-postcss'

// https://github.com/ezolenko/rollup-plugin-typescript2
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'
import { DEFAULT_EXTENSIONS } from '@babel/core'

import { cloneDeep, upperFirst } from 'lodash'
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const filename = pkg.browser.slice(
  pkg.browser.indexOf('/') + 1,
  pkg.browser.indexOf('.')
)

const out = [
  {
    file: pkg.main,
    format: 'cjs'
  },
  {
    file: pkg.module,
    format: 'esm'
  },
  {
    file: pkg.browser,
    format: 'umd',
    name: filename
      .split('-')
      .map((i) => upperFirst(i))
      .join('')
  },
  {
    file: pkg.browser.replace('umd.', ''),
    format: 'umd',
    name: filename
      .split('-')
      .map((i) => upperFirst(i))
      .join('')
  }
]

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) 2020-2021 ${pkg.author}
 * Released under the ${pkg.license} License.
 */
`

const minimize = (obj) => {
  const minObj = cloneDeep(obj)
  minObj.file = minObj.file.slice(0, minObj.file.lastIndexOf('.js')) + '.min.js'
  minObj.plugins = [
    terser({
      compress: { drop_console: false },
      format: {
        comments: RegExp(`${pkg.name}`)
      }
    })
  ]
  minObj.banner = banner
  return minObj
}

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

export default {
  input: resolve('src/index.ts'),
  output: [
    ...out,
    ...out.map((type) => {
      type.file = resolve(type.file)
      return minimize(type)
    })
  ],
  plugins: [
    cleaner({
      targets: ['./dist']
    }),
    json(),
    nodeResolve(),
    commonjs(),
    alias({
      entries: [{ find: '@', replacement: resolve('src') }]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    typescript({
      check: true,
      tsconfig: resolve('tsconfig.json')
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx']
    }),
    postcss({
      extract:
        process.env.CSS_STATUS === 'inline'
          ? false
          : resolve(`dist/css/${filename}.css`)
    })
  ]
}
