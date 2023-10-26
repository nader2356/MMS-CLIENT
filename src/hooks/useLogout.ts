import { useMutation } from 'react-query'
import { z } from 'zod'
import Cookies from 'js-cookie'
import api, { HTTPMethod } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const LogoutRequest = z.void()

const LogoutResponse = z.void()

const logout = api<
	z.infer<typeof LogoutRequest>,
	z.infer<typeof LogoutResponse>
>({
	method: HTTPMethod.POST,
	path: '/auth/logout',
	requestSchema: LogoutRequest,
	responseSchema: LogoutResponse,
})

function useLogout() {
	const navigate = useNavigate()

	return useMutation({
		mutationKey: 'logout',
		mutationFn: logout,
		onSuccess() {
			localStorage.removeItem('accessToken')
			Cookies.remove('refreshToken')
			navigate('/auth')
		},
	})
}

export default useLogout