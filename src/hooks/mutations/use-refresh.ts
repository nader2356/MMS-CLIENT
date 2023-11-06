import { Tokens, tokensSchema } from '../../shemas/tokens'
import { api } from '../../lib/newApi'
import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export async function refreshApi(): Promise<Tokens> {
	const response = await api.post('/auth/refresh', undefined, {
		headers: {
			Authorization: `Bearer ${Cookies.get('refreshToken')}`,
		},
	})

	return tokensSchema.parse(response.data)
}

export default function useRefresh() {
	const navigate = useNavigate()

	return useMutation<Tokens>({
		mutationKey: ['refresh'],
		mutationFn: refreshApi,
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