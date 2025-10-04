import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Recipe({ title, ingredients = [], imageUrl, author }) {
  const cardStyle = {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #e6e6e6',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    marginBottom: 12,
  }
  const imgStyle = {
    width: 120,
    height: 120,
    objectFit: 'cover',
    borderRadius: 6,
    flexShrink: 0,
  }

  return (
    <article style={cardStyle}>
      {imageUrl ? (
        <div>
          <img src={imageUrl} alt={title} style={imgStyle} />
        </div>
      ) : (
        <div style={{ width: 120, height: 120, background: '#f6f6f6', borderRadius: 6 }} />
      )}
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 8px 0' }}>{title}</h3>
        {ingredients.length ? (
          <div>
            <strong>Ingredients:</strong>
            <ul style={{ margin: '6px 0' }}>
              {ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {author && (
          <em>
            <br />
            Created by <User id={author} />
          </em>
        )}
      </div>
    </article>
  )
}

Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.array,
  imageUrl: PropTypes.string,
  author: PropTypes.string,
}