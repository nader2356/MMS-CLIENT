import { useMutation } from 'react-query'
import { z } from 'zod'
import Cookies from 'js-cookie'
import api, { HTTPMethod } from '@/lib/api'
import { useNavigate } from 'react-router-dom'

const RegisterRequest = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

const RegisterResponse = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})

const register = api<
	z.infer<typeof RegisterRequest>,
	z.infer<typeof RegisterResponse>
>({
	method: HTTPMethod.POST,
	path: '/auth/local/register',
	requestSchema: RegisterRequest,
	responseSchema: RegisterResponse,
})

function useRegister() {
	const navigate = useNavigate()

	return useMutation({
		mutationKey: 'register',
		mutationFn: register,
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