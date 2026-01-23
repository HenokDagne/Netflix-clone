// ...existing code...
import { useState } from "react";

function Sidebars() {
  const [open, setOpen] = useState(false);

  const content = (
    <>
      <div className="mb-6 text-2xl font-semibold">Netflix</div>

      <div className="mb-4 text-sm text-gray-400">Filter by release year</div>

      <nav className="space-y-3 text-sm text-gray-300">
        <label className="flex items-center space-x-3 py-2">
          <input
            type="checkbox"
            name="year"
            value="1995"
            className="h-4 w-4 accent-lime-400 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-lime-400"
          />
          <span>1995</span>
        </label>

        <label className="flex items-center space-x-3 py-2">
          <input
            type="checkbox"
            name="year"
            value="2000"
            className="h-4 w-4 accent-lime-400 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-lime-400"
          />
          <span>2000</span>
        </label>

        <label className="flex items-center space-x-3 py-2">
          <input
            type="checkbox"
            name="year"
            value="2008"
            className="h-4 w-4 accent-lime-400 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-lime-400"
          />
          <span>2008</span>
        </label>

        <label className="flex items-center space-x-3 py-2">
          <input
            type="checkbox"
            name="year"
            value="2009"
            className="h-4 w-4 accent-lime-400 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-lime-400"
          />
          <span>2009</span>
        </label>

        <label className="flex items-center space-x-3 py-2">
          <input
            type="checkbox"
            name="year"
            value="2020"
            className="h-4 w-4 accent-lime-400 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-lime-400"
          />
          <span>2020</span>
        </label>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile: toggle button */}
      <div className="md:hidden p-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center px-3 py-2 bg-transparent border-2 border-green-500 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400"
          aria-expanded={open}
          aria-controls="mobile-filters"
        >
          Filters
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <aside
            id="mobile-filters"
            className="fixed left-0 top-0 bottom-0 w-60 bg-[#080a0b] p-6 overflow-y-auto shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold text-white">Filters</div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-white focus:outline-none"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            {content}
          </aside>
        </div>
      )}

      {/* Desktop / Tablet persistent sidebar */}
      <aside
        className="hidden md:block row-span-2 col-start-1 bg-gray-900 border-r border-gray-800 p-6 overflow-y-auto"
        style={{ backgroundColor: "#080a0b" }}
      >
        {content}
      </aside>
    </>
  );
}

export default Sidebars;
// ...existing code...
// ...existing code...
