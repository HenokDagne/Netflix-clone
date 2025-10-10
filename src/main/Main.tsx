// ...existing code...
import React from "react";
import Home from "./Home";
import Popularbar from "./Popularbar";
import { useMovies } from "../context/usemovies";

type Movie = {
  id?: number;
  title?: string;
  name?: string;
  poster?: string;
  image?: string;
  genres?: string[];
  [key: string]: any;
};

function Main() {
  const { movies, loading, error } = useMovies();

  return (
    <main
      className="col-start-2 row-start-2 h-full min-h-0 overflow-y-auto"
      style={{ backgroundColor: "#080a0b" }}
    >
      <div
        className="grid gap-4 grid-cols-[1fr] md:grid-cols-[minmax(0,1fr)_250px] h-full min-h-0 bg-gray-900 rounded-md"
        style={{ backgroundColor: "#080a0b" }}
      >
        <div className="flex flex-col justify-start h-full min-h-0 gap-4 p-4">
          <Home />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {error ? (
              <div className="text-red-400 col-span-full p-4">{error}</div>
            ) : loading ? (
              <div className="text-gray-400 col-span-full p-4">Loading...</div>
            ) : movies === null || movies.length === 0 ? (
              <div className="text-gray-400 col-span-full p-4">
                No movies available
              </div>
            ) : (
              movies.map((m: any, idx: number) => {
                // support two shapes: raw movie object OR { id, pairs: [{key, value}, ...] }
                const movie: Record<string, any> =
                  m && m.pairs
                    ? Object.fromEntries(
                        m.pairs.map((p: any) => [p.key, p.value])
                      )
                    : m;

                const title: string =
                  movie?.title ?? movie?.name ?? `Movie ${idx + 1}`;
                const genres: string = Array.isArray(movie?.genres)
                  ? movie.genres.join(", ")
                  : movie?.genres ?? "";

                // prefer poster/posterUrl/image/backdrop fields if present
                const bgUrl: string | null =
                  movie?.posterUrl ??
                  movie?.poster ??
                  movie?.image ??
                  movie?.backdrop_path ??
                  null;

                return (
                  <article
                    key={movie?.id ?? idx}
                    className="bg-gray-800 rounded-lg overflow-hidden h-48 flex flex-col"
                    role="group"
                  >
                    <div
                      className="flex-1 bg-cover bg-center min-h-0"
                      style={{
                        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
                        backgroundColor: bgUrl ? undefined : "#111",
                        backgroundRepeat: "no-repeat",
                      }}
                    />

                    <div className="p-2">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{genres}</p>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        <Popularbar />
      </div>
    </main>
  );
}

export default Main;
// ...existing code...
