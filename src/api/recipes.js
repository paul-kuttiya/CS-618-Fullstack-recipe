export const getRecipes = async (queryParams) => {
		const res = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/recipes?` +
						new URLSearchParams(queryParams),
		)
		return await res.json()
}

export const createRecipe = async (token, recipe) => {
    const res = await fetch(
	    `${import.meta.env.VITE_BACKEND_URL}/recipes`,
	    {
		    method: 'POST',
		    headers: {
			    'Content-Type': 'application/json',
			    Authorization: `Bearer ${token}`,
		    },
		    body: JSON.stringify(recipe),
	    },
    )
    return await res.json()
}

export const checkLikeStatus = async (token, recipeId) => {
	const res = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}/like`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	)
	return await res.json()
}

export const getRecipeById = async (recipeId) => {
	const res = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}`,
	)
	return await res.json()
}

export const toggleLike = async (token, recipeId) => {
	const res = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}/like`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	)
	return await res.json()
}
