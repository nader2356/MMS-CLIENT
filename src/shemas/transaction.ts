import { z } from 'zod'

export const transactionSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional().nullable(),
	amount: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
	userId: z.string(),
})

export type Transaction = z.infer<typeof transactionSchema>