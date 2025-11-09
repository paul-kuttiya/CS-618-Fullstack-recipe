import { Like } from '../db/models/like.js'
import { Recipe } from '../db/models/recipe.js'

export const createLike = async (recipeId, userId) => {
  const like = new Like({ recipe: recipeId, user: userId })
  await like.save()
  await Recipe.updateOne({ _id: recipeId }, { $inc: { likes: 1 } })
  return like
}

export const deleteLike = async (recipeId, userId) => {
  const like = await Like.findOneAndDelete({ recipe: recipeId, user: userId })
  if (like) {
    await Recipe.updateOne({ _id: recipeId }, { $inc: { likes: -1 } })
  }
  return like
}

export const findLike = async (recipeId, userId) => {
  const like = await Like.findOne({ recipe: recipeId, user: userId })
  return like
}

export const toggleLike = async (recipeId, userId) => {
	const existingLike = await findLike(recipeId, userId)
	if (existingLike) {
		await deleteLike(recipeId, userId)
		return { liked: false, message: 'Recipe unliked successfully.' }
	} else {
		await createLike(recipeId, userId)
		return { liked: true, message: 'Recipe liked successfully.' }
	}
}
