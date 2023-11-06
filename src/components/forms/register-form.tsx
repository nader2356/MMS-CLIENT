'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'


import { Loader2 } from 'lucide-react'

import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import useRegister from '../../hooks/mutations/use-register'


const registerFormSchema = z.object({
	name: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8),
})

export function RegisterForm() {
	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})

	const { mutate: register, isPending } = useRegister()

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		register(values)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input {...field} placeholder='name' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input {...field} placeholder='name@example.com' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input {...field} type='password' placeholder='********' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full'>
					{isPending ? (
						<Loader2 className='animate-spin' size={24} />
					) : (
						'Register'
					)}
				</Button>
			</form>
		</Form>
	)
}