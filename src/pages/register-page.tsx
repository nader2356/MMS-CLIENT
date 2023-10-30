import { RegisterForm } from '../components/forms/register-form'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardFooter,
	CardTitle,
} from '../components/ui/card'
import { Component } from 'lucide-react'

export default function RegisterPage() {
	return (
		<div className='flex justify-center items-center h-screen pb-40 md:pb-12'>
			<Card className='w-96 border-none shadow-none'>
				<CardHeader className='text-center'>
					<CardTitle>
						<Component className='mx-auto my-1' size={30} />
						Create an account
					</CardTitle>
					<CardDescription>
						Enter your email below to create your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<RegisterForm />
				</CardContent>
				<CardFooter>
					<CardDescription className='mx-auto text-center'>
						By clicking continue, you agree to our{' '}
						<span className='underline'>Terms of Service</span> and{' '}
						<span className='underline'>Privacy Policy</span>.
					</CardDescription>
				</CardFooter>
			</Card>
		</div>
	)
}