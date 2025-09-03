import Header from './components/Header';
import MainPage from './pages/MainPage';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header />
        <main className="flex-grow container mx-auto p-4">
          <MainPage />
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;