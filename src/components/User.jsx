import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { getUserInfo } from '../api/users.js'

export function User({ id }) {
		const userInfoQuery = useQuery({
				queryKey: ['users', id],
				queryFn: async () => {
					const data = await getUserInfo(id)
					// Cache in localStorage when fetched
					try {
						localStorage.setItem(`user_${id}`, JSON.stringify(data))
					} catch (error) {
						console.error('Failed to cache user in localStorage:', error)
					}
					return data
				},
				staleTime: 5 * 60 * 1000, // Cache user data for 5 minutes
				initialData: () => {
					// Check localStorage for cached user info
					try {
						const cached = localStorage.getItem(`user_${id}`)
						return cached ? JSON.parse(cached) : undefined
					} catch {
						return undefined
					}
				},
		})
		const userInfo = userInfoQuery.data ?? {}
		
		// Show username immediately if cached, otherwise show loading
		return <strong>{userInfo?.username ?? '...'}</strong>
}
User.propTypes = {
		id: PropTypes.string.isRequired,
}
