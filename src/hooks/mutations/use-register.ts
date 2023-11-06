
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { Tokens, tokensSchema } from '../../shemas/tokens'
import { api } from '../../lib/newApi'

const registerRequestSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
})

type RegisterRequest = z.infer<typeof registerRequestSchema>

async function registerApi(data: RegisterRequest): Promise<Tokens> {
	const response = await api.post('/auth/local/register', data)

	return tokensSchema.parse(response.data)
}

export default function useRegister() {
	const navigate = useNavigate()

	return useMutation<Tokens, unknown, RegisterRequest>({
		mutationKey: ['register'],
		mutationFn: registerApi,
		onSuccess(data) {
			const { accessToken, refreshToken } = data

			localStorage.setItem('accessToken', accessToken)

			Cookies.remove('refreshToken')
			Cookies.set('refreshToken', refreshToken, {
				expires: 7,
				path: '/',
				sameSite: 'strict',
			})

			navigate('/')
		},
	})

}