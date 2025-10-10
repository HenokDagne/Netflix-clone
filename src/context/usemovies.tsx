import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchData } from "../api/data";

type Movie = {
  id?: number;
  title?: string;
  name?: string;
  poster?: string;
  image?: string;
  genres?: string[];
  [key: string]: any;
};

type MoviesContextValue = {
  movies: Movie[] | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

const MoviesContext = createContext<MoviesContextValue | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData("/movie.json");
      // fetchData returns transformed objects; if your fetchData returns pairs,
      // adapt here to get original movie objects. Below assumes fetchData returned original array.
      // If fetchData returns [{ id, pairs }], transform back or change fetchData to return raw movies.
      setMovies(Array.isArray(data) ? (data as any) : []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load movies");
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