import { useMutation, useQueryClient } from 'react-query'
import { z } from 'zod'

import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useRefresh from './useRefresh'
import { AxiosError } from 'axios'
import { MoneyStacksResponseType } from './useMoneyStacks'
import api, { HTTPMethod } from '../lib/api'

const CreateMoneyStackRequest = z.object({
	title: z.string(),
	description: z.string().optional().nullable(),
	initialAmount: z.number(),
})

export type CreateMoneyStackRequestType = z.infer<
	typeof CreateMoneyStackRequest
>

const CreateMoneyStackResponse = z.object({
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

export type CreateMoneyStackResponseType = z.infer<
	typeof CreateMoneyStackResponse
>

const createMoneyStack = api<
	CreateMoneyStackRequestType,
	CreateMoneyStackResponseType
>({
	method: HTTPMethod.POST,
	path: '/money-stacks',
	requestSchema: CreateMoneyStackRequest,
	responseSchema: CreateMoneyStackResponse,
})

function useCreateMoneyStack() {
	const navigate = useNavigate()
	const { mutate: refresh } = useRefresh()

	const queryClient = useQueryClient()

	return useMutation<
		CreateMoneyStackResponseType,
		unknown,
		CreateMoneyStackRequestType
	>({
		mutationKey: 'createMoneyStack',
		mutationFn: function (newMoneyStack) {
			return createMoneyStack(newMoneyStack, {
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
			})
		},
		onSuccess(newMoneyStack) {
			const oldData =
				queryClient.getQueryData<MoneyStacksResponseType>('moneyStacks') || []

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