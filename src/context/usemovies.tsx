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
  title?: string;
  name?: string;
  poster?: string;
  image?: string;
  genres?: string[];
  popular?: boolean;
  favorite?: boolean;
  [key: string]: any;
};

type MoviesContextValue = {
  movies: Movie[] | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

const MoviesContext = createContext<MoviesContextValue | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData("/movie.json");
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
              return Object.fromEntries(entries) as Movie;
            }
          }
          return (item as Movie) ?? ({} as Movie);
        });
      }
      setMovies(normalized);
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
  }, []);

  return (
    <MoviesContext.Provider value={{ movies, loading, error, reload: load }}>
      {children}
    </MoviesContext.Provider>
  );
};

export function useMovies() {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be used within MoviesProvider");
  return ctx;
}
