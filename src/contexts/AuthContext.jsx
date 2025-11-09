/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
export const AuthContext = createContext({
	token: null,
	setToken: () => {},
})

export const AuthContextProvider = ({ children }) => {
	const [token, setTokenState] = useState(() => {
		// Initialize token from localStorage
		return localStorage.getItem('authToken')
	})

	const setToken = (newToken) => {
		setTokenState(newToken)
		if (newToken) {
			localStorage.setItem('authToken', newToken)
		} else {
			localStorage.removeItem('authToken')
		}
	}

	return (
		<AuthContext.Provider value={{ token, setToken }}>
			{children}
		</AuthContext.Provider>
	)
}
AuthContextProvider.propTypes = {
	children: PropTypes.element.isRequired,
}
export function useAuth() {
	const { token, setToken } = useContext(AuthContext)
	return [token, setToken]
}
