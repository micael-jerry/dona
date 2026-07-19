import { client } from '@/client/client.gen';

client.setConfig({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dona-api-theta.vercel.app',
});

export * from '@/client';
export { client };
