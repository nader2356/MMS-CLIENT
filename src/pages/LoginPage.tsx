

import { Component } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { LoginForm } from '../components/forms/login'

export default function LoginPage() {
	return (
		<div className='flex justify-center items-center h-screen pb-40 md:pb-12'>
			<Card className='w-96 border-none shadow-none'>
				<CardHeader className='text-center'>
					<CardTitle>
						<Component className='mx-auto my-1' size={30} />
						Welcome back!
					</CardTitle>
					<CardDescription>
						Enter your email and password to sign in to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginForm />
				</CardContent>
			</Card>
		</div>
	)
}