import FullPageSpinner from '../components/full-page-spinner'
import useMoneyStack from '../hooks/useMoneyStack'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { buttonVariants } from '../components/ui/button'
import { cn } from '../lib/utils'
import { ChevronLeft } from 'lucide-react'
import TransactionTable from '../components/transations-table'
import CreateTransactionDialog from '../components/dialogs/create-transaction-dialog'

export default function MoneyStackPage() {
	const { id } = useParams()

	if (!id) return <Navigate to='/' />

	const {
		data: moneyStack,
		isLoading: isLoadingMoneyStack,
		isSuccess: isSuccessMoneyStack,
	} = useMoneyStack(id)

	if (isLoadingMoneyStack) return <FullPageSpinner />

	if (!isSuccessMoneyStack) return <div>Failed</div>

	return (
		<main className='container grid place-content-center min-h-screen items-center'>
			<Link
				to='/'
				className={cn(
					buttonVariants({ variant: 'ghost' }),
					'fixed left-4 top-4 md:left-8 md:top-8'
				)}
			>
				<ChevronLeft className='mr-2 h-4 w-4' />
				Back
			</Link>
			<Card>
				<CardHeader className='py-2 flex flex-row items-center justify-between'>
					<div>Transactions</div>
					<CreateTransactionDialog moneyStack={moneyStack} />
				</CardHeader>
				<CardContent className='py-0'>
					<TransactionTable moneyStack={moneyStack} />
				</CardContent>
			</Card>
		</main>
	)
}