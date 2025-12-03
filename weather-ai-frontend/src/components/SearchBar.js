import { Search } from 'lucide-react';
import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city or location..."
          className="w-full pl-12 pr-24 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none text-white placeholder-gray-400 text-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl transition-all"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;