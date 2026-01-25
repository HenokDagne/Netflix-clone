export type PouplarMovies = {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  posterUrl?: string | null;
  backdrop_path?: string | null;
  release_date?: string | null;
  genres?: string[];
  genre_ids?: number[];
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  original_language?: string;
  adult?: boolean;
  video?: boolean;
  favorite?: boolean;
  popular?: boolean;
};
function buildHeaders(): HeadersInit | undefined {
  // Use a dedicated bearer token if provided (TMDB v4 auth)
  const bearer = import.meta.env.VITE_API_BEARER as string | undefined;
  if (!bearer) return undefined;
  return { Authorization: `Bearer ${bearer}` };
}
function normalizeBool(value: unknown): boolean {
  return value === true;
}

const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// Base image URL used by TMDB for poster paths
const IMG = "https://image.tmdb.org/t/p/w500";

// Normalize genre IDs which may be an array of numbers or array of {id,name}
function normalizeGenreIds(input: unknown): number[] {
  if (Array.isArray(input)) {
    // array of numbers
    if (input.every((v) => typeof v === "number")) {
      return (input as number[]).filter((n) => Number.isFinite(n));
    }
    // array of objects with id
    return (input as unknown[])
      .map((g) => (g && typeof g === "object" ? (g as any).id : undefined))
      .filter(
        (id): id is number => typeof id === "number" && Number.isFinite(id),
      );
  }
  return [];
}

function mapGenres(input: unknown): string[] {
  // If we already have genre objects with names, prefer them
  if (Array.isArray(input) && input.every((g) => g && typeof g === "object")) {
    return (input as { name?: string }[])
      .map((g) => g?.name)
      .filter((v): v is string => Boolean(v));
  }

  const ids = normalizeGenreIds(input);
  if (!ids.length) return [];
  return ids.map((id) => GENRE_MAP[id]).filter((v): v is string => Boolean(v));
}

// ...existing code...
export async function fetchPopularMovies(): Promise<PouplarMovies[]> {
  const base =
    (import.meta.env.VITE_API_URL as string) || "https://api.themoviedb.org/3";
  const apiKey = (import.meta.env.VITE_API_KEY as string) || "";
  const url = `${base}/movie/popular${apiKey ? `?api_key=${apiKey}` : ""}`;
  const headers = buildHeaders();
  let response: Response;
  try {
    response = await fetch(url, { headers });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`Network error while fetching movie: ${detail}`);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch popular movies: ${response.status}`);
  }

  const json = await response.json();
  const results = Array.isArray(json?.results) ? json.results : [];

  const movies: PouplarMovies[] = results.map((d: any) => {
    const popularity = d.popularity ?? 0;
    const computedPopular = true; // items from this endpoint are popular
    const genreIds = normalizeGenreIds(d.genre_ids ?? d.genres);
    const genres = mapGenres(d.genres ?? genreIds);
    return {
      id: d.id,
      title: d.title ?? d.name,
      original_title: d.original_title ?? d.original_name,
      original_language: d.original_language ?? "",
      overview: d.overview ?? "",
      poster_path: d.poster_path ?? null,
      posterUrl: d.poster_path ? `${IMG}${d.poster_path}` : null,
      backdrop_path: d.backdrop_path ?? null,
      release_date: d.release_date ?? null,
      genres,
      genre_ids: genreIds,
      vote_average: d.vote_average ?? 0,
      vote_count: d.vote_count ?? 0,
      popularity,
      adult: normalizeBool(d.adult),
      video: normalizeBool(d.video),
      favorite: false,
      popular: d.popular ?? computedPopular,
    };
  });

  return movies.filter((m) => m.popular === true);
}
// ...existing code...
