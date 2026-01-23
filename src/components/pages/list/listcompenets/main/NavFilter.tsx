import { useEffect, useState } from "react";
import { fetchGener } from "../../../../../api/fetchGener";
import { useFilteredMovies } from "../../../../../context/useFilteredMovies";

export function NavFilter() {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedGenres, setSelectedGenres } = useFilteredMovies();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchGener() // uses default endpoint from your file, or call fetchGener('/movie.json') explicitly
      .then((set) => {
        if (!mounted) return;
        // convert Set -> Array and sort for stable order
        setGenres(Array.from(set).sort((a, b) => a.localeCompare(b)));
      })
      .catch((err) => {
        if (!mounted) return;
        console.error(err);
        setError("Failed to load genres");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="w-full p-2 text-sm text-gray-400">Loading filters…</div>
    );
  if (error)
    return <div className="w-full p-2 text-sm text-red-500">{error}</div>;
  if (genres.length === 0) return null; // nothing to render

  return (
    <div className="w-full bg-black">
      <div className="flex items-center gap-3 w-full p-2 overflow-x-auto whitespace-nowrap md:flex-wrap custom-scrollbar">
        {genres.map((g) => {
          const isActive = !!(
            Array.isArray(selectedGenres) &&
            selectedGenres.some(
              (s) => String(s).toLowerCase() === g.toLowerCase()
            )
          );
          const baseClass =
            "flex-shrink-0 text-xs md:text-sm px-3 py-1 rounded-full transition-colors bg-transparent border-2 border-green-500 text-white hover:bg-lime-400 hover:text-black";
          const activeClass = "bg-lime-400 text-black";
          return (
            <button
              key={g}
              type="button"
              aria-pressed={isActive}
              title={isActive ? `Clear filter ${g}` : `Filter by ${g}`}
              className={`${baseClass} ${isActive ? activeClass : ""}`}
              onClick={() => {
                // toggle selection: if already selected -> clear (show all), otherwise set this single genre
                try {
                  if (!setSelectedGenres) return;
                  if (isActive) {
                    setSelectedGenres(null);
                    // remove genre param from URL
                    const params = new URLSearchParams(window.location.search);
                    params.delete("genre");
                    const q = params.toString();
                    const url = q
                      ? `${window.location.pathname}?${q}`
                      : window.location.pathname;
                    window.history.pushState({}, "", url);
                  } else {
                    setSelectedGenres([g]);
                    // set genre param in URL
                    const params = new URLSearchParams(window.location.search);
                    params.set("genre", g);
                    const url = `${
                      window.location.pathname
                    }?${params.toString()}`;
                    window.history.pushState({}, "", url);
                  }
                } catch (err) {
                  // fail gracefully
                  console.error(err);
                }
              }}
              onDoubleClick={() => {
                // always clear filters on double-click
                try {
                  if (!setSelectedGenres) return;
                  setSelectedGenres(null);
                  const params = new URLSearchParams(window.location.search);
                  params.delete("genre");
                  const q = params.toString();
                  const url = q
                    ? `${window.location.pathname}?${q}`
                    : window.location.pathname;
                  window.history.pushState({}, "", url);
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default NavFilter;
