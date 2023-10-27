import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import { z } from 'zod'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Mutation, MutationCache, Query, QueryCache, QueryClient, QueryClientProvider, QueryKey } from 'react-query';
import { AxiosError } from 'axios';
import { Toaster, toast } from 'sonner'



// eslint-disable-next-line react-refresh/only-export-components
const ErrorSchema = z.object({
	message: z.union([z.string(), z.array(z.string())]),
	error: z.string(),
	statusCode: z.number(),
})

const handleAxiosError = (error: AxiosError) => {
	if (error instanceof AxiosError) {
		const parsedError = ErrorSchema.safeParse(error.response?.data)

if (parsedError.success) {
  if (Array.isArray(parsedError.data.message)) {
    return toast.error(parsedError.data.message.join('\n'))
  }
return toast.error(parsedError.data.message)
		}
	}
}


const queryClient = new QueryClient({
	mutationCache: new MutationCache({
		onError: handleAxiosError as (
			error: unknown,
			variables: unknown,
			context: unknown,
			mutation: Mutation<unknown, unknown, unknown, unknown>
		) => void,
	}),
	queryCache: new QueryCache({
		onError: handleAxiosError as (
			error: unknown,
			query: Query<unknown, unknown, unknown, QueryKey>
		) => void,
	}),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Toaster />
				<App />
			</QueryClientProvider>
		</BrowserRouter>
	</React.StrictMode>
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
