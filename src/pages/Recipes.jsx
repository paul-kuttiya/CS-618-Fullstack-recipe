import { RecipeList } from '../components/RecipeList.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { RecipeFilter } from '../components/RecipeFilter.jsx'
import { RecipeSorting } from '../components/RecipeSorting.jsx'
import { Header } from '../components/Header.jsx'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function Recipes() {
		const [author, setAuthor] = useState('')
		const [sortBy, setSortBy] = useState('likes')
		const [sortOrder, setSortOrder] = useState('descending')
		const [token] = useAuth()
		
		const recipesQuery = useQuery({
				// Include token to bust cache when switching users
				queryKey: ['recipes', { author, sortBy, sortOrder }, token ? 'authed' : 'anon'],
				queryFn: () => getRecipes({ author, sortBy, sortOrder }),
				refetchOnWindowFocus: false,
				staleTime: 0, // Always refetch to ensure fresh data
				placeholderData: (previousData) => previousData, // Keep previous data while fetching to prevent layout shift
		})
		const recipes = recipesQuery.data ?? []

		return (
			<div className="app-root">
				<Header />
				<div className="page-body">
					<div className="page-content">
						<h1>Welcome to My Recipe Book!</h1>
						<CreateRecipe />
						<br />
						<hr />
						Filter by:
						<RecipeFilter
							field='author'
							value={author}
							onChange={(value) => setAuthor(value)}
						/>
						<br />
						<RecipeSorting
							sortOrder={sortOrder}
							onSort={(order) => setSortOrder(order)}
						/>
						<hr />
						<RecipeList recipes={recipes} />
					</div>
				</div>
			</div>
		)
}