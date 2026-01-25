import React from "react";
import type { Movie } from "../../../api/retrieve";

type Props = { movie: Movie };

const HeroSection: React.FC<Props> = ({ movie }) => {
  const title = movie.title || movie.original_title || "Untitled";
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : undefined;
  const genres = Array.isArray(movie.genres) ? movie.genres.join(" • ") : "";

  return (
    <div className="relative h-124 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 overflow-hidden">
      {backdrop && (
        <img
          src={backdrop}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      <div className="absolute left-6 bottom-6 flex items-center gap-4">
        <div
          className="h-45 w-30 rounded-lg bg-gray-800 shadow-inner overflow-hidden"
          aria-hidden="true"
        >
          {/* Poster placeholder; could be swapped for real poster if desired */}
        </div>
        <div>
          <p className="text-sm text-gray-300">
            {movie.release_date ?? ""}
            {genres ? ` • ${genres}` : ""}
          </p>
          <h1 className="text-2xl font-bold line-clamp-2">{title}</h1>
          {movie.overview ? (
            <p className="mt-1 text-gray-300 line-clamp-2 max-w-xl">
              {movie.overview}
            </p>
          ) : null}
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-amber-200">
              ★ {movie.vote_average ?? 0} / 10
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-blue-200">
              Votes: {movie.vote_count ?? 0}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-green-200">
              Popularity: {Math.round(movie.popularity ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
