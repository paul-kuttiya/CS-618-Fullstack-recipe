import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/users.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Header } from '../components/Header.jsx'
export function Login() {
	const [, setToken] = useAuth()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const loginMutation = useMutation({
		mutationFn: () => login({ username, password }),
		onSuccess: (data) => {
			setToken(data.token)
			
			// Pre-cache the user info and store in localStorage to avoid loading state
			try {
				const payload = JSON.parse(atob(data.token.split('.')[1]))
				if (payload.sub) {
					const userInfo = { username }
					queryClient.setQueryData(['users', payload.sub], userInfo)
					// Store username in localStorage for immediate display on reload
					localStorage.setItem(`user_${payload.sub}`, JSON.stringify(userInfo))
				}
			} catch (error) {
				console.error('Failed to cache user info:', error)
			}
			
			// Invalidate all queries to fetch fresh data for the new user
			queryClient.invalidateQueries()
			navigate('/')
		},
		onError: () => alert('failed to login!'),
	})
	const handleSubmit = (e) => {
		e.preventDefault()
		loginMutation.mutate()
	}
	return (
		<div className="app-root">
			<Header />
			<div className="page-body">
				<div className="page-content">
					<form onSubmit={handleSubmit}>
						<Link to='/'>Back to main page</Link>
						<hr />
						<br />
						<div>
							<label htmlFor='create-username'>Username: </label>
							<input
								type='text'
								name='create-username'
								id='create-username'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<br />
						<div>
							<label htmlFor='create-password'>Password: </label>
							<input
								type='password'
								name='create-password'
								id='create-password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<br />
						<input
							type='submit'
							value={loginMutation.isPending ? 'Logging in...' : 'Log In'}
							disabled={!username || !password || loginMutation.isPending}
						/>
					</form>
				</div>
			</div>
		</div>
	)
}
