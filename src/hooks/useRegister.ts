import { useMutation } from 'react-query'
import { z } from 'zod'
import Cookies from 'js-cookie'

import { useNavigate } from 'react-router-dom'
import api, { HTTPMethod } from '../lib/api'

const registerRequestSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

const registerResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})

export type RegisterRequest = z.infer<typeof registerRequestSchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>

const register = api<RegisterRequest, RegisterResponse>({
	method: HTTPMethod.POST,
	requestSchema: registerRequestSchema,
	responseSchema: registerResponseSchema,
})

function useRegister() {
	const navigate = useNavigate()

	return useMutation<RegisterResponse, unknown, RegisterRequest>({
		mutationKey: 'register',
		mutationFn: function (data) {
			return register('/auth/local/register', data)
		},
		onSuccess(data) {
			const { accessToken, refreshToken } = data

			localStorage.setItem('accessToken', accessToken)

			Cookies.set('refreshToken', refreshToken, {
				expires: 7,
				path: '/',
				sameSite: 'strict',
			})

			navigate('/')
		},
	})
}

export default useRegister