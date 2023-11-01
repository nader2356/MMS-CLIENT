import useTransactions, { TransactionsResponse } from '../hooks/useTransactions'
import FullPageSpinner from './full-page-spinner'


import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '../components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import DataTable from './data-table'
import { MoneyStackResponse } from '../hooks/useMoneyStack'
import { formatDateString, formatMoney } from '../lib/utils'
import { ColumnDef } from '@tanstack/react-table'

type Props = {
	moneyStack: MoneyStackResponse
}

export default function TransactionTable({ moneyStack }: Props) {
	const {
		data: transactions,
		isLoading: isLoadingTransactions,
		isSuccess: isSuccessTransactions,
	} = useTransactions(moneyStack.id)

	if (isLoadingTransactions) {
		return <FullPageSpinner />
	}

	if (!isSuccessTransactions) return <div>Failed</div>

	const isShowPrevAmount =
		moneyStack.previousAmount !== moneyStack.currentAmount

	return (
		<DataTable columns={columns} data={transactions}>
			<Button variant='outline' disabled className='!opacity-100'>
				{isShowPrevAmount && (
					<>
						<span className='line-through opacity-50 text-xs'>
							{formatMoney(moneyStack.previousAmount)}
						</span>
						<ChevronRight className='w-4 h-4 opacity-75' />
					</>
				)}
				<span className='opacity-100'>
					{formatMoney(moneyStack.currentAmount)}
				</span>
			</Button>
		</DataTable>
	)
}
          
const columns: ColumnDef<TransactionsResponse[number]>[] = [
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		accessorFn: function ({ amount }) {
			return formatMoney(amount)
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Creation Date',
		accessorFn: function ({ createdAt }) {
			return formatDateString(createdAt)
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const payment = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(payment.id)}
						>
							Copy payment ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View customer</DropdownMenuItem>
						<DropdownMenuItem>View payment details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]