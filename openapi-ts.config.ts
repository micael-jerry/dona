import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
	// input: 'https://dona-api-theta.vercel.app/swagger/json',
	input: 'http://localhost:8080/swagger/json',
	output: 'client',
	plugins: ['@hey-api/client-axios'],
});
