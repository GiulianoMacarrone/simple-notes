import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import type { LoginCredentials } from '../models/User';
import LoginPage from '../pages/LoginPage';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { login, logout, isLoggedIn, user } = useAuth();

  const handleLogin = async (credentials: LoginCredentials) => {
  try {
    await login(credentials); 
    setShowLogin(false);
  } catch (error) {
    console.error("Login failed:", error);
  }};

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Simple Notes Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Simple Notes
          </span>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-800 dark:text-gray-200">
              Hola, {user?.username}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white shadow-lg transition-colors duration-200 hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white shadow-lg transition-colors duration-200 hover:bg-blue-700"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
        )}
      </div>

      {showLogin && (
        <LoginPage onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
    </header>
  );
};
export default Header;
