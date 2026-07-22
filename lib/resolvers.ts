import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver, FieldValues } from 'react-hook-form';
import type { ZodType } from 'zod';

/**
 * Type-safe bridge between Zod v4 schemas and @hookform/resolvers (typed against Zod v3).
 * The incompatibility is a TypeScript-level mismatch only — Zod v4 is structurally
 * compatible at runtime. The cast is isolated here so all consumer code stays `any`-free.
 */
export function zodV4Resolver<TFieldValues extends FieldValues>(schema: ZodType<TFieldValues>): Resolver<TFieldValues> {
	// The cast from ZodType (v4) to ZodType (v3 shape) is intentional and contained.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return zodResolver(schema as any) as Resolver<TFieldValues>;
}
