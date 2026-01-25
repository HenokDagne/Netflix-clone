import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../context/usemovies";
import { fetchPopularMovies, type PouplarMovies } from "../api/popular";

type Movie = PouplarMovies & { key?: string | number };

export function Popularcards() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useMovies();
  const [popular, setPopular] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchPopularMovies()
      .then((data) => {
        if (!alive) return;
        setPopular(data);
      })
      .catch((err) => {
        if (!alive) return;
        const msg =
          err instanceof Error ? err.message : "Failed to load popular movies";
        setError(msg);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-black overflow-y-auto overflow-x-auto no-scrollbar h-64">
      {/* content for top box */}
      <p className="text-2xl font-mono font-extrabold text-white px-2">
        Popular
      </p>
      {loading && <div className="px-2 text-gray-300">Loading popular…</div>}
      {error && <div className="px-2 text-red-400">{error}</div>}
      {!loading &&
        !error &&
        popular.map((movie: Movie, index: number) => (
          <div
            key={String(movie.id ?? movie.key ?? index)}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (!movie?.id) return;
              navigate(`/movies/${movie.id}`, { state: { movie } });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                if (!movie?.id) return;
                navigate(`/movies/${movie.id}`, { state: { movie } });
              }
            }}
            className="flex flex-row p-2  bg-black items-center mb-2 cursor-pointer relative"
            style={{ minHeight: 84 }}
          >
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt=""
                width={64}
                height={84}
                style={{
                  width: 64,
                  height: 84,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
                className="mr-3 rounded-xl hover:ring-2 ring-lime-400"
              />
            ) : (
              <div
                style={{
                  width: 64,
                  height: 84,
                  background: "#222",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginRight: "0.75rem",
                  borderRadius: "0.25rem",
                }}
              >
                no image found
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {movie.title}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {((movie.genres || []) as (string | { name?: string })[])
                  .map((g) => (typeof g === "string" ? g : g?.name || ""))
                  .filter(Boolean)
                  .join(" | ")}
              </p>
            </div>
            <button
              type="button"
              aria-pressed={favorites.includes(Number(movie.id))}
              onClick={(e) => {
                e.stopPropagation();
                if (movie?.id && toggleFavorite)
                  toggleFavorite(Number(movie.id));
              }}
              className="absolute top-2 right-2 text-xl drop-shadow-lg"
            >
              
            </button>
          </div>
        ))}
    </div>
  );
}

export default Popularcards;
