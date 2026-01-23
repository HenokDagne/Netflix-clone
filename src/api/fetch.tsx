// /src/api/fetch.tsx

export interface Movie {
  id?: number;
  title?: string;
  name?: string;
  [key: string]: any;
}

export async function getMovieCard(): Promise<Movie[] | null> {
  const url = (import.meta.env.VITE_API_URL as string) || "https://api.themoviedb.org/3";
  const Api_key = (import.meta.env.VITE_API_KEY as string) || "";

  try {
    if (!Api_key) {
      console.error("getMovieCard: missing VITE_API_KEY in import.meta.env");
      throw new Error("Missing API key");
    }

    const reqUrl = `${url}/movie/popular?api_key=${Api_key}`;
    const response = await fetch(reqUrl);

    if (!response.ok) {
      const body = await response.text().catch(() => "<non-text response>");
      console.error(
        "getMovieCard: fetch error",
        response.status,
        response.statusText,
        body
      );
      throw new Error(
        `Fetch failed: ${response.status} ${response.statusText} - ${body}`
      );
    }

    const data = await response.json();
    const items: Movie[] = Array.isArray(data?.results) ? (data.results as Movie[]) : [];

    // Optionally log objects instead of names
    console.log("movie objects:", items);

    return items;
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return null;
  }
}

export async function searchMovies(params: string): Promise<Movie[] | null> {
  const url = (import.meta.env.VITE_API_URL as string) || "https://api.themoviedb.org/3";
  const Api_key = (import.meta.env.VITE_API_KEY as string) || "";

  try {
    if (!Api_key) {
      console.error("searchMovies: missing VITE_API_KEY in import.meta.env");
      throw new Error("Missing API key");
    }

    const reqUrl = `${url}/search/movie?api_key=${Api_key}&query=${encodeURIComponent(
      params
    )}`;
    const response = await fetch(reqUrl);

    if (!response.ok) {
      const body = await response.text().catch(() => "<non-text response>");
      console.error(
        "searchMovies: fetch error",
        response.status,
        response.statusText,
        body
      );
      throw new Error(
        `Search failed: ${response.status} ${response.statusText} - ${body}`
      );
    }

    const data = await response.json();
    const items: Movie[] = Array.isArray(data?.results) ? (data.results as Movie[]) : [];
    console.log("search results (objects):", items);
    return items;
  } catch (error) {
    console.error("Error searching movies:", error);
    return null;
  }
}

export default getMovieCard;

/* Dev helper: expose functions in DEV so you can call from console */
declare global {
  interface Window {
    getMovieCard?: typeof getMovieCard;
    searchMovies?: typeof searchMovies;
  }
}

if (typeof window !== "undefined" && import.meta.env.DEV) {
  window.getMovieCard = getMovieCard;
  window.searchMovies = searchMovies;

  // optional auto-run (will log or show error)
  getMovieCard()
    .then((res) => console.log("getMovieCard result:", res))
    .catch((err) => console.error("getMovieCard error:", err));
}
