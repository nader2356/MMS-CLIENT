'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import useCreateMoneyStack from '@/hooks/useCreateMoneyStack'
import React, { SetStateAction } from 'react'

const createMoneyStack = z.object({
	title: z.string().min(3),
	description: z.string().optional(),
	initialAmount: z.number().min(4),
})

type Props = {
	setIsShowDialog: React.Dispatch<SetStateAction<boolean>>
}

export function CreateMoneyStackForm({ setIsShowDialog }: Props) {
	const form = useForm<z.infer<typeof createMoneyStack>>({
		resolver: zodResolver(createMoneyStack),
		defaultValues: {
			title: '',
			description: '',
			initialAmount: 0,
		},
	})

	const { mutate: createMoneyStackFn, isLoading: isLoadingCreateMoneyStack } =
		useCreateMoneyStack()

	async function onSubmit(values: z.infer<typeof createMoneyStack>) {
		createMoneyStackFn(values)
		setIsShowDialog(false)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input {...field} required placeholder='Title' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input {...field} placeholder='Description' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='initialAmount'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									{...field}
									type='number'
									placeholder='1000'
									required
									onChange={(e) => {
										const numericValue = parseFloat(e.target.value)
										field.onChange(numericValue)
									}}
								/>
							</FormControl>
							<FormDescription>
								Please add the money amount in millimes (1dt = 1000).
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full'>
					{isLoadingCreateMoneyStack ? (
						<Loader2 className='animate-spin' size={24} />
					) : (
						'Create money stack'
					)}
				</Button>
			</form>
		</Form>
	)
}