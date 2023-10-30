
import { createContext } from 'react'
import { useQueryClient } from 'react-query'
import useUserMe from '../hooks/useUserMe'
import FullPageSpinner from '../components/full-page-spinner'

type User = {
	id: string
	email: string
	name: string
	createdAt: string
	updatedAt: string
}

type AuthContextType = {
	user: User
	clearUserMe: () => void
	
}

const AuthContext = createContext<AuthContextType>({
	user: {} as User,
	clearUserMe: () => {},
	
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const {
		data: userMe,
		isLoading: isLoadingUserMe,
		isSuccess: isSuccessUserMe,
	} = useUserMe()


	const queryClient = useQueryClient()

	function clearUserMe() {
		queryClient.setQueryData('userMe', null)
	}

	
	if (isLoadingUserMe) {
		return <FullPageSpinner />
	}
	if (!isSuccessUserMe) return null

	return (
		<AuthContext.Provider value={{ user: userMe, clearUserMe }}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContext