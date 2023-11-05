'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Loader2 } from 'lucide-react'
import React, { SetStateAction } from 'react'

import { useQueryClient } from 'react-query'
import { MoneyStackResponse } from '../../hooks/useMoneyStack'
import useCreateTransaction from '../../hooks/useCreateTransaction'
import { TransactionsResponse } from '../../hooks/useTransactions'
import { Form } from 'react-router-dom'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'


const createTransactionSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	amount: z.number().min(0.1),
})

type Props = {
	setIsShowDialog: React.Dispatch<SetStateAction<boolean>>
	moneyStack: MoneyStackResponse
}

export function CreateTransactionForm({ setIsShowDialog, moneyStack }: Props) {
	const form = useForm<z.infer<typeof createTransactionSchema>>({
		resolver: zodResolver(createTransactionSchema),
		defaultValues: {
			title: '',
			description: '',
			amount: 0.1,
		},
	})

	const {
		mutateAsync: createTransactionAsync,
		isLoading: isLoadingCreateTransaction,
	} = useCreateTransaction()

	const queryClient = useQueryClient()

	async function onSubmit(values: z.infer<typeof createTransactionSchema>) {
		try {
			const newTransaction = await createTransactionAsync({
				...values,
				amount: values.amount * 1000,
				moneyStackId: moneyStack.id,
			})

			const transactionsQueryKey = ['transactions', moneyStack.id]
			const moneyStackQueryKey = ['moneyStack', moneyStack.id]

			const oldTransactionsData =
				queryClient.getQueryData<TransactionsResponse>(transactionsQueryKey)

			if (oldTransactionsData) {
				queryClient.setQueryData(transactionsQueryKey, [
					...oldTransactionsData,
					newTransaction,
				])
			}

			const oldMoneyStackData =
				queryClient.getQueryData<MoneyStackResponse>(moneyStackQueryKey)

			if (oldMoneyStackData) {
				const { currentAmount } = oldMoneyStackData

				queryClient.setQueryData(moneyStackQueryKey, {
					...oldMoneyStackData,
					previousAmount: currentAmount,
					currentAmount: currentAmount - newTransaction.amount,
				})
			}

			setIsShowDialog(false)
		} catch (err) {
			setIsShowDialog(false)
		}
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
					name='amount'
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
								Please add the money amount in DT (e.g., 10DT).
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full'>
					{isLoadingCreateTransaction ? (
						<Loader2 className='animate-spin' size={24} />
					) : (
						'Create money stack'
					)}
				</Button>
			</form>
		</Form>
	)
                    }