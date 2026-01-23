// ...existing code...

// ...existing code...
import Sidebar from "../../sidebar/Sidebar";
import Main from "./listcompenets/main/Main";

export function MoviesList() {
  return (
    <div className="h-screen w-screen bg-black text-white">
      <div className="grid grid-rows-[auto_1fr] grid-cols-[12rem_1fr] h-full">
        {/* Main container (rendered first in DOM) placed in the right column */}
        <Main />
        <Sidebar />
      </div>
    </div>
  );
}

export default MoviesList;
// ...existing code...
