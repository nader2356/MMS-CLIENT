
import { Link } from 'react-router-dom'
import { buttonVariants } from './ui/button'

import { cn, formatMoney } from '../lib/utils'
import { MoneyStack } from '../shemas/money-stack'


type Props = {
	moneyStack: MoneyStack
}

export default function MoneyStack({ moneyStack }: Props) {
	const { id, title, previousAmount, currentAmount } = moneyStack

	const isCrossOutMoney = previousAmount !== currentAmount

	return (
		<div
			key={id}
			className='border text-center rounded-sm w-52 h-52 flex flex-col'
		>
			<div className='p-8 flex-1 grid place-content-center'>
				<div className='text-2xl truncate'>{title}</div>
				{isCrossOutMoney ? (
					<div className='text-slate-600 leading-3'>
						<div className='line-through text-sm'>
							{formatMoney(previousAmount)}
						</div>
						<div>{formatMoney(currentAmount)}</div>
					</div>
				) : (
					<div className='text-slate-600'>{formatMoney(currentAmount)}</div>
				)}
			</div>
			<Link
				to={`money-stacks/${id}`}
				className={cn(
					buttonVariants({ size: 'sm' }),
					'w-full rounded-b-sm rounded-t-none'
				)}
			>
				View
			</Link>
		</div>
	)
}
 