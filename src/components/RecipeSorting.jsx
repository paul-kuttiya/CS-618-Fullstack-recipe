import PropTypes from 'prop-types'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

export function RecipeSorting({ sortOrder, onSort }) {
	const buttonStyle = {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
		padding: '8px 12px',
		border: '1px solid #ccc',
		borderRadius: '6px',
		background: 'white',
		cursor: 'pointer',
		fontSize: '0.9rem',
	}

	const handleSort = (e) => {
		e.preventDefault()
		if (sortOrder === 'descending') {
			onSort('ascending')
		} else {
			onSort('descending')
		}
	}

	return (
		<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
			<button type="button" style={buttonStyle} onClick={handleSort}>
				<span>Sort by Likes</span>
				{sortOrder === 'descending' ? <FaArrowUp /> : <FaArrowDown />}
			</button>
		</div>
	)
}

RecipeSorting.propTypes = {
	sortOrder: PropTypes.oneOf(['ascending', 'descending']).isRequired,
	onSort: PropTypes.func.isRequired,
}