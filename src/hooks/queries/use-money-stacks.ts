
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { MoneyStack, moneyStackSchema } from '../../shemas/money-stack'
import { api } from '../../lib/newApi'

async function getMoneyStacksApi(): Promise<Array<MoneyStack>> {
	const response = await api.get('/money-stacks', {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
		},
	})

	return z.array(moneyStackSchema).parse(response.data)
}

export default function useMoneyStacks() {
	return useQuery({
		queryKey: ['moneyStacks'],
		queryFn: getMoneyStacksApi,
	})
}