import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'


import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Form } from 'react-router-dom'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

export function LoginForm() {
	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof loginFormSchema>) {
		console.log({ values })
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
					Sign in
				</Button>
			</form>
		</Form>
	)
                    }