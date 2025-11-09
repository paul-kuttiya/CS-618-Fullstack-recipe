import { RecipeList } from '../components/RecipeList.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { RecipeFilter } from '../components/RecipeFilter.jsx'
import { RecipeSorting } from '../components/RecipeSorting.jsx'
import { Header } from '../components/Header.jsx'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '../api/recipes.js'

export function Recipes() {
		const [author, setAuthor] = useState('')
		const [sortBy, setSortBy] = useState('likes')
		const [sortOrder, setSortOrder] = useState('descending')
		
		const recipesQuery = useQuery({
				queryKey: ['recipes', { author, sortBy, sortOrder }],
				queryFn: () => getRecipes({ author, sortBy, sortOrder }),
				placeholderData: (previousData) => previousData,
				refetchOnWindowFocus: false,
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