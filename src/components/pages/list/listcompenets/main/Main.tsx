import NavFilter from "./NavFilter";
import Cards from "./Cards";

type MainProps = {
  sidebarOpen?: boolean;
};

export function Main({ sidebarOpen = false }: MainProps) {
  return (
    <main
      className={`${sidebarOpen ? "col-start-2" : "col-start-1"} row-start-2 min-h-0 overflow-auto bg-[#080a0b]`}
    >
      <div className="sticky top-0 z-20 bg-[#080a0b]">
        <NavFilter />
      </div>

      {/* Page content area with responsive padding */}
      <div className="p-4 sm:p-6 md:p-8">
        {/* Responsive grid: 1 col mobile, 2 sm, 3 md, 4 lg, 5 xl */}
        <Cards />
      </div>
    </main>
  );
}

export default Main;
