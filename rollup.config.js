import typescript from '@rollup/plugin-typescript'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      name: 'SolaredgeClient',
      format: 'umd',
      sourcemap: true,
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  plugins: [
    resolve({
      mainFields: ['browser', 'module', 'main'],
    }),
    typescript({
      tsconfig: false,
      target: 'ES2018',
      module: 'ES2015',
      esModuleInterop: true,
    }),
    commonjs({
      ignoreGlobal: true,
    }),
  ],
}

// export default {
//   input: 'src/index.ts',
//   output: [
//     {
//       file: pkg.main,
//       name: 'SolaredgeClient',
//       format: 'umd',
//       sourcemap: true,
//     },
//     { file: pkg.module, format: 'es', sourcemap: true },
//   ],
//   plugins: [
//     // Compile TypeScript files
//     typescript({
//       tsconfig: './tsconfig.json',
//     }),
//     // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
//     commonjs({
//       // extensions: ['.js', '.ts'],
//     }),
//     // // Allow node_modules resolution, so you can use 'external' to control
//     // // which external modules to include in the bundle
//     // // https://github.com/rollup/rollup-plugin-node-resolve#usage
//     // resolve(),
//
//     // Resolve source maps to the original source
//     sourceMaps(),
//   ],
// }
