'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Loader2 } from 'lucide-react'

import React, { SetStateAction } from 'react'
import { Form } from 'react-router-dom'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import useCreateMoneyStack from '../../hooks/useCreateMoneyStack'
import { Textarea } from '../ui/textarea'

const createMoneyStack = z.object({
	title: z.string().min(3),
	description: z.string().optional(),
	initialAmount: z.number().min(10).positive(),
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
			initialAmount: 100,
		},
	})

	const { mutate: createMoneyStackFn, isLoading: isLoadingCreateMoneyStack } =
		useCreateMoneyStack()

	async function onSubmit(values: z.infer<typeof createMoneyStack>) {
		createMoneyStackFn({
			...values,
			initialAmount: values.initialAmount * 1000,
		})
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
                             <Textarea {...field} placeholder='Description' />
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
                              Please add the money amount in DT (e.g., 1000DT).
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