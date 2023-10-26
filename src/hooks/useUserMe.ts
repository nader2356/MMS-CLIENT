import { useQuery } from 'react-query'
import { z } from 'zod'

import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useRefresh from './useRefresh'
import api, { HTTPMethod } from '../lib/api'

const UserMeRequest = z.void()

const UserMeResponse = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
})

const userMe = api<
	z.infer<typeof UserMeRequest>,
	z.infer<typeof UserMeResponse>
>({
	method: HTTPMethod.GET,
	path: '/users/me',
	requestSchema: UserMeRequest,
	responseSchema: UserMeResponse,
})

function useUserMe() {
	const navigate = useNavigate()

	const { mutate: refresh } = useRefresh()

	return useQuery({
		queryKey: 'userMe',
		queryFn: function () {
			return userMe(undefined, {
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
			})
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		retry: false,
		staleTime: 1000 * 60 * 60 * 24, // 24 hours
		onError() {
			const refreshToken = Cookies.get('refreshToken')

			if (refreshToken) {
				refresh()
				return
			}

			navigate('/auth')
		},
	})
}

export default useUserMe