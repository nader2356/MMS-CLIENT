
import { buttonVariants } from '../ui/button'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CreateTransactionForm } from '../forms/create-transation-form'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { MoneyStack } from '../../shemas/money-stack'


type Props = {
	moneyStack: MoneyStack
}

export default function CreateTransactionDialog({ moneyStack }: Props) {
	const [isShowDialog, setIsShowDialog] = useState(false)

	return (
		<Dialog open={isShowDialog} onOpenChange={setIsShowDialog}>
			<DialogTrigger
				className={buttonVariants({ variant: 'ghost', className: '!p-4' })}
			>
				<Plus />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a Transaction</DialogTitle>
					<DialogDescription>
						This form is designed for initiating a transaction. Please complete
						the following details to facilitate your transaction. Thank you!
					</DialogDescription>
				</DialogHeader>
				<CreateTransactionForm
					setIsShowDialog={setIsShowDialog}
					moneyStack={moneyStack}
				/>
			</DialogContent>
		</Dialog>
	)
}