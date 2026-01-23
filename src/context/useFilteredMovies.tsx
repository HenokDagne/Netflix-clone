import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { useMovies } from "./usemovies";

// user type

type FiltedMovies = {
  id?: number;
  title?: string;
  name?: string;
  releaseDate?: string;
  image?: string;
  genres?: string[];
  popular?: boolean;
  favorite?: boolean;
  [key: string]: unknown;
};

// define the context type
type FilteredMoviesContextValue = {
  movies: FiltedMovies[] | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  // currently selected genre(s) managed by provider (optional)
  selectedGenres?: string[];
  setSelectedGenres?: (g: string[] | null) => void;
};

// create context with undefined as default
const Filtered = createContext<FilteredMoviesContextValue | undefined>(
  undefined
);

export const FilteredMoviesProvider: React.FC<{
  children: ReactNode;
  initialGenres?: string[] | null;
}> = ({ children, initialGenres = null }) => {
  const [allMovies, setAllMovies] = useState<FiltedMovies[] | null>(null);
  const [movies, setMovies] = useState<FiltedMovies[] | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[] | null>(
    initialGenres
  );
  // use loading/error from MoviesProvider
  // local loading/error state not needed; derive from movies provider

  const getSelectedGenreFromUrl = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("genre") || params.get("genres") || null;
    } catch {
      return null;
    }
  };

  const applyGenreFilter = (data: FiltedMovies[] | null) => {
    if (!data) return null;
    // priority: provider-selected genres (selectedGenres) > URL query
    const genresToMatch =
      selectedGenres && selectedGenres.length
        ? selectedGenres
        : getSelectedGenreFromUrl()
        ? [getSelectedGenreFromUrl() as string]
        : null;
    if (!genresToMatch || genresToMatch.length === 0) return data;

    const lower = genresToMatch.map((g) => g.toLowerCase());
    return data.filter(
      (m) =>
        Array.isArray(m.genres) &&
        m.genres.some((g) => lower.includes(String(g).toLowerCase()))
    );
  };

  // consume movies from the MoviesProvider so we don't double-fetch
  const {
    movies: moviesFromProvider,
    loading: moviesLoading,
    error: moviesError,
    reload: reloadMovies,
  } = useMovies();

  // update when the source movies change
  useEffect(() => {
    setAllMovies(moviesFromProvider ?? null);
    setMovies(applyGenreFilter(moviesFromProvider ?? null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moviesFromProvider, selectedGenres]);

  // update when navigation (query) changes — only if provider isn't explicitly selecting genres
  useEffect(() => {
    const onPop = () => {
      if (!selectedGenres || selectedGenres.length === 0) {
        setMovies(applyGenreFilter(moviesFromProvider ?? null));
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moviesFromProvider, selectedGenres]);

  // also react to manual changes to allMovies (e.g., reload)
  useEffect(() => {
    setMovies(applyGenreFilter(allMovies));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMovies, selectedGenres]);

  const reload = async () => {
    // delegate reload to MoviesProvider
    if (reloadMovies) await reloadMovies();
  };

  return (
    <Filtered.Provider
      value={{
        movies,
        loading: moviesLoading ?? false,
        error: moviesError ?? null,
        reload,
        selectedGenres: selectedGenres ?? undefined,
        setSelectedGenres: (g) => setSelectedGenres(g ?? null),
      }}
    >
      {children}
    </Filtered.Provider>
  );
};

export const useFilteredMovies = () => {
  const ctx = useContext(Filtered);
  if (!ctx)
    throw new Error(
      "useFilteredMovies must be used within FilteredMoviesProvider"
    );
  return ctx;
};
