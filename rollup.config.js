import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const banner = `/* ${pkg.name}@${pkg.version} (${pkg.license}) — ${pkg.homepage} */`

export default {
  input: './src/index.ts',

  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './rollup.tsconfig.json' }),
  ],

  output: [
    {
      name: 'SolaredgeClient',
      format: 'umd',
      file: './lib/umd/solaredge-client.js',
      sourcemap: true,
      banner,
    },
    {
      name: 'SolaredgeClient',
      format: 'umd',
      file: './lib/umd/solaredge-client.min.js',
      sourcemap: true,
      plugins: [terser({ output: { preamble: banner, comments: false } })],
    },
  ],
}
