import { useQuery } from 'react-query'
import { z } from 'zod'

import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useRefresh from './useRefresh'
import api, { HTTPMethod } from '../lib/api'
import { AxiosError } from 'axios'

const userMeRequestSchema = z.void()
const userMeResponseSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
})

export type UserMeRequest = z.infer<typeof userMeRequestSchema>
export type UserMeResponse = z.infer<typeof userMeResponseSchema>

const userMe = api<UserMeRequest, UserMeResponse>({
	method: HTTPMethod.GET,
	requestSchema: userMeRequestSchema,
	responseSchema: userMeResponseSchema,
})

function useUserMe() {
	const navigate = useNavigate()

	const { mutate: refresh } = useRefresh()

	return useQuery({
		queryKey: ['userMe', localStorage.getItem('accessToken')],
		queryFn: function () {
			return userMe('/users/me', undefined, {
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

export default useUserMe