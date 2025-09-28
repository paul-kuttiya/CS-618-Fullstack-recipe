import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createRecipe } from '../api/recipes.js'

export function CreateRecipe() {
		const [title, setTitle] = useState('')
		const [contents, setContents] = useState('')
		const [token] = useAuth()
		const queryClient = useQueryClient()
		const createRecipeMutation = useMutation({
				mutationFn: () => createRecipe(token, { title, contents }),
				onSuccess: () => queryClient.invalidateQueries(['recipes']),
		})

		const handleSubmit = (e) => {
				e.preventDefault()
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
						<textarea
								value={contents}
								onChange={(e) => setContents(e.target.value)}
								placeholder="Enter your recipe instructions here..."
						/>
						<br />
						<br />
						<input
								type='submit'
								value={createRecipeMutation.isPending ? 'Creating...' : 'Create Recipe'}
								disabled={!title}
						/>
						{createRecipeMutation.isSuccess ? (
								<>
										<br />
										Recipe created successfully!
								</>
						) : null}
				</form>
		)
}