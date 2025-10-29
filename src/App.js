import React, { useEffect, useState } from "react";

const API_KEY = "97a5ebc4b3938a9c201adc1ce737d191";
const API_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

function mapPage(p) {
  const wrap = 500;
  return ((p - 1) % wrap) + 1;
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("popularity.desc");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const totalPages = 50000;

  useEffect(() => {
    fetchMovies();
  }, [page, sort, query]);

  async function fetchMovies() {
    setLoading(true);
    const tmdbPage = mapPage(page);
    const url = query
      ? `${API_BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}&page=${tmdbPage}`
      : `${API_BASE}/discover/movie?api_key=${API_KEY}&sort_by=${sort}&page=${tmdbPage}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setMovies((data.results || []).slice(0, 20));
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header>
        <h1>Movie Explorer</h1>
        <div className="search-sort">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="popularity.desc">Sort By</option>
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="release_date.desc">Newest</option>
          </select>
        </div>
      </header>

      <main id="movie-container">
        {loading ? (
          <div className="loading-placeholder">Loading...</div>
        ) : movies.length === 0 ? (
          <div className="loading-placeholder">No results</div>
        ) : (
          movies.map((m) => (
            <div className="movie-card" key={m.id}>
              <img
                src={
                  m.poster_path
                    ? `${IMG_BASE}${m.poster_path}`
                    : "https://via.placeholder.com/220x330?text=No+Image"
                }
                alt={m.title}
              />
              <h2>{m.title}</h2>
              <p>Release Date: {m.release_date || "N/A"}</p>
              <p>Rating: {m.vote_average ? m.vote_average.toFixed(1) : "N/A"}</p>
            </div>
          ))
        )}
      </main>

      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => page > 1 && setPage(page - 1)}
        >
          Previous
        </button>
        <span id="page-info">
          Page {page} of {totalPages}
        </span>
        <button
          className="page-btn"
          onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
        >
          Next
        </button>
      </div>
    </>
  );
}
