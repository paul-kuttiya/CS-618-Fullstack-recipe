import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import RecipeDetail from '../components/RecipeDetail.jsx'
import { getRecipeById } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function ViewRecipe() {
  const { recipeId } = useParams()
  const [token] = useAuth()

  const recipeQuery = useQuery({
    // Include token to bust cache when switching users
    queryKey: ['recipe', recipeId, token ? 'authed' : 'anon'],
    queryFn: () => getRecipeById(recipeId),
  })
  const recipe = recipeQuery.data

  return (
    <div className="app-root">
      <Header />
      <div className="page-body">
        <div className="page-content">
          <Link to="/">Back to main page</Link>
          <br />
          <hr />
          {recipe ? (
            <RecipeDetail recipe={recipe} />
          ) : recipeQuery.isLoading ? (
            <p>Loading recipe...</p>
          ) : (
            <p>Recipe with id {recipeId} not found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
