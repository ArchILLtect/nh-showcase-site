// TODO: For future security upgrades, consider integrating token expiration handling.


export const isLoggedIn = () => {
    const token = localStorage.getItem('authToken'); // Check for token in localStorage
    // TODO: Validate the token (optional: implement validation with backend)
    return !!token; // Convert to boolean (true if token exists, false otherwise)
  };
  
  export const login = (token) => {
    localStorage.setItem('authToken', token); // Save token to localStorage
  };
  
  export const logout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
  };