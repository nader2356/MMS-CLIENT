import { useQuery } from 'react-query'
import { z } from 'zod'

import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useRefresh from './useRefresh'
import { AxiosError } from 'axios'
import api, { HTTPMethod } from '../lib/api'

const MoneyStacksRequest = z.void()

export const MoneyStacksResponse = z.array(
	z.object({
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
)

export type MoneyStackRequestType = z.infer<typeof MoneyStacksRequest>
export type MoneyStacksResponseType = z.infer<typeof MoneyStacksResponse>

const getMoneyStacks = api<MoneyStackRequestType, MoneyStacksResponseType>({
	method: HTTPMethod.GET,
	path: '/money-stacks',
	requestSchema: MoneyStacksRequest,
	responseSchema: MoneyStacksResponse,
})

function useMoneyStacks() {
	const navigate = useNavigate()

	const { mutate: refresh } = useRefresh()

	return useQuery({
		queryKey: 'moneyStacks',
		queryFn: function () {
			return getMoneyStacks(undefined, {
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

export default useMoneyStacks