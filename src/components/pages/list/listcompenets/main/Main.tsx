import NavFilter from "./NavFilter";
import NavbarComponent  from "../../../../navbar/NavbarComponent"; 
import  Cards  from "./Cards"; 

export function Main() {
  return (
    <main className="col-start-2 row-start-1 row-span-2 min-h-0 overflow-auto bg-[#080a0b]">
      {/* NavFilter stays visible on top (sticky) on all viewports */}
       <div className="sticky top-0 z-20 bg-[#080a0b]">
        <NavbarComponent />
      </div>
      <div className="sticky top-0 z-20 bg-[#080a0b]">
        <NavFilter />
      </div>

      {/* Page content area with responsive padding */}
      <div className="p-4 sm:p-6 md:p-8">
        {/* Responsive grid: 1 col mobile, 2 sm, 3 md, 4 lg, 5 xl */}
        <Cards />

        {/* Example: responsive footer spacing */}
        <div className="mt-6 text-sm text-gray-400">Showing 12 items</div>
      </div>
    </main>
  );
}

export default Main;
