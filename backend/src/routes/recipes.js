import express from 'express'
import {
	listAllRecipes,
	listRecipesByAuthor,
	listRecipesByTag,
	getRecipeById,
	deleteRecipe,
	updateRecipe,
	createRecipe,
} from '../services/recipes.js'
import { requireAuth as auth } from '../middleware/jwt.js'
import likesRouter from './likes.js'

const router = express.Router()

router.get('/', async (req, res) => {
	const { sortBy, sortOrder, author, tag } = req.query
	const options = { sortBy, sortOrder }
	try {
		if (author && tag) {
			return res
				.status(400)
				.json({ error: 'query by either author or tag, not both' })
		} else if (author) {
			return res.json(await listRecipesByAuthor(author, options))
		} else if (tag) {
			return res.json(await listRecipesByTag(tag, options))
		} else {
			return res.json(await listAllRecipes(options))
		}
	} catch (err) {
		console.error('error listing recipes', err)
		return res.status(500).end()
	}
})

router.get('/:id', async (req, res) => {
	const { id } = req.params
	try {
		const recipe = await getRecipeById(id)
		if (recipe === null) return res.status(404).end()
		return res.json(recipe)
	} catch (err) {
		console.error('error getting recipe', err)
		return res.status(500).end()
	}
})

router.use('/:recipeId', likesRouter)

router.post('/', auth, async (req, res) => {
	try {
		const recipe = await createRecipe(req.user.sub, req.body)
		res.status(201).json(recipe)
	} catch (err) {
		console.error('error creating recipe', err)
		// Mongoose validation error -> return 400 with details
		if (err.name === 'ValidationError') {
			return res.status(400).json({ error: err.message })
		}
		return res.status(500).end()
	}
})

router.put('/:id', auth, async (req, res) => {
	try {
		const recipe = await updateRecipe(req.user.sub, req.params.id, req.body)
		if (!recipe) {
			return res.status(404).end()
		}
		return res.json(recipe)
	} catch (err) {
		console.error('error updating recipe', err)
		return res.status(500).end()
	}
})

router.delete('/:id', auth, async (req, res) => {
	try {
		const result = await deleteRecipe(req.user.sub, req.params.id)
		if (result.deletedCount === 0) {
			return res.sendStatus(404)
		}
		return res.status(204).end()
	} catch (err) {
		console.error('error deleting recipe', err)
		return res.status(500).end()
	}
})

export function recipesRoutes(app) {
	app.use('/api/v1/recipes', router)
}