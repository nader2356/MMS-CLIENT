
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { api } from '../../lib/newApi'
import { transactionSchema } from '../../shemas/transaction'

const createTransactionSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	amount: z.number().min(10),
	moneyStackId: z.string(),
})

type CreateTransaction = z.infer<typeof createTransactionSchema>

async function createTransaction(data: CreateTransaction) {
	const response = await api.post('/transactions', data, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
		},
	})

	return transactionSchema.parse(response.data)
}

export default function useCreateTransaction() {
	return useMutation({
		mutationKey: ['createTransaction'],
		mutationFn: createTransaction,
	})
}