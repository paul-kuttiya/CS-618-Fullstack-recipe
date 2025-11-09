import express from 'express'
import { requireAuth as auth } from '../middleware/jwt.js'
import { toggleLike, findLike } from '../services/likes.js'

const router = express.Router({ mergeParams: true })

router.get('/like', auth, async (req, res) => {
  try {
    const { recipeId } = req.params
    const userId = req.user.sub
    const like = await findLike(recipeId, userId)
    res.status(200).json({ liked: !!like })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred while processing your request.' })
  }
})

router.post('/like', auth, async (req, res) => {
  try {
    const { recipeId } = req.params
    const userId = req.user.sub
    const result = await toggleLike(recipeId, userId)
    res.status(200).json(result)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Like operation failed due to a conflict. Please try again.' })
    }
    console.error(error)
    res.status(500).json({ message: 'An error occurred while processing your request.' })
  }
})

export default router
