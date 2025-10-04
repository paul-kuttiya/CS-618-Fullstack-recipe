import { Recipe } from '../db/models/recipe.js'
import { User } from '../db/models/user.js'

export async function createRecipe(userId, { title, ingredients, imageUrl }) {
	// Normalize ingredients if provided as a single string
	if (typeof ingredients === 'string') ingredients = [ingredients]

	const recipe = new Recipe({ title, author: userId, ingredients, imageUrl })
	return await recipe.save()
}

async function listRecipes(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Recipe.find(query).sort({ [sortBy]: sortOrder })
}

export async function listAllRecipes(options) {
  return await listRecipes({}, options)
}

export async function listRecipesByAuthor(authorUsername, options) {
		const user = await User.findOne({ username: authorUsername })
		if (!user) return []
		return await listRecipes({ author: user._id }, options)
}

export async function listRecipesByTag(tags, options) {
  return await listRecipes({ tags }, options)
}

export async function getRecipeById(recipeId) {
  return await Recipe.findById(recipeId)
}

export async function updateRecipe(userId, recipeId, { title, ingredients, imageUrl }) {
	if (typeof ingredients === 'string') ingredients = [ingredients]
	return await Recipe.findOneAndUpdate(
		{ _id: recipeId, author: userId },
		{ $set: { title, ingredients, imageUrl } },
		{ new: true },
	)
}

export async function deleteRecipe(userId, recipeId) {
		return await Recipe.deleteOne({ _id: recipeId, author: userId })
}