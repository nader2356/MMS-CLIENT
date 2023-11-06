
import { useQuery } from '@tanstack/react-query'
import { User, userSchema } from '../../shemas/user'
import { api } from '../../lib/newApi'

async function getUserMeApi(): Promise<User> {
	const response = await api.get('/users/me', {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
		},
	})

	return userSchema.parse(response.data)
}

export default function useUserMe() {
	return useQuery({
		queryKey: ['userMe'],
		queryFn: getUserMeApi,
	})
}