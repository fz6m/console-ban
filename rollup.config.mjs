import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import cleaner from 'rollup-plugin-cleaner'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json' assert { type: 'json' }
import path from 'path'
import _ from 'lodash'
import { fileURLToPath } from 'url';

import { DEFAULT_EXTENSIONS } from '@babel/core'

const isDev = process.env.NODE_ENV === 'development'

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
  input: resolve('src/index.ts'),
  output: [module, minify(module)],
  plugins: [
    index === 0
      ? cleaner({
          targets: ['./dist', './types']
        })
      : null,
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: isDev,
      preventAssignment: true
    }),
    json(),
    alias({
      entries: [{ find: '@', replacement: resolve('src') }]
    }),
    module.format === 'umd' ? nodeResolve() : null,
    commonjs(),
    typescript({
      check: true,
      tsconfig: resolve('tsconfig.json'),
      useTsconfigDeclarationDir: true
    }),
    babel({
      exclude: 'node_modules/**',
      comments: false,
      babelHelpers: 'bundled',
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx']
    })
  ].filter(Boolean)
})

export default out.map((o, i) => configGenerator(o, i))

function resolve(dir) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.join(__dirname, dir)
}

function minify(m) {
  m.file = resolve(m.file)

  const minObj = _.cloneDeep(m)
  minObj.file = minObj.file.slice(0, minObj.file.lastIndexOf('.js')) + '.min.js'
  minObj.plugins = [
    terser({
      format: {
        comments: RegExp(`${pkg.name}`)
      }
    })
  ]
  minObj.banner = banner
  return minObj
}
