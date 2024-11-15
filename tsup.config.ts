import { defineConfig } from 'tsup'

export default defineConfig(() => ({
    entry: ['src/main.ts'],
    clean: true,
    splitting: false,
    format: 'esm',
    treeshake: true,
    minify: true,
}))
