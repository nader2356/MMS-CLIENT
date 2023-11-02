import { useMutation, useQueryClient } from 'react-query'
import { z } from 'zod'

import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useRefresh from './useRefresh'
import { AxiosError } from 'axios'
import { MoneyStacksResponse} from './useMoneyStacks'
import api, { HTTPMethod } from '../lib/api'

const createMoneyStackRequestSchema = z.object({
	title: z.string(),
	description: z.string().optional().nullable(),
	initialAmount: z.number(),
})


const createMoneyStackResponseSchma = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional().nullable(),
	initialAmount: z.number(),
	previousAmount: z.number(),
	currentAmount: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
	userId: z.string(),
})

export type CreateMoneyStackRequest = z.infer<
	typeof createMoneyStackRequestSchema
>
export type CreateMoneyStackResponse = z.infer<
	typeof createMoneyStackResponseSchma
>

const createMoneyStack = api<CreateMoneyStackRequest, CreateMoneyStackResponse>(
	{
		method: HTTPMethod.POST,
		requestSchema: createMoneyStackRequestSchema,
		responseSchema: createMoneyStackResponseSchma,
	}
)

function useCreateMoneyStack() {
	const navigate = useNavigate()
	const { mutate: refresh } = useRefresh()

	const queryClient = useQueryClient()

	return useMutation<
	CreateMoneyStackResponse,
	unknown,
	CreateMoneyStackRequest
	>({
		mutationKey: 'createMoneyStack',
		mutationFn: function (newMoneyStack) {
			return createMoneyStack('/money-stacks',newMoneyStack, {
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
			})
		},
		onSuccess(newMoneyStack) {
			const oldData =
            queryClient.getQueryData<MoneyStacksResponse>('moneyStacks') || []	
            queryClient.setQueryData('moneyStacks', [...oldData, newMoneyStack])		
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

export default useCreateMoneyStack