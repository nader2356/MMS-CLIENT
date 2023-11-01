import { useMutation } from 'react-query'
import { z } from 'zod'
import Cookies from 'js-cookie'
import api, { HTTPMethod } from '../lib/api'


const loginRequestSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

const loginResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})

export type LoginRequest = z.infer<typeof loginRequestSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>

const login = api<LoginRequest, LoginResponse>({
	method: HTTPMethod.POST,
	requestSchema: loginRequestSchema,
	responseSchema: loginResponseSchema,
})

function useLogin() {
	return useMutation<LoginResponse, unknown, LoginRequest>({
		mutationKey: 'login',
		mutationFn: function (data) {
			return login('/auth/local/login', data)
		},
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