
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Transaction, transactionSchema } from '../../shemas/transaction'
import { api } from '../../lib/newApi'

async function getTransactionsApi(
	moneyStackId: string
): Promise<Array<Transaction>> {
	const response = await api.get(`/transactions?moneyStackId=${moneyStackId}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
		},
	})

	return z.array(transactionSchema).parse(response.data)
}

export default function useTransactions(moneyStackId: string) {
	return useQuery({
		queryKey: ['transations'],
		queryFn: () => getTransactionsApi(moneyStackId),
	})
}