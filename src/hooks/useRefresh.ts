import { useMutation } from 'react-query'
import { z } from 'zod'
import Cookies from 'js-cookie'
import api, { HTTPMethod } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'
import { AxiosError } from 'axios'


const refreshRequestSchema = z.void()
const refreshResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})

export type RefreshResquest = z.infer<typeof refreshRequestSchema>
export type RefreshResponse = z.infer<typeof refreshResponseSchema>

const refresh = api<RefreshResquest, RefreshResponse>({
	method: HTTPMethod.POST,
	requestSchema: refreshRequestSchema,
	responseSchema: refreshResponseSchema,
})

function useRefresh() {
	const navigate = useNavigate()
	const { clearUserMe } = useContext(AuthContext)

	return useMutation({
		mutationKey: 'refresh',
		mutationFn: function () {
			return refresh('/auth/refresh', undefined, {
				Authorization: `Bearer ${Cookies.get('refreshToken')}`,
			})
		},
			onSuccess(data) {
				const { accessToken, refreshToken } = data
	
				localStorage.setItem('accessToken', accessToken)
	
				Cookies.remove('refreshToken')
				Cookies.set('refreshToken', refreshToken, {
					expires: 7,
					path: '/',
					sameSite: 'strict',
				})
			},
			onError(error) {
				if (error instanceof AxiosError) {
					clearUserMe()
					navigate('/auth')
				}
			},
		
	})
}

export default useRefresh