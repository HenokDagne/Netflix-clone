import Home from "./Home";
import Popularbar from "./Popularbar";

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
        <div className="flex flex-col justify-start bg-green-600 h-full min-h-0 gap-4">
          <Home />
          <div className="grid grid-cols-4 gap-2 bg-white">
            
            <div className="bg-black">02</div>
            <div className="bg-black">03</div>
            <div className="bg-black">04</div>
            <div className="bg-black">05</div>
            <div className="bg-black">06</div>
            <div className="bg-black">07</div>
          </div>
        </div>
        <Popularbar />
      </div>
    </main>
  );
}
// ...existing code...
export default Main;
