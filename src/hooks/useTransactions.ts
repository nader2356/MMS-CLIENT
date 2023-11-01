import { useQuery } from 'react-query'
import { z } from 'zod'

import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useRefresh from './useRefresh'
import { AxiosError } from 'axios'
import api, { HTTPMethod } from '../lib/api'

const transactionsRequestSchema = z.object({
	moneyStackId: z.string().optional(),
})
const transactionsResponseSchema = z.array(
	z.object({
		id: z.string(),
		title: z.string(),
		description: z.string().optional().nullable(),
		amount: z.number(),
		createdAt: z.string(),
		updatedAt: z.string(),
		userId: z.string(),
		moneyStackId: z.string(),
	})
)

export type TransactionsRequest = z.infer<typeof transactionsRequestSchema>
export type TransactionsResponse = z.infer<typeof transactionsResponseSchema>

const getTransactions = api<TransactionsRequest, TransactionsResponse>({
	method: HTTPMethod.GET,
	requestSchema: transactionsRequestSchema,
	responseSchema: transactionsResponseSchema,
})

function useTransactions(moneyStackId: string) {
	const navigate = useNavigate()

	const { mutate: refresh } = useRefresh()

	return useQuery({
		queryKey: ['transactions', moneyStackId],
		queryFn: function () {
			return getTransactions(
				'/transactions',
				{ moneyStackId },
				{
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				}
			)
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

export default useTransactions