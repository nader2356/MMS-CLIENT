import FullPageSpinner from '../components/full-page-spinner'
import useMoneyStack from '../hooks/useMoneyStack'
import { Navigate, useParams } from 'react-router-dom'

import { Card, CardContent, CardHeader } from '../components/ui/card'
import TransactionTable from '../components/transations-table'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'

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
		<main className='container py-40 flex flex-col items-center'>
			<Card>
				<CardHeader className='py-2 flex flex-row items-center justify-between'>
					<div>Transactions</div>
					<Button variant='ghost'>
						<Plus />
					</Button>
				</CardHeader>
				<CardContent className='py-0'>
					<TransactionTable moneyStack={moneyStack} />
				</CardContent>
			</Card>
		</main>
	)
}