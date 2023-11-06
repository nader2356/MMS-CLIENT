
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '../../lib/newApi'
import { moneyStackSchema } from '../../shemas/money-stack'

const createMoneyStackRequestSchema = z.object({
	title: z.string(),
	description: z.string().optional().nullable(),
	initialAmount: z.number(),
})

type CreateMoneyStackRequest = z.infer<typeof createMoneyStackRequestSchema>

async function createMoneyStackApi(data: CreateMoneyStackRequest) {
	const response = await api.post('/money-stacks', data, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
		},
	})

	return moneyStackSchema.parse(response.data)
}

export default function useCreateMoneyStack() {
	return useMutation({
		mutationKey: ['createMoneyStack'],
		mutationFn: createMoneyStackApi,
	})
}