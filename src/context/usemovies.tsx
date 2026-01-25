import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { fetchData } from "../api/data";

type Movie = {
  id?: number;
  original_title?: string;
  poster_path?: string;
  posterUrl?: string;
  genre_ids?: number[];
  genres?: string[];
  popularity?: number;
  popularityTier?: "low" | "popular" | "very-popular";
  popular?: boolean;
  favorite?: boolean;
  adult?: boolean;
  release_date?: string;
  original_language?: string;
  overview?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  [key: string]: unknown;
};

type MoviesContextValue = {
  movies: Movie[] | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  favorites: number[];
  toggleFavorite: (id: number) => void;
};

const MoviesContext = createContext<MoviesContextValue | undefined>(undefined);

function computePopularity(pop?: unknown) {
  const n = Number(pop ?? 0) || 0;
  if (n >= 500)
    return {
      popularity: n,
      popularityTier: "very-popular",
      popular: true,
    } as const;
  if (n >= 100)
    return { popularity: n, popularityTier: "popular", popular: true } as const;
  return { popularity: n, popularityTier: "low", popular: false } as const;
}

export const MoviesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem("favorites");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed))
        return parsed.map((v) => Number(v)).filter(Boolean);
      return [];
    } catch {
      return [];
    }
  });

  const saveFavorites = (next: number[]) => {
    try {
      localStorage.setItem("favorites", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      const next = Array.from(s);
      saveFavorites(next);
      // update movies state
      setMovies((mv) =>
        mv
          ? mv.map((m) => (m.id === id ? { ...m, favorite: s.has(id) } : m))
          : mv,
      );
      return next;
    });
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch live TMDB data first (requires VITE_API_KEY in .env)
      const tmdbUrl =
        (import.meta.env.VITE_API_URL as string) ||
        "https://api.themoviedb.org/3";
      const tmdbKey = (import.meta.env.VITE_API_KEY as string) || "";

      let useData: unknown = null;

      if (tmdbKey) {
        try {
          // fetch genre map
          const gRes = await fetch(
            `${tmdbUrl}/genre/movie/list?api_key=${tmdbKey}`,
          );
          const genreMap: Record<number, string> = {};
          if (gRes.ok) {
            const gjson = await gRes.json();
            if (Array.isArray(gjson?.genres)) {
              for (const g of gjson.genres) {
                if (g && typeof g.id === "number")
                  genreMap[g.id] = String(g.name);
              }
            }
          }

          const res = await fetch(
            `${tmdbUrl}/movie/popular?api_key=${tmdbKey}`,
          );
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json?.results)) {
              // map results into shape similar to local data
              useData = json.results.map((m: unknown) => {
                const mm = m as Record<string, unknown>;
                const poster_path = mm.poster_path as string | undefined;
                const gids = mm.genre_ids as unknown;
                const mapped = Array.isArray(gids)
                  ? (gids as number[]).map((id) => genreMap[id]).filter(Boolean)
                  : undefined;
                const pop = computePopularity(mm.popularity);
                return {
                  ...(mm as Record<string, unknown>),
                  posterUrl: poster_path
                    ? `https://image.tmdb.org/t/p/w500${poster_path}`
                    : undefined,
                  genres: mapped,
                  popularity: pop.popularity,
                  popularityTier: pop.popularityTier,
                  popular: pop.popular,
                  favorite: !!(mm.id && favorites.includes(Number(mm.id))),
                } as Movie;
              });
            }
          } else {
            console.warn(
              "TMDB popular fetch failed",
              res.status,
              res.statusText,
            );
          }
        } catch (tmerr) {
          console.warn("TMDB fetch failed, falling back to local data", tmerr);
        }
      }

      // fallback to local static file if live fetch didn't set useData
      const data = useData ?? (await fetchData("/movie.json"));
      // fetchData currently converts each movie into { id, pairs: [{key,value}] }
      // Normalize that shape back into plain movie objects so components can use fields like title, genres, popular.
      let normalized: Movie[] = [];
      if (Array.isArray(data)) {
        normalized = data.map((item: unknown) => {
          if (item && typeof item === "object") {
            const obj = item as Record<string, unknown>;
            if (Array.isArray(obj.pairs)) {
              const entries = (obj.pairs as unknown[]).map((p) => {
                if (p && typeof p === "object") {
                  const pair = p as Record<string, unknown>;
                  return [String(pair.key), pair.value];
                }
                return ["", undefined];
              });
              const movie = Object.fromEntries(entries) as Movie;
              // derive posterUrl if poster_path exists
              if (!movie.posterUrl && movie.poster_path) {
                movie.posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
              }
              // compute popularity flags
              const pop = computePopularity(movie.popularity);
              movie.popularity = pop.popularity;
              movie.popularityTier = pop.popularityTier;
              movie.popular = pop.popular;
              movie.favorite = !!(
                movie.id && favorites.includes(Number(movie.id))
              );
              return movie;
            }
          }
          const plain = (item as Movie) ?? ({} as Movie);
          // ensure posterUrl for plain items too
          if (!plain.posterUrl && plain.poster_path) {
            plain.posterUrl = `https://image.tmdb.org/t/p/w500${plain.poster_path}`;
          }
          const pop = computePopularity(plain.popularity);
          plain.popularity = pop.popularity;
          plain.popularityTier = pop.popularityTier;
          plain.popular = pop.popular;
          plain.favorite = !!(plain.id && favorites.includes(Number(plain.id)));
          return plain;
        });
      }
      setMovies(normalized);
      console.log("Movies loaded", normalized);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to load movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MoviesContext.Provider
      value={{
        movies,
        loading,
        error,
        reload: load,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export function useMovies() {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be used within MoviesProvider");
  return ctx;
}
