import { Loader2 } from 'lucide-react'
import { Suspense, lazy } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import FullPageSpinner from './components/full-page-spinner'

import MoneyStackPage from './pages/money-stack-page'
const LoginPage = lazy(() => import('./pages/login-page'))
const RegisterPage = lazy(() => import('./pages/register-page'))
const HomePage = lazy(() => import('./pages/home-page'))




function MainLayout() {
	return (
		<AuthProvider>
	
			<Outlet />
		</AuthProvider>
	)
}

function BlankLayout() {
	return <Outlet />
}

function App() {
	
	return (
		<Suspense fallback={<FullPageSpinner />}>
			<Routes>
				<Route path='/' element={<BlankLayout />}>
				  <Route index element={<HomePage />} />
				  <Route path='money-stacks/:id' element={<MoneyStackPage />} />
				</Route>
				<Route path='/auth' element={<BlankLayout />}>
					<Route index element={<Navigate to='/auth/login' />} />
					<Route path='login' element={<LoginPage />} />
					<Route path='register' element={<RegisterPage />} />
				</Route>
			</Routes>
		</Suspense>
	)
}

export default App