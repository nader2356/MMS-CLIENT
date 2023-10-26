
import { createContext } from 'react'
import { useQueryClient } from 'react-query'
import useUserMe from '../hooks/useUserMe'
import FullPageSpinner from '../components/FullPageSpinner'

type User = {
	id: string
	email: string
	name: string
	createdAt: string
	updatedAt: string
}

type AuthContextType = {
	user?: User
	clearUserMe: () => void
	invalidateUserMe: () => void
}

const AuthContext = createContext<AuthContextType>({
	user: undefined,
	clearUserMe: () => {},
	invalidateUserMe: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data: userMe, isLoading: isLoadingUserMe } = useUserMe()

	const queryClient = useQueryClient()

	function clearUserMe() {
		queryClient.setQueryData('userMe', null)
	}

	function invalidateUserMe() {
		queryClient.invalidateQueries('userMe')
	}

	if (isLoadingUserMe) {
		return <FullPageSpinner />
	}

	return (
		<AuthContext.Provider
			value={{ user: userMe, clearUserMe, invalidateUserMe }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContext