import NavBar from "../components/nav-bar"
import useAuth from "../hooks/useAuth"
import useMoneyStacks from "../hooks/useMoneyStacks"
import { Card, CardContent, CardHeader } from '../components/ui/card'

import { Loader2 } from 'lucide-react'
import { buttonVariants } from '../components/ui/button'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import CreateMoneyStackDialog from '../components/create-money-stack-dialog'

export default function HomePage() {
	const { data: moneyStacks, isLoading: isLoadingMoneyStacks } =
		useMoneyStacks()

	return (
		<>
			<NavBar />
			<main className='container grid place-content-center min-h-screen px-11 py-12'>
				<Card className='shadow-lg'>
					<CardHeader className='border-b p-2 text-center text-xl'>
						Your list of money stacks
					</CardHeader>
					<CardContent className='pb-0 py-4'>
						{isLoadingMoneyStacks && (
							<div className='w-full h-full grid place-content-center p-20'>
								<Loader2 className='animate-spin' size={50} />
							</div>
						)}
						{!isLoadingMoneyStacks && (
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
								{moneyStacks?.map((moneyStack:any) => (
									<div
										key={moneyStack.id}
										className='border text-center rounded-sm shadow-md'
									>
										<div className='p-8'>
											<div className='text-2xl truncate'>
												{moneyStack.title}
											</div>
											<div className='text-slate-600'>
												{moneyStack.currentAmount / 1000}DT
											</div>
										</div>
										<Link
											to={moneyStack.id}
											className={cn(
												buttonVariants({ size: 'sm' }),
												'w-full rounded-b-sm rounded-t-none'
											)}
										>
											View
										</Link>
									</div>
								))}
							</div>
						)}
						<CreateMoneyStackDialog />
					</CardContent>
				</Card>
			</main>
		</>
	)
}
/* <Table className='min-h-[20rem]'>
<TableCaption>{new Date().toLocaleDateString()}</TableCaption>
<TableHeader>
	<TableRow>
		<TableHead>Title</TableHead>
		<TableHead>Description</TableHead>
		<TableHead>Initial Amount</TableHead>
		<TableHead>Previous Amount</TableHead>
		<TableHead>Current Amount</TableHead>
	</TableRow>
</TableHeader>
<TableBody>
	{moneyStacks?.map((moneyStack) => (
		<TableRow key={moneyStack.id}>
			<TableCell>{moneyStack.title}</TableCell>
			<TableCell>{moneyStack.description}</TableCell>
			<TableCell>{moneyStack.initialAmount}</TableCell>
			<TableCell>{moneyStack.previousAmount}</TableCell>
			<TableCell>{moneyStack.currentAmount}</TableCell>
		</TableRow>
	))}
</TableBody>
</Table> */
		
	
