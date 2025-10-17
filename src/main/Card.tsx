import { useMovies } from "../context/usemovies";



export function Card() {
  const { movies, loading, error } = useMovies();

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="flex space-x-4 p-2">
        {error ? (
          <div className="text-red-400 p-4">{error}</div>
        ) : loading ? (
          <div className="text-gray-400 p-4">Loading...</div>
        ) : movies === null || movies.length === 0 ? (
          <div className="text-gray-400 p-4">No movies available</div>
        ) : (
          movies.map((m: any, idx: number) => {
            // support two shapes: raw movie object OR { id, pairs: [{key, value}, ...] }
            const movie: Record<string, any> =
              m && m.pairs
                ? Object.fromEntries(m.pairs.map((p: any) => [p.key, p.value]))
                : m;

            const title: string =
              movie?.title ?? movie?.name ?? `Movie ${idx + 1}`;
            const genres: string = Array.isArray(movie?.genres)
              ? movie.genres.join(" | ")
              : movie?.genres ?? "";

            const imgSrc: string | null =
              movie?.posterUrl ??
              movie?.poster ??
              movie?.image ??
              movie?.backdrop_path ??
              null;

            return (
              <article
                key={movie?.id ?? idx}
                className="min-w-[220px] max-w-[220px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-md group
               transition-shadow duration-200 ease-out transform-gpu overflow-visible
               hover:shadow-lg hover:shadow-amber-500/50 hover:scale-105
                "
                role="group"
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={title}
                    className="rounded-t-lg w-full h-48 object-cover"
                  />
                ) : (
                  <div className="rounded-t-lg w-full h-48 bg-gray-700" />
                )}

                <div className="p-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {genres}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Card;
