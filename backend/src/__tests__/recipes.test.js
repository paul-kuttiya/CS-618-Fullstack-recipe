import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
		createRecipe,
		listAllRecipes,
		listRecipesByAuthor,
		listRecipesByTag,
		getRecipeById,
		updateRecipe,
		deleteRecipe,
} from '../services/recipes.js'
import { Recipe } from '../db/models/recipe.js'
import { createUser } from '../services/users.js'

let testUser = null
let sampleRecipes = []
let createdSampleRecipes = []

beforeAll(async () => {
		testUser = await createUser({ username: 'sample', password: 'user' })
		sampleRecipes = [
				{ title: 'Pasta Carbonara', author: testUser._id, tags: ['pasta', 'italian'] },
				{ title: 'Classic Burger', author: testUser._id, tags: ['burger', 'american'] },
				{
						title: 'Vegetable Stir Fry',
						author: testUser._id,
						tags: ['vegetarian', 'asian'],
				},
		]
})

beforeEach(async () => {
		await Recipe.deleteMany({})
		createdSampleRecipes = await Recipe.create(sampleRecipes)
})

describe('getting a recipe', () => {
	test('should return the full recipe', async () => {
		const recipe = await getRecipeById(createdSampleRecipes[0]._id)
		expect(recipe).not.toBeNull()
		expect(recipe._id.toString()).toEqual(createdSampleRecipes[0]._id.toString())
		expect(recipe.title).toEqual(createdSampleRecipes[0].title)
	})

	test('should fail if the id does not exist', async () => {
		const recipe = await getRecipeById('000000000000000000000000')
		expect(recipe).toEqual(null)
	})
})

describe('updating recipes', () => {
	test('should update the specified property', async () => {
		const original = createdSampleRecipes[0]
		await updateRecipe(testUser._id, original._id, { contents: 'Updated recipe' })
		const updatedRecipe = await Recipe.findById(original._id)
		expect(updatedRecipe.contents).toEqual('Updated recipe')
	})

	test('should not update other properties', async () => {
		const original = createdSampleRecipes[0]
		await updateRecipe(testUser._id, original._id, { contents: 'Changed' })
		const updatedRecipe = await Recipe.findById(original._id)
		expect(updatedRecipe.title).toEqual('Pasta Carbonara')
	})

	test('should update the updatedAt timestamp', async () => {
		const original = await Recipe.findById(createdSampleRecipes[0]._id)
		const before = original.updatedAt.getTime()
		await updateRecipe(testUser._id, original._id, { contents: 'TS bump' })
		const updatedRecipe = await Recipe.findById(original._id)
		expect(updatedRecipe.updatedAt.getTime()).toBeGreaterThan(before)
	})

	test('should fail if the id does not exist', async () => {
		const recipe = await updateRecipe(testUser._id, '000000000000000000000000', {
			contents: 'no-op',
		})
		expect(recipe).toEqual(null)
	})
})

describe('deleting recipes', () => {
	test('should remove the recipe from the database', async () => {
		const id = createdSampleRecipes[0]._id
		const result = await deleteRecipe(testUser._id, id)
		expect(result.deletedCount).toEqual(1)
		const deletedRecipe = await Recipe.findById(id)
		expect(deletedRecipe).toEqual(null)
	})

	test('should fail if the id does not exist', async () => {
		const result = await deleteRecipe(testUser._id, '000000000000000000000000')
		expect(result.deletedCount).toEqual(0)
	})
})

describe('listing recipes', () => {
	test('should return all recipes', async () => {
		const recipes = await listAllRecipes()
		expect(recipes.length).toEqual(createdSampleRecipes.length)
	})

	test('should return recipes sorted by creation date descending by default', async () => {
		const recipes = await listAllRecipes()
		const sortedSampleRecipes = [...createdSampleRecipes].sort(
			(a, b) => b.createdAt - a.createdAt,
		)
		expect(recipes.map((p) => p.createdAt.getTime())).toEqual(
			sortedSampleRecipes.map((p) => p.createdAt.getTime()),
		)
	})

	test('should take into account provided sorting options', async () => {
		const recipes = await listAllRecipes({
			sortBy: 'updatedAt',
			sortOrder: 'ascending',
		})
		const sortedSampleRecipes = [...createdSampleRecipes].sort(
			(a, b) => a.updatedAt - b.updatedAt,
		)
		expect(recipes.map((p) => p.updatedAt.getTime())).toEqual(
			sortedSampleRecipes.map((p) => p.updatedAt.getTime()),
		)
	})

	test('should be able to filter recipes by author', async () => {
		const recipes = await listRecipesByAuthor('sample')
		expect(recipes.length).toBe(3)
	})

	test('should be able to filter recipes by tag', async () => {
		const recipes = await listRecipesByTag('asian')
		expect(recipes.length).toBe(1)
	})
})

describe('creating recipes', () => {
	test('with all parameters should succeed', async () => {
		const createdRecipe = await createRecipe(testUser._id, {
			title: 'Chocolate Cake',
			contents: 'This is a delicious chocolate cake recipe stored in MongoDB.',
			tags: ['dessert', 'chocolate'],
		})
		expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
		const foundRecipe = await Recipe.findById(createdRecipe._id)
		expect(foundRecipe.title).toEqual('Chocolate Cake')
		expect(foundRecipe.contents).toContain('chocolate cake')
		expect(foundRecipe.createdAt).toBeInstanceOf(Date)
		expect(foundRecipe.updatedAt).toBeInstanceOf(Date)
	})

	test('without title should fail', async () => {
		try {
			await createRecipe(testUser._id, {
				contents: 'Recipe with no title',
				tags: ['empty'],
			})
			// If no error was thrown, force a failure
			expect(true).toBe(false)
		} catch (err) {
			expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
			expect(err.message).toContain('`title` is required')
		}
	})

	test('with minimal parameters should succeed', async () => {
		const createdRecipe = await createRecipe(testUser._id, { title: 'Only a title' })
		expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
	})
})