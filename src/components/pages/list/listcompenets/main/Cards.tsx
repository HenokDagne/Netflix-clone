// ...existing code...
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useMovies } from "../../../../../context/usemovies";
import { useFilteredMovies } from "../../../../../context/useFilteredMovies";

type Movie = {
  id?: number | string;
  posterUrl?: string;
  title?: string;
  name?: string;
  genres?: string[] | string;
  [key: string]: unknown;
};

export const Cards = () => {
  const { movies: allMovies, toggleFavorite } = useMovies();
  const { movies: filteredMovies } = useFilteredMovies();
  const [searchParams] = useSearchParams();

  // base list = filtered (if any) otherwise all
  let moviesToRender: Movie[] = (filteredMovies ?? allMovies ?? []) as Movie[];

  // apply search q filter from Navbar (?q=...)
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  if (q) {
    moviesToRender = moviesToRender.filter((m) => {
      const item = m as any;
      // support different shapes: title/name or nested pairs map used elsewhere in project
      const normalized = (item.title ??
        item.name ??
        (item.pairs
          ? Object.fromEntries(
              (item.pairs as any[]).map((p: any) => [p.key, p.value])
            ).title
          : "") ??
        "") as string;

      const title = String(normalized).toLowerCase();
      return title.includes(q);
    });
  }

  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-y-auto overflow-x-auto custom-scrollbar p-2">
      {moviesToRender &&
        moviesToRender.map((movie: Movie, index: number) => (
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              if (movie?.id && toggleFavorite) toggleFavorite(Number(movie.id));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                if (movie?.id && toggleFavorite)
                  toggleFavorite(Number(movie.id));
              }
            }}
            key={movie?.id ?? index}
            className="relative flex flex-col bg-gray-900 rounded-lg overflow-hidden h-64 flex items-end p-3 hover:ring-4 ring-lime-400 hover:scale-105 transition-shadow duration-200 ease-out transform-gpu cursor-pointer"
            style={{
              backgroundImage: movie?.posterUrl
                ? `url(${movie.posterUrl})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* heart indicator */}
            {movie && (movie as any).favorite ? (
              <div className="absolute top-2 right-2 text-red-500 text-xl drop-shadow-lg">
                ❤️
              </div>
            ) : (
              <div className="absolute top-2 right-2 text-white text-xl opacity-60">
                🤍
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Cards;
// ...existing code...
