// ...existing code...
/**
 * Fetch JSON and convert each movie object to an array of key/value pairs.
 * @param {string} endpoint - URL to the JSON (default: /movie.json)
 * @returns {Promise<Array<{id: number, pairs: Array<{key: string, value: any}>}>>}
 */
export async function fetchData(endpoint = "/movie.json") {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    const movies = data.map((movie: Record<string, any>, idx: number) => ({
      id: movie.id ?? idx,
      pairs: Object.entries(movie).map(([key, value]) => ({ key, value })),
    }));

    return movies;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
// ...existing code...