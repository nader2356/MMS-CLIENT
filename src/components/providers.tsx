import useGetQueryClient from '../hooks/use-get-query-client'
import { QueryClientProvider } from '@tanstack/react-query'

type Props = {
	children: JSX.Element
}

export function Providers({ children }: Props) {
	return (
		<QueryClientProvider client={useGetQueryClient()}>
			{children}
		</QueryClientProvider>
	)
}