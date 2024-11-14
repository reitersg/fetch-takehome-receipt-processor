import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
    entry: ['src/main.ts'],
    clean: true,
    splitting: false,
    format: 'cjs',
    treeshake: true,
    minify: true,
}))