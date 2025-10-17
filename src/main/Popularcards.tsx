import { useMovies } from "../context/usemovies";

export function Popularcards() {
  const moviesFromHook = useMovies();
  const popular = Array.isArray(moviesFromHook) ? moviesFromHook : (moviesFromHook?.movies ?? []);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-black overflow-y-auto overflow-x-auto no-scrollbar">
      {/* content for top box */}
      <p className="text-2xl font-mono font-extrabold text-white px-2">
        Popular
      </p>
      {popular
        .filter((movie: any) => movie.popular)
        .map((movie: any) => (
          <div
            key={movie.id ?? movie.key}
            className="flex flex-row p-2  bg-black items-center mb-2"
            style={{ minHeight: 84 }}
          >
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt=""
                width={64}
                height={84}
                style={{ width: 64, height: 84, objectFit: "cover", flexShrink: 0 }}
                className="mr-3 rounded-xl"
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
                  borderRadius: "0.25rem"
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
                {(movie.genres || []).join(" | ")}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Popularcards;
