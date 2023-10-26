import { Loader2 } from 'lucide-react'
import { Suspense, lazy } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

const LoginPage = lazy(() => import('./pages/LoginPage'))

function FullPageSpinner() {
	return (
		<div className='flex justify-center items-center h-screen'>
			<Loader2 className='animate-spin' size={64} />
		</div>
	)
}

function BlankLayout() {
	return <Outlet />
}

function App() {
	
	return (
		<Suspense fallback={<FullPageSpinner />}>
			<Routes>
				<Route index element={<h1>Home</h1>} />
				<Route path='/auth' element={<BlankLayout />}>
					<Route index element={<Navigate to='/auth/login' />} />
					<Route path='login' element={<LoginPage />} />
				</Route>
			</Routes>
		</Suspense>
	)
}

export default App