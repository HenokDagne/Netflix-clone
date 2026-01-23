export async function fetchGener(
  endpoint: string = "/movie.json"
): Promise<Set<string>> {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(
        `Fetch failed: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    const genreSet = new Set<string>();

    const addFromItem = (item: unknown) => {
      if (!item || typeof item !== "object") return;
      const obj = item as Record<string, unknown>;
      // supports item.genres: string[] or item.genre: string (possibly comma separated)
      if (Array.isArray(obj.genres)) {
        (obj.genres as unknown[]).forEach((g) => {
          if (g) genreSet.add(String(g));
        });
      } else if (obj.genre) {
        if (Array.isArray(obj.genre)) {
          (obj.genre as unknown[]).forEach((g) => {
            if (g) genreSet.add(String(g));
          });
        } else if (typeof obj.genre === "string") {
          (obj.genre as string)
            .split(",")
            .map((s: string) => s.trim())
            .forEach((g: string) => {
              if (g) genreSet.add(g);
            });
        }
      }
    };

    // data as array of items
    if (Array.isArray(data)) {
      data.forEach(addFromItem);
    } else if (data && typeof data === "object") {
      // common container keys
      const keysToCheck = ["movies", "data", "items"];
      let handled = false;
      for (const k of keysToCheck) {
        const val = (data as Record<string, unknown>)[k];
        if (Array.isArray(val)) {
          (val as unknown[]).forEach(addFromItem);
          handled = true;
        }
      }
      // if not handled, check object values (could be map of arrays) or single item
      if (!handled) {
        for (const v of Object.values(data)) {
          if (Array.isArray(v)) {
            v.forEach(addFromItem);
          } else if (v && typeof v === "object") {
            addFromItem(v);
          }
        }
      }
    }

    return genreSet;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return new Set<string>();
  }
}
