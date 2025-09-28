import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Recipe({ title, contents, author }) {
		return (
				<article>
						<h3>{title}</h3>
						<div>{contents}</div>
						{author && (
            <em>
                <br />
                Created by <User id={author} />
            </em>
      )}
    </article>
  )
}

Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
}