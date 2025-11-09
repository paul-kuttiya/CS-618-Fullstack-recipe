import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Recipes } from './pages/Recipes.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { ViewRecipe } from './pages/ViewRecipe.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
const queryClient = new QueryClient()
const router = createBrowserRouter([
	{
		path: '/',
		element: <Recipes />,
	},
	{
		path: '/recipes/:recipeId',
		element: <ViewRecipe />,
	},
	{
		path: '/signup',
		element: <Signup />,
	},
	{
		path: '/login',
		element: <Login />,
	},
])
export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthContextProvider>
				<RouterProvider router={router} />
			</AuthContextProvider>
		</QueryClientProvider>
	)
}
