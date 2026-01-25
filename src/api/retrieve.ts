// Fetched a movie by TMDB ID and normalized fields used in detailsPage.

export type Movie = {
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
  popularityTier?: string;
  original_language?: string;
  adult?: boolean;
  video?: boolean;
  favorite?: boolean;
  popular?: boolean;
};

const IMG = "https://image.tmdb.org/t/p/w500";

type PopularityTier = "low" | "popular" | "very-popular";

function toTier(popularity?: number | null): PopularityTier {
  const p = popularity ?? 0;
  if (p < 100) return "low";
  if (p < 300) return "popular";
  return "very-popular";
}

function normalizeBool(value: unknown): boolean {
  return value === true;
}

function normalizeGenreIds(input: unknown): number[] {
  if (Array.isArray(input)) {
    return input
      .map((g) => {
        if (typeof g === "number") return g;
        if (g && typeof g === "object" && "id" in g) {
          const id = (g as { id: unknown }).id;
          return typeof id === "number" ? id : Number(id);
        }
        return NaN;
      })
      .filter((n) => Number.isFinite(n)) as number[];
  }
  return [];
}

function buildHeaders(): HeadersInit | undefined {
  const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
  if (!apiKey) return undefined;
  return { Authorization: `Bearer ${apiKey}` };
}

export async function retrieve(id: number): Promise<Movie> {
  if (!Number.isFinite(id)) {
    throw new Error("Invalid movie id");
  }

  const headers = buildHeaders();
  const url = `https://api.themoviedb.org/3/movie/${id}`;

  let response: Response;
  try {
    response = await fetch(url, { headers });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`Network error while fetching movie: ${detail}`);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch movie with id ${id}: ${response.status}`);
  }

  const d = await response.json();

  const popularity = d.popularity ?? 0;
  const computedPopular = popularity > 100;

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
    genres: Array.isArray(d.genres)
      ? d.genres.map((g: { id: number; name: string }) => g.name)
      : [],
    genre_ids: Array.isArray(d.genres)
      ? normalizeGenreIds(d.genres)
      : normalizeGenreIds(d.genre_ids),
    vote_average: d.vote_average ?? 0,
    vote_count: d.vote_count ?? 0,
    popularity,
    popularityTier: toTier(popularity),
    adult: normalizeBool(d.adult),
    video: normalizeBool(d.video),
    favorite: false,
    popular: d.popular ?? computedPopular,
  };
}
