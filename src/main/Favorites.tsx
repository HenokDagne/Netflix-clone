// ...existing code...
import React from "react";
import { useMovies } from "../context/usemovies";

export function Favorites() {
  const moviesFromHook = useMovies();
  const movies = Array.isArray(moviesFromHook)
    ? moviesFromHook
    : (moviesFromHook?.movies ?? []);

  const favorites = movies.filter((movie: any) => movie?.favorite);

  return (
    <div className="flex-1 min-h-0 bg-black overflow-auto py-3 overflow-y-auto overflow-x-auto no-scrollbar justify-start h-96">
      {/* header */}
      <p className="text-2xl font-mono font-extrabold text-white px-2">
        Favorite
      </p>

      {/* list */}
      {favorites.map((movie: any, idx: number) => (
        <div
          key={movie.id ?? movie.key ?? idx}
          className="flex flex-row p-2 bg-black items-center mb-2"
          style={{ minHeight: 84 }}
        >
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title ?? "poster"}
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

          <div className="flex flex-col ">
            <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {movie.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {(movie.genres || []).join(" | ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Favorites;
// ...existing code...
