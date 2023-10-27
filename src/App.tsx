import { Loader2 } from 'lucide-react'
import { Suspense, lazy } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

const LoginPage = lazy(() => import('./pages/login-page'))
const RegisterPage = lazy(() => import('./pages/register-page'))
const HomePage = lazy(() => import('./pages/home-page'))

function FullPageSpinner() {
	return (
		<div className='flex justify-center items-center h-screen'>
			<Loader2 className='animate-spin' size={64} />
		</div>
	)
}
function requireAuth(component: React.ReactNode) {
	return <AuthProvider>{component}</AuthProvider>
}

function BlankLayout() {
	return <Outlet />
}

function App() {
	
	return (
		<Suspense fallback={<FullPageSpinner />}>
			<Routes>
			<Route index element={requireAuth(<HomePage />)} />
				<Route path='/auth' element={<BlankLayout />}>
					<Route index element={<Navigate to='/auth/login' />} />
					<Route path='login' element={<LoginPage />} />
				</Route>
			</Routes>
		</Suspense>
	)
}

export default App