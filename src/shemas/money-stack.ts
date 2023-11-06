import { z } from 'zod'

export const moneyStackSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	initialAmount: z.number(),
	previousAmount: z.number(),
	currentAmount: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
	userId: z.string(),
})

export type MoneyStack = z.infer<typeof moneyStackSchema>