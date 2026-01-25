/**
 * Home
 *
 * Top-level layout component that composes the application shell:
 * - Renders a full-screen container with a black background and white text.
 * - Uses a CSS grid with two columns and two rows: grid-cols-[12rem_1fr] and grid-rows-[auto_1fr].
 *   - Left column (12rem) hosts Sidebar and spans both the navbar row and the main row (fixed/anchored).
 *   - Right column is flexible and contains NavbarComponent in the top (auto) row and Main in the remaining (1fr) row.
 *
 * The grid design ensures the navbar takes its natural height while the main area fills available vertical space.
 * This component is purely presentational and does not accept props.
 *
 * @returns {JSX.Element} The application layout containing Sidebar, NavbarComponent and Main.
 *
 * @example
 * <Home />
 */
// filepath: [Home.tsx](http://_vscodecontentref_/1)

// ...existing code...
import React, { useState } from "react";
import NavbarComponent from "./components/navbar/NavbarComponent";
import Sidebar from "./components/sidebar/Sidebar";
import Main from "./main/Main";

const Home: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <Main />
        </div>
      </div>
    </div>
  );
};

export default Home;
// ...existing code...
