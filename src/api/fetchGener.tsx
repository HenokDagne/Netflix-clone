export async function fetchGener(endpoint: string = "/movies.json"): Promise<Set<string>> {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

    const data = await res.json();
    const genreSet = new Set<string>();

    const addGenres = (value: any) => {
      if (!value) return;
      if (Array.isArray(value)) {
        value.forEach((g) => {
          if (g) genreSet.add(String(g).trim());
        });
      } else if (typeof value === "string") {
        value
          .split(",")
          .map((s) => s.trim())
          .forEach((g) => g && genreSet.add(g));
      }
    };

    const addFromItem = (item: any) => {
      if (!item || typeof item !== "object") return;
      if ("genres" in item) addGenres(item.genres);
      else if ("genre" in item) addGenres(item.genre);
      else if ("categories" in item) addGenres(item.categories);
    };

    if (Array.isArray(data)) {
      data.forEach(addFromItem);
    } else if (data && typeof data === "object") {
      const keysToCheck = ["movies", "data", "items"];
      let handled = false;
      for (const k of keysToCheck) {
        if (Array.isArray((data as any)[k])) {
          (data as any)[k].forEach(addFromItem);
          handled = true;
        }
      }

      if (!handled) {
        // check object values that may be arrays of items
        for (const v of Object.values(data)) {
          if (Array.isArray(v)) v.forEach(addFromItem);
        }
        // finally try the object itself as a single item
        addFromItem(data);
      }
    }

    return genreSet;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return new Set();
  }
}