import { useState } from 'react';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?keywords=${val}`);
      const data = await res.json();
      setResults(data.bestMatches || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search stocks..."
        className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {(loading || results.length > 0) && (
        <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-3 text-center text-gray-400">Loading...</div>
          ) : (
            results.map((item) => (
              <div
                key={item['1. symbol']}
                onClick={() => {
                  onSelect(item['1. symbol'], item['2. name']);
                  setResults([]);
                  setQuery('');
                }}
                className="p-3 hover:bg-slate-700 cursor-pointer transition-colors border-b border-slate-700 last:border-b-0"
              >
                <div className="font-medium text-white">{item['1. symbol']}</div>
                <div className="text-sm text-gray-400 truncate">{item['2. name']}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
