import { useMutation } from 'react-query'
import { z } from 'zod'
import Cookies from 'js-cookie'
import api, { HTTPMethod } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const logoutRequestSchema = z.void()
const logoutResponseSchema = z.void()


export type LogoutRequest = z.infer<typeof logoutRequestSchema>
export type LogoutResponse = z.infer<typeof logoutResponseSchema>

const logout = api<LogoutRequest, LogoutResponse>({
	method: HTTPMethod.POST,
	requestSchema: logoutRequestSchema,
	responseSchema: logoutResponseSchema,
})

function useLogout() {
	const navigate = useNavigate()

	return useMutation({
		mutationKey: 'logout',
		mutationFn: function () {
			return logout('/auth/logout')
		},
		onSuccess() {
			localStorage.removeItem('accessToken')
			Cookies.remove('refreshToken')
			navigate('/auth')
		},
	})
}

export default useLogout