import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	eslintPluginPrettierRecommended,
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
				},
				{
					selector: 'function',
					format: ['camelCase', 'PascalCase'],
				},
				{
					selector: 'parameter',
					format: ['camelCase', 'PascalCase'],
				},
				{
					selector: 'class',
					format: ['PascalCase'],
				},
			],
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
		},
	},
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
		'client/**',
	]),
]);

export default eslintConfig;
