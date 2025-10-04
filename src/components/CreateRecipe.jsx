import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createRecipe } from '../api/recipes.js'

export function CreateRecipe() {
	const [title, setTitle] = useState('')
	const [ingredients, setIngredients] = useState([])
	const [newIngredient, setNewIngredient] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const [error, setError] = useState('')
	const [token] = useAuth()
	const queryClient = useQueryClient()

	const createRecipeMutation = useMutation({
		mutationFn: () => createRecipe(token, { title, ingredients, imageUrl }),
		onSuccess: () => {
			queryClient.invalidateQueries(['recipes'])
			// clear the form after successful creation
			setTitle('')
			setIngredients([])
			setNewIngredient('')
			setImageUrl('')
			setError('')
		},
	})

	const handleSubmit = (e) => {
		e.preventDefault()
		setError('')
		if (!title.trim()) return setError('Title is required')
		if (!ingredients.length) return setError('Add at least one ingredient')
		if (!imageUrl.trim()) return setError('Image URL is required')
		createRecipeMutation.mutate()
	}

	if (!token) return <div>Please log in to create new recipes.</div>

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor='create-title'>Recipe Title: </label>
				<input
					type='text'
					name='create-title'
					id='create-title'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>

			<br />

			<div>
				<label>Ingredient</label>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<input
						type='text'
						value={newIngredient}
						onChange={(e) => setNewIngredient(e.target.value)}
						placeholder='e.g. 1 cup flour'
					/>
					<button
						type='button'
						onClick={() => {
							const v = newIngredient.trim()
							if (!v) return
							setIngredients((s) => [...s, v])
							setNewIngredient('')
						}}
					>
						+
					</button>
                    
				</div>
				<ul>
					{ingredients.map((ing, i) => (
						<li key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							<span style={{ flex: 1 }}>{ing}</span>
							<button
								type='button'
								onClick={() => setIngredients((s) => s.filter((_, idx) => idx !== i))}
								style={{ padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}
							>
								remove
							</button>
						</li>
					))}
				</ul>
			</div>

			<br />

			<div>
				<label htmlFor='image-url'>Image URL: </label>
				<input
					type='text'
					id='image-url'
					value={imageUrl}
					onChange={(e) => setImageUrl(e.target.value)}
					placeholder='https://...'
				/>
			</div>

			<br />

			{/** disable submit until required fields present */}
			<input
				type='submit'
				value={createRecipeMutation.isPending ? 'Creating...' : 'Create Recipe'}
				disabled={
					createRecipeMutation.isPending || !title.trim() || !ingredients.length || !imageUrl.trim()
				}
				title={
					!title.trim() || !ingredients.length || !imageUrl.trim()
						? 'Title, at least one ingredient, and image URL are required'
						: undefined
				}
				style={{ opacity: createRecipeMutation.isPending || !title.trim() || !ingredients.length || !imageUrl.trim() ? 0.6 : 1 }}
			/>
			{error ? (
				<div style={{ color: 'red', marginTop: 8 }}>{error}</div>
			) : null}
			{createRecipeMutation.isSuccess ? (
				<>
					<br />
					Recipe created successfully!
				</>
			) : null}
		</form>
	)
}