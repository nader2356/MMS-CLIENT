import NavBar from "../components/nav-bar"
import useAuth from "../hooks/useAuth"


export default function HomePage() {
	const { user } = useAuth()

	return (
		<>
			<NavBar />
			<main className='container'>
				<div>Home</div>
				<div>Logged in as user</div>
				<div>id: {user.id}</div>
				<div>name: {user.name}</div>
				<div>email: {user.email}</div>
			</main>
		</>
	)
}