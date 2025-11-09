import PropTypes from 'prop-types'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext.jsx'
import { toggleLike, checkLikeStatus } from '../api/recipes.js'
import { useEffect, useMemo, useState } from 'react'
import { User } from './User.jsx'

export function RecipeDetail({ recipe }) {
  const {
    _id,
    title,
    ingredients = [],
    imageUrl,
    author,
    likes: initialLikes = 0,
  } = recipe

  const [token] = useAuth()
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetchLikeStatus = async () => {
      if (!token || !_id) return
      try {
        const res = await checkLikeStatus(token, _id)
        if (!cancelled) setIsLiked(!!res.liked)
      } catch (err) {
        // non-fatal; leave as false
      }
    }
    fetchLikeStatus()
    return () => {
      cancelled = true
    }
  }, [token, _id])

  const currentUserId = useMemo(() => {
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.sub
    } catch {
      return null
    }
  }, [token])

  const isOwnRecipe = currentUserId === author

  const handleLike = async () => {
    if (!token) {
      alert('Please log in to like recipes.')
      return
    }
    try {
      const result = await toggleLike(token, _id)
      setIsLiked(result.liked)
      setLikes(prev => {
        const next = result.liked ? prev + 1 : prev - 1
        return next < 0 ? 0 : next
      })
    } catch (err) {
      alert('Something went wrong. Please try again.')
    }
  }

  const pageStyle = {
    maxWidth: 900,
    margin: '0 auto',
    padding: '16px 12px 48px',
  }
  const titleStyle = {
    fontSize: '2rem',
    margin: '8px 0 16px 0',
    lineHeight: 1.2,
  }
  const imageStyle = {
    width: '100%',
    maxHeight: 420,
    objectFit: 'cover',
    borderRadius: 8,
    background: '#f6f6f6',
  }
  const metaRow = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  }
  const likeButton = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: '1px solid #e6e6e6',
    borderRadius: 8,
    background: '#fff',
    padding: '8px 12px',
    cursor: 'pointer',
  }

  return (
    <section style={pageStyle}>
      <h1 style={titleStyle}>{title}</h1>
      {imageUrl ? (
        <img src={imageUrl} alt={title} style={imageStyle} />
      ) : (
        <div style={{ ...imageStyle, height: 300 }} />
      )}

      <div style={metaRow}>
        {author && (
          <div style={{ color: '#666' }}>
            <span style={{ marginRight: 6 }}>by</span>
            <User id={author} />
          </div>
        )}

        {!isOwnRecipe && (
          <button
            aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
            onClick={handleLike}
            style={likeButton}
          >
            {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
            <span>{likes}</span>
          </button>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ margin: '0 0 8px 0' }}>Ingredients</h2>
        {ingredients?.length ? (
          <ul style={{ paddingLeft: 20, color: '#444' }}>
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#666' }}>No ingredients listed.</p>
        )}
      </div>
    </section>
  )
}

RecipeDetail.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.string),
    imageUrl: PropTypes.string,
    author: PropTypes.string,
    likes: PropTypes.number,
  }).isRequired,
}

export default RecipeDetail
