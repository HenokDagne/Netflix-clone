import  Popularcards  from "./Popularcards"; 
import Favorites  from "./Favorites";


function Popularbar() {
  return (
    // sidebar: full height (min-h-0 allows children to shrink inside grid)
    <div className="flex flex-col bg-blue-600 h-full min-h-0">
      {/* Two equal boxes that share available height and scroll if content overflows */}
      <Popularcards />
      <Favorites />

      
    </div>
  );
}

export default Popularbar;
