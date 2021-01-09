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

// https://github.com/ezolenko/rollup-plugin-typescript2
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

// support .js .jsx
// import { DEFAULT_EXTENSIONS } from '@babel/core'

const path = require('path')
const fs = require('fs')
const _ = require('lodash')

const umdFileName = pkg['umd:main']
const filename = umdFileName.slice(
  umdFileName.indexOf('/') + 1,
  umdFileName.indexOf('.')
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
    file: umdFileName,
    format: 'umd',
    name: _.upperFirst(_.camelCase(filename))
  }
]

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) 2020-${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License.
 */
`

const configGenerator = (module, index) => ({
  input: getInput(),
  output: [module, minify(module)],
  plugins: [
    index === 0
      ? cleaner({
          targets: ['./dist', './types']
        })
      : null,
    json(),
    module.format !== 'esm' ? nodeResolve() : null,
    commonjs(),
    alias({
      entries: [{ find: '@', replacement: resolve('src') }]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    typescript({
      check: true,
      tsconfig: resolve('tsconfig.json'),
      useTsconfigDeclarationDir: true
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.ts', '.tsx']
    })
  ].filter(Boolean)
})

export default out.map((o, i) => configGenerator(o, i))

/**
 * 获取文件绝对路径
 * @param {String} dir 文件相对路径
 */
function resolve(dir) {
  return path.join(__dirname, dir)
}

/**
 * 自动识别项目入口文件
 */
function getInput() {
  const index = resolve('src/index.ts')
  const indexJSX = resolve('src/index.tsx')
  return fs.existsSync(index) ? index : indexJSX
}

/**
 * 最小化版本
 * @param {Object} m out 数组内的单个 output 对象
 */
function minify(m) {
  // 获取绝对路径
  m.file = resolve(m.file)

  // 最小化
  const minObj = _.cloneDeep(m)
  minObj.file = minObj.file.slice(0, minObj.file.lastIndexOf('.js')) + '.min.js'
  minObj.plugins = [
    terser({
      // 去除多余的 banner
      format: {
        comments: RegExp(`${pkg.name}`)
      }
    })
  ]
  minObj.banner = banner
  return minObj
}
