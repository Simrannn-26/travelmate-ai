import { TravelProvider } from './context/TravelContext';
import { SearchBar } from './components/SearchBar/SearchBar';
import { Explore } from './pages/Explore';

export default function App() {
  return (
    <TravelProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero header */}
        <header className="bg-gradient-to-br from-indigo-600 to-purple-700 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-3">TravelMate AI</h1>
            <p className="text-indigo-200 text-lg mb-10">
              Your intelligent travel companion. Discover, plan, and explore.
            </p>
            <SearchBar/>
          </div>
        </header>

        {/* Main content */}
        <main>
          <Explore/>
        </main>
      </div>
    </TravelProvider>
  );
}