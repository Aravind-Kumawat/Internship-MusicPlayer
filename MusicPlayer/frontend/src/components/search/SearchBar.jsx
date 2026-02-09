import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "../../css/search/SearchBar.css";
const SearchBar = ({ setSearchSongs }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!query) {
      setSearchSongs([]);
      return;
    }
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8001/api/songs/search/playlistByTag/${encodeURIComponent(query)}`);
        setSearchSongs(res.data.results );

      } catch (error) {
        console.error("Search failed", error);
        setSearchSongs([]);
      } finally {
        setLoading(false);
      }
    }
    const debounce = setTimeout(() => { 
      fetchSongs();
    }, 400);
    return () => clearTimeout(debounce);
  }, [query, setSearchSongs]);

  return (
    <div className="searchbar-root">
      <div className="searchbar-input-wrapper">
        <input
          className="searchbar-input"
          type="text"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          style={{
            padding: "8px",
            width: "100%",
            borderRadius: "6px",
          }}
          />
          <CiSearch className="searchbar-icon" size={20} />
      </div>
      {!query && !loading && (
        <p className="searchbar-empty">Search songs to display</p>
      )}
      {loading && <p className="searchbar-loading">Searching...</p>}
    </div>
  );
};

export default SearchBar;
