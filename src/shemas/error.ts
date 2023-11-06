import { z } from 'zod'

export const errorSchema = z.object({
	message: z.union([z.string(), z.array(z.string())]),
	error: z.string(),
	statusCode: z.number(),
})

export type Error = z.infer<typeof errorSchema>