import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		ignores: [
			'node_modules/**',
			'.svelte-kit/**',
			'build/**',
			'package/**',
			'.env',
			'.env.*',
			'!.env.example',
			'vite.config.js.timestamp-*',
			'src/lib/components/ui/**',
			'drizzle/**'
		],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		plugins: {
			'simple-import-sort': simpleImportSort
		},
		rules: {
			'no-undef': 'off',
			'max-lines': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
			'no-console': 'warn',
			'simple-import-sort/imports': 'warn',
			'simple-import-sort/exports': 'warn',
			'@typescript-eslint/sort-type-constituents': 'warn'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		ignores: ['eslint.config.js', 'svelte.config.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		files: ['src/lib/components/ui/**/*.svelte'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off'
		}
	},
	{
		files: ['src/routes/+page.svelte'],
		rules: {
			'max-lines': 'off'
		}
	}
);
