import { Link } from 'react-router-dom'
import { User } from './User.jsx'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function Header() {
	const [token, setToken] = useAuth()
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()

	const handleToggle = () => setOpen((v) => !v)
	const handleClose = () => setOpen(false)

	const handleLogout = () => {
		setToken(null)
		// Invalidate all queries to clear cached data
		queryClient.invalidateQueries()
	}

	if (token) {
		const { sub } = jwtDecode(token)
		return (
			<header className="header">
				<div className="header-row">
					<div className="brand">My Recipe Book</div>
					<button
						className="hamburger"
						aria-label="Toggle menu"
						aria-expanded={open}
						onClick={handleToggle}
					>
						<span className="hamburger-box" />
					</button>
				</div>
				{open && (
					<nav className="dropdown" onClick={handleClose}>
						<div>Logged in as <User id={sub} /></div>
						<button onClick={handleLogout}>Logout</button>
					</nav>
				)}
			</header>
		)
	}

	return (
		<header className="header">
			<div className="header-row">
				<div className="brand">My Recipe Book</div>
				<button
					className="hamburger"
					aria-label="Toggle menu"
					aria-expanded={open}
					onClick={handleToggle}
				>
					<span className="hamburger-box" />
				</button>
			</div>
			{open && (
				<nav className="dropdown" onClick={handleClose}>
					<Link to='/login'>Log In</Link>
					<Link to='/signup'>Sign Up</Link>
				</nav>
			)}
		</header>
	)
}
