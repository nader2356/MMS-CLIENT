


import { Link } from 'react-router-dom'
import useAuth from '../hooks/use-auth'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function NavBar() {
	const { user } = useAuth()

	return (
		<header className='absolute w-screen'>
			<div className='container p-3 flex items-center justify-between'>
				<span className='text-xl'>
					<Link to='/'>MMS</Link>
				</span>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger className='h-8 w-8 rounded-full'>
							<Avatar className='w-8 h-8'>
								<AvatarImage src='https://github.com/shadcn.png' />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</TooltipTrigger>
						<TooltipContent>{user.name}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</header>
	)
}