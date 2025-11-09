import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext.jsx'
import { toggleLike, checkLikeStatus } from '../api/recipes.js'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

export function Recipe({ recipe }) {
	const {
		title,
		ingredients = [],
		imageUrl,
		author,
		likes: initialLikes = 0,
	} = recipe
	const [token] = useAuth()
	const [likes, setLikes] = useState(initialLikes)
	const [isLiked, setIsLiked] = useState(false)
	const queryClient = useQueryClient()

	// Check if user has already liked this recipe
	useEffect(() => {
		const fetchLikeStatus = async () => {
			if (token && recipe._id) {
				try {
					const result = await checkLikeStatus(token, recipe._id)
					setIsLiked(result.liked)
				} catch (error) {
					console.error('Failed to fetch like status:', error)
				}
			}
		}
		fetchLikeStatus()
	}, [token, recipe._id])

	// Decode JWT to get current user's ID
	const getCurrentUserId = () => {
		if (!token) return null
		try {
			const payload = JSON.parse(atob(token.split('.')[1]))
			return payload.sub
		} catch (error) {
			return null
		}
	}

	const currentUserId = getCurrentUserId()
	const isOwnRecipe = currentUserId === author

	const handleLike = async (e) => {
		// Prevent navigation when clicking like inside the Link card
		if (e) {
			e.preventDefault()
			e.stopPropagation()
		}
		if (!token) {
			alert('Please log in to like recipes.')
			return
		}

		try {
			const result = await toggleLike(token, recipe._id)
			// Update state based on backend response
			setIsLiked(result.liked)
			setLikes((prev) => {
				const next = result.liked ? prev + 1 : prev - 1
				return next < 0 ? 0 : next
			})
			
			// Update all cached recipe lists to reflect new like count
			queryClient.setQueriesData({ queryKey: ['recipes'] }, (oldData) => {
				if (!oldData || !Array.isArray(oldData)) return oldData
				return oldData.map((r) => {
					if (r._id === recipe._id) {
						const newLikes = result.liked ? (r.likes ?? 0) + 1 : (r.likes ?? 0) - 1
						return { ...r, likes: newLikes < 0 ? 0 : newLikes }
					}
					return r
				})
			})
		} catch (error) {
			console.error('Failed to toggle like:', error)
			alert('Something went wrong. Please try again.')
		}
	}

	const cardStyle = {
		display: 'flex',
		gap: 12,
		alignItems: 'flex-start',
		padding: 12,
		borderRadius: 8,
		border: '1px solid #e6e6e6',
		boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
		marginBottom: 12,
		textDecoration: 'none',
		color: 'inherit',
		cursor: 'pointer',
		transition: 'box-shadow 0.2s',
	}

	const imgStyle = {
		width: 120,
		height: 120,
		objectFit: 'cover',
		borderRadius: 6,
		flexShrink: 0,
	}
	const contentStyle = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '100%',
	}

	const likeStyle = {
		display: 'flex',
		alignItems: 'center',
		gap: '6px',
		marginTop: '12px',
		cursor: 'pointer',
		color: '#555',
	}

	return (
		<Link to={`/recipes/${recipe._id}`} style={cardStyle}>
			<article style={{ display: 'flex', gap: 12, width: '100%' }}>
			{imageUrl ? (
				<div>
					<img src={imageUrl} alt={title} style={imgStyle} />
				</div>
			) : (
				<div
					style={{
						width: 120,
						height: 120,
						background: '#f6f6f6',
						borderRadius: 6,
					}}
				/>
			)}
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
				<div>
					<h2 style={{ margin: 0, fontSize: '1.2rem' }}>
						{title}
					</h2>
					<ul
						style={{
							paddingLeft: 20,
							marginTop: 8,
							color: '#666',
							fontSize: '0.9rem',
						}}
					>
						{ingredients.map((ingredient, index) => (
							<li key={index}>{ingredient}</li>
						))}
					</ul>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
					{author && (
						<div>
							<span style={{ marginRight: '4px' }}>by</span>
							<User id={author} />
						</div>
					)}
					{!isOwnRecipe && (
						<button
							aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
							style={{
								background: 'none',
								border: 'none',
								padding: 0,
								font: 'inherit',
								...likeStyle,
							}}
							onClick={handleLike}
						>
							{isLiked ? <FaHeart color='red' /> : <FaRegHeart />}
							<span>{likes}</span>
						</button>
					)}
				</div>
			</div>
		</article>
		</Link>
	)
}

Recipe.propTypes = {
	recipe: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		ingredients: PropTypes.arrayOf(PropTypes.string),
		imageUrl: PropTypes.string,
		author: PropTypes.string, // Author is treated as an ID string
		likes: PropTypes.number,
	}).isRequired,
}