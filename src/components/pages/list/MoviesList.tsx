// ...existing code...

// ...existing code...
import { useState } from "react";
import Sidebar from "../../sidebar/Sidebar";
import NavbarComponent from "../../navbar/NavbarComponent";
import Main from "./listcompenets/main/Main";

export function MoviesList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden">
      <div
        className={`grid grid-rows-[auto_1fr] h-full min-h-0 ${
          sidebarOpen ? "grid-cols-[16rem_1fr]" : "grid-cols-1"
        }`}
      >
        <div className="col-span-2 sticky top-0 z-20">
          <NavbarComponent onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        </div>
        {sidebarOpen && (
          <div className="row-start-2 col-start-1 h-full overflow-hidden">
            <Sidebar isOpen={sidebarOpen} />
          </div>
        )}
        <div
          className={`row-start-2 ${
            sidebarOpen ? "col-start-2" : "col-span-1"
          } min-h-0 overflow-y-auto`}
        >
          <Main sidebarOpen={sidebarOpen} />
        </div>
      </div>
    </div>
  );
}

export default MoviesList;
// ...existing code...
