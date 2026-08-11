import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(term);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
      <input
        type="text"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search for a word..."
        className="flex-1 px-4 py-3 mb-1 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
