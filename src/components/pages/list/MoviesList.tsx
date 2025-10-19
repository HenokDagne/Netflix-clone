// ...existing code...

// ...existing code...
import Sidebars from "./listcompenets/sidbar/Sidebars";
import Main from "./listcompenets/main/main";

export function MoviesList() {
  return (
    <div className="h-screen w-screen bg-black text-white">
      <div className="grid grid-rows-[auto_1fr] grid-cols-[16rem_1fr] h-full">
        {/* Main container (rendered first in DOM) placed in the right column */}
        <Main />
        <Sidebars />
      </div>
    </div>
  );
}

export default MoviesList;
// ...existing code...
