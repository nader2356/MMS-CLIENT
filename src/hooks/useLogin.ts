import { useMutation } from 'react-query'
import { z } from 'zod'
import Cookies from 'js-cookie'
import api, { HTTPMethod } from '../lib/api'


const LoginRequest = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

const LoginResponse = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})

const login = api<z.infer<typeof LoginRequest>, z.infer<typeof LoginResponse>>({
	method: HTTPMethod.POST,
	path: '/auth/local/login',
	requestSchema: LoginRequest,
	responseSchema: LoginResponse,
})

function useLogin() {
	return useMutation({
		mutationKey: 'login',
		mutationFn: login,
		onSuccess(data) {
			const { accessToken, refreshToken } = data

			localStorage.setItem('accessToken', accessToken)

			Cookies.set('refreshToken', refreshToken, {
				expires: 7,
				path: '/',
				sameSite: 'strict',
			})
		},
	})
}

export default useLogin