import { useQuery } from 'react-query'
import { z } from 'zod'

import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useRefresh from './useRefresh'
import { AxiosError } from 'axios'
import api, { HTTPMethod } from '../lib/api'

const moneyStackRequestSchema = z.void()
const moneyStackResponseSchema = z.object({
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

export type MoneyStackRequest = z.infer<typeof moneyStackRequestSchema>
export type MoneyStackResponse = z.infer<typeof moneyStackResponseSchema>

const getMoneyStack = api<MoneyStackRequest, MoneyStackResponse>({
	method: HTTPMethod.GET,
	requestSchema: moneyStackRequestSchema,
	responseSchema: moneyStackResponseSchema,
})

function useMoneyStack(id: string) {
	const navigate = useNavigate()

	const { mutate: refresh } = useRefresh()

	return useQuery({
		queryKey: ['moneyStack', id],
		queryFn: function () {
			return getMoneyStack(`/money-stacks/${id}`, undefined, {
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
			})
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		retry: false,
		staleTime: 1000 * 60 * 60 * 24, // 24 hours
		onError(err) {
			const refreshToken = Cookies.get('refreshToken')

			if (err instanceof AxiosError) {
				const status = err.response?.status

				if (status === 401 || status === 403) {
					if (refreshToken) {
						refresh()
						return
					}

					navigate('/auth')
				}
			}
		},
	})
}

export default useMoneyStack