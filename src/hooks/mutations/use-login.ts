import { Tokens, tokensSchema } from '../../shemas/tokens'
import { api } from '../../lib/newApi'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const loginRequestSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

type LoginRequest = z.infer<typeof loginRequestSchema>

async function loginApi(data: LoginRequest): Promise<Tokens> {
	const response = await api.post('/auth/local/login', data)

	return tokensSchema.parse(response.data)
}

export default function useLogin() {
	const navigate = useNavigate()

	return useMutation({
		mutationKey: ['login'],
		mutationFn: loginApi,
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