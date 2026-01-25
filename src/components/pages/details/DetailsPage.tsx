import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import NavbarComponent from "../../navbar/NavbarComponent";
import Sidebar from "../../sidebar/Sidebar";
import Box from "./Box";
import { retrieve } from "../../../api/retrieve";
import type { Movie } from "../../../api/retrieve";

const DetailsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  const { state } = useLocation() as { state?: { movie?: Movie } };

  const [movie, setMovie] = useState<Movie | null>(state?.movie ?? null);
  const [loading, setLoading] = useState<boolean>(!state?.movie);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      setError("Missing or invalid movie id");
      setLoading(false);
      return;
    }

    // If already have the movie and ids match, no need to refetch.
    if (movie && movie.id === numericId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    retrieve(numericId)
      .then((data) => {
        setMovie(data);
        setError(null);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Failed to load movie";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const gridCols = sidebarOpen ? "grid-cols-[16rem_1fr]" : "grid-cols-1";
  const mainColClass = sidebarOpen
    ? "row-start-2 col-start-2"
    : "row-start-2 col-start-1";

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden">
      {/* grid: navbar spans full width; sidebar + main share second row */}
      <div className={`grid grid-rows-[auto_1fr] ${gridCols} h-full min-h-0`}>
        <div className="col-span-2 sticky top-0 z-20">
          <NavbarComponent onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        </div>
        {sidebarOpen && (
          <div className="row-start-2 col-start-1 h-full overflow-hidden">
            <Sidebar />
          </div>
        )}
        <div className={`${mainColClass} min-h-0 overflow-y-auto`}>
          <Box movie={movie ?? undefined} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};
export default DetailsPage;
