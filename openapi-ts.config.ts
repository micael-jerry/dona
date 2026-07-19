import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
	input: 'https://dona-api-theta.vercel.app/swagger/json',
	output: 'client',
	plugins: ['@hey-api/client-axios'],
});
