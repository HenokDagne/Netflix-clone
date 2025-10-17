// ...existing code...
import Home from "./Home";
import Popularbar from "./Popularbar";
import {Card} from "./Card";


function Main() {

  return (
    <main
      className="col-start-2 row-start-2 h-full min-h-0 overflow-y-auto"
      style={{ backgroundColor: "#080a0b" }}
    >
      <div
        className="grid gap-4 grid-cols-[1fr] md:grid-cols-[minmax(0,1fr)_250px] h-full min-h-0 bg-gray-900 rounded-md"
        style={{ backgroundColor: "#080a0b" }}
      >
        <div className="flex flex-col justify-start h-full min-h-0 gap-4 p-4">
          <Home />
          <Card />
        </div>

        <Popularbar />
      </div>
    </main>
  );
}

export default Main;
// ...existing code...
