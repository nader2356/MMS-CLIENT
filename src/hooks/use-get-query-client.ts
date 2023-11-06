import {
	Mutation,
	MutationCache,
	Query,
	QueryCache,
	QueryClient,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { toast } from 'sonner'

import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { refreshApi } from './mutations/use-refresh'
import { errorSchema } from '../shemas/error'

let isRefreshing = false

export default function useGetQueryClient() {
	const navigate = useNavigate()

	const handleAuthenticationError = async ({
		query,
		mutation,
	}: {
		query?: Query
		mutation?: Mutation
	}) => {
		try {
			if (!isRefreshing) {
				isRefreshing = true
				const { accessToken, refreshToken } = await refreshApi()
				localStorage.setItem('accessToken', accessToken)
				Cookies.remove('refreshToken')
				Cookies.set('refreshToken', refreshToken, {
					expires: 7,
					path: '/',
					sameSite: 'Strict',
				})
				isRefreshing = false
				query?.fetch()
				mutation?.continue()
			}
		} catch (err) {
			isRefreshing = false
			navigate('/auth')
		}
	}

	const handleApiError = (error: AxiosError) => {
		const parsed = errorSchema.safeParse(error.response?.data)
		if (parsed.success) {
			const errorMessage = Array.isArray(parsed.data.message)
				? parsed.data.message.join('\n')
				: parsed.data.message
			toast.error(errorMessage)
		}
	}

	const handleError = async ({
		error,
		query,
		mutation,
	}: {
		error: AxiosError
		query?: Query
		mutation?: Mutation
	}) => {
		const status = error.response?.status
		if (status === 401 || status === 403) {
			handleAuthenticationError({ query, mutation })
		} else {
			handleApiError(error)
		}
	}

	return new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				refetchOnMount: false,
				refetchOnReconnect: false,
				retry: false,
				staleTime: 1000 * 60 * 60 * 24,
			},
		},
		queryCache: new QueryCache({
			onError: (error, query) => {
				if (error instanceof AxiosError) {
					handleError({ error, query: query as Query })
				}
			},
		}),
		mutationCache: new MutationCache({
			onError: (error, _, __, mutation) => {
				if (error instanceof AxiosError) {
					handleError({ error, mutation: mutation as Mutation })
				}
			},
		}),
	})
}