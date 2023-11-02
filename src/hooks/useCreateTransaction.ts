import { useMutation } from 'react-query'
import { z } from 'zod'

import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useRefresh from './useRefresh'
import { AxiosError } from 'axios'
import api, { HTTPMethod } from '../lib/api'

const createTransactionRequest = z.object({
	title: z.string(),
	description: z.string().optional(),
	amount: z.number().min(10),
	moneyStackId: z.string(),
})
const createTransactionResponse = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional().nullable(),
	amount: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
	userId: z.string(),
	moneyStackId: z.string(),
})

export type CreateTransactionRequest = z.infer<typeof createTransactionRequest>
export type CreateTransactionResponse = z.infer<
	typeof createTransactionResponse
>

const createMoneyStack = api<
	CreateTransactionRequest,
	CreateTransactionResponse
>({
	method: HTTPMethod.POST,
	requestSchema: createTransactionRequest,
	responseSchema: createTransactionResponse,
})

function useCreateTransaction() {
	const navigate = useNavigate()
	const { mutate: refresh } = useRefresh()

	return useMutation<
		CreateTransactionResponse,
		unknown,
		CreateTransactionRequest
	>({
		mutationKey: 'createTransaction',
		mutationFn: function (newTransactions) {
			return createMoneyStack('/transactions', newTransactions, {
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
			})
		},
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

export default useCreateTransaction